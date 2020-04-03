<template lang="pug">
  v-container
    v-layout(row justify-center align-center)
      v-flex(xs12 md6)
        v-card
          v-card-text
            h1 Create Account
            v-form(
              v-model="valid"
              ref="form"
            )
              v-layout(column)
                v-flex(xs12).pa-1
                  v-text-field(
                    v-model="user.firstName"
                    outline
                    label="First Name*"
                    :rules="[requiredRule]"
                    :disabled="loading"
                  )
                v-flex(xs12).pa-1
                  v-text-field(
                    v-model="user.middleName"
                    outline
                    label="Middle Name"
                    :disabled="loading"
                  )
                v-flex(xs12).pa-1
                  v-text-field(
                    v-model="user.lastName"
                    outline
                    label="Last Name*"
                    :rules="[requiredRule]"
                    :disabled="loading"
                  )
              v-layout(row).mb-4.pb-1
                v-flex(xs6).pa-1
                  v-select(
                    v-model="user.sex"
                    :items="sexes"
                    :rules="[requiredRule]"
                    label="Sex*"
                    item-text="text"
                    item-value="value"
                    outline
                    hide-details
                    menu-props="bottom, offset-y"
                  )
                v-flex(xs6).pa-1
                  date-picker-menu(
                    v-model="user.dateOfBirth"
                    :max="today"
                    outline
                    hide-details
                    :height="60"
                  )
              v-layout(row)
                v-flex(xs12).pa-1
                  v-text-field(
                    v-model="user.email"
                    label="Email"
                    outline
                    clearable
                    :rules="[requiredRule, emailRule]"
                  )
              v-layout(row)
                v-flex(xs6).pa-1
                  v-text-field(
                    v-model="user.password"
                    label="Password"
                    outline
                    :type="showPass ? 'text' : 'password'"
                    :rules="[requiredRule, passwordRule]"
                    :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                    :disabled="loading"
                    @click:append="showPass = !showPass"
                  )
                v-flex(xs6).pa-1
                  v-text-field(
                    v-model="confirmPassword"
                    label="Confirm Password"
                    outline
                    type="password"
                    :rules="[requiredRule, matchPasswordRule]"
                    :disabled="loading"
                  )
              v-checkbox(
                v-model="acceptTerms"
                hide-details
                style="margin-top: -10px"
                :rules="[requiredRule]"
                :disabled="loading"
              ).mb-4
                template(slot="label")
                  p(style="margin-bottom: -12px") By creating a LabResult account, you're agreeing to accept LabResult&nbsp;
                    a(target="_blank" @click.stop="gotoTerms") Terms & Privacy Policy
              v-alert(:value="error" type="error").mt-5 {{errorMessage}}
          v-card-actions
            v-spacer
            v-btn(
              large
              color="primary"
              :disabled="loading"
              :loading="loading"
              @click="submit"
            ).text-none Create Account
</template>

<script>
// components
import DatePickerMenu from '@mycure/web-plugins/lib/components/commons/date-picker-menu';
// utils
import { omit } from 'lodash';
import { format } from 'date-fns';

const PASS_LENGTH = 6;

export default {
  components: { DatePickerMenu },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      loading: false,
      showPass: false,
      valid: false,
      error: false,
      errorMessage: 'There was an error please try again later.',
      user: {
        password: '',
      },
      acceptTerms: false,
      confirmPassword: '',
      requiredRule: v => !!v || 'This field is required',
      emailRule: v => /.+@.+/.test(v) || 'Email address must be valid',
      matchPasswordRule: v => v === this.user.password || 'Passwords do not match',
      passwordRule: v => v.length >= PASS_LENGTH || 'Password length must be at least 6 characters.',
      sexes: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
      today: format(Date.now(), 'YYYY-MM-DD'),
    };
  },
  beforeMount () {
    if (!this.id) this.$router.push({ path: '/notfound' });
  },
  methods: {
    async submit () {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        const account = {
          password: this.user.password,
          email: this.user.email,
          invitation: this.id,
          personalDetails: {
            name: {
              firstName: this.user.firstName,
              middleName: this.user.middleName,
              lastName: this.user.lastName,
            },
            ...omit(this.user, ['password', 'firstName', 'middleName', 'lastName']),
          },
        };
        await this.$sdk.service('accounts').create(account);
        this.$snack({
          text: 'Account creation success!',
          color: 'success',
        });
        this.$router.push({ path: '/' });
      } catch (error) {
        this.$snack(error);
      } finally {
        this.loading = false;
      }
    },
    gotoTerms () {
      window.open('https://mycure.md/terms', '_blank');
    },
  },
};
</script>
