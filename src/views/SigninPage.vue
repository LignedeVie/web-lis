<template lang="pug">
  v-content
    v-dialog(
      v-model="dialog"
      persistent
      width="400"
    )
      v-card
        v-card-title.grey.lighten-4
          h3 {{ title }}
        v-card-text
          span {{ message }}
        v-card-actions
          v-spacer
          v-btn(
            flat
            depressed
            color="secondary"
            @click.stop="dialog = false;"
          ).text-none Close
    v-container(fluid fill-height)
      v-layout(row align-center justify-center)
        v-flex(xs12 md4)
          v-form(
            ref="form"
            @submit.prevent="signin"
            lazy-validation
          )
            v-card
              v-card-title.px-4.pt-4.pb-0
                v-layout(row)
                  img(src="@/assets/images/lab-result-logo.svg" width="150")
                  v-spacer
                  m-btn(
                    :icon="connected ? 'mdi-wifi' : 'mdi-wifi-off'"
                    :color="connected ? 'success' : 'error'"
                    @click="checkAPIServer"
                    :loading="verifying"
                    tooltip="API Server Connection"
                  ).ml-auto
              v-card-text.px-4.pb-4.pt-0
                v-layout(row)
                  v-layout(column)
                    h1 It's nice to see you here!
                    small.grey--text(style="padding-bottom: 48px;") Good day! Welcome to LabResult.org.
                    m-email-field(
                      v-model="email"
                      solo
                      autofocus
                      hide-default-icon
                      label="Email Address"
                      placeholder="Email Address"
                      :outline="false"
                      :rules="[v => !!v || 'Email is required.']"
                    )
                    m-password-field(
                      v-model="password"
                      solo
                      hide-default-icon
                      placeholder="Password"
                      :outline="false"
                      :counter="false"
                      :rules="[v => !!v || 'Password is required.']"
                      :require-min-length="false"
                    )
              v-card-actions.px-4.pb-4.pt-0
                v-spacer
                m-btn(
                  type="submit"
                  :loading="loading"
                  color="primary"
                  large
                ).text-none Sign In
</template>

<script>
export default {
  name: 'SigninPage',
  props: {
    // redirection URL on successful signin
    target: {
      type: String,
      default: '/',
    },
  },
  data: () => ({
    loading: false,
    email: '',
    password: '',
    verifying: false,
    connected: false,
    dialog: false,
    message: '',
    title: '',
  }),
  beforeDestroy () {
    if (typeof this.$refs.form?.reset === 'function') {
      this.$refs.form.reset();
    }
  },
  created () {
    // check sdk initialize
    if (!this.$sdk.initialized) {
      this.$router.push('/');
      return;
    }
    this.checkAPIServer();
  },
  methods: {
    async checkAPIServer () {
      this.verifying = true;
      try {
        // test server URI
        const version = await this.$sdk.request('get', 'version', null, null, {
          skipResultToJSON: true,
        }).catch((error) => {
          this.connected = false;
          throw error;
        });
        this.connected = !!version;
      } catch (error) {
        console.error(error);
        // NOTE: temporary solution for standard dialog look
        this.title = 'Server Connection Error';
        this.message = error.message;
        this.dialog = true;
      }
      this.verifying = false;
    },
    async signin () {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      try {
        await this.$store.dispatch('auth/signin', { email: this.email, password: this.password });
        this.$router.push({ replace: true, path: this.target });
      } catch (error) {
        console.error(error);
        // NOTE: temporary solution for standard dialog look
        this.title = 'Sign In Error';
        this.message = error.message;
        this.dialog = true;
      }
      this.loading = false;
    },
  },
};
</script>
