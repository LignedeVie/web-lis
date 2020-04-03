<template lang="pug">
  fragment
    v-toolbar(app flat)
      v-toolbar-title
        img(src="@/assets/images/lab-result-logo.svg" width="200")
    v-content
      v-container
        v-layout(row).mt-5
          v-layout(column).text-xs-center
            // no code
            template(v-if="!code")
              div.text-center
                h2.font-weight-medium Something went Wrong!
                div.subtitle Please try again later.
                router-link(to="/") Back to home
                br
                code.mt-3 Code required

            // normal
            template(v-else)
              v-form(ref="form" @submit.prevent="resetPassword")
                v-card(width="500").mx-auto
                  v-card-title.mb-3
                    h2.font-weight-medium Reset Password
                  v-card-text
                    m-password-field(v-model="password")
                    m-password-field(v-model="passwordConfirm" :rules="passwordConfirmRules" label="Confirm Password")
                    m-btn(type="submit" color="primary" large) Submit
</template>

<script>
export default {
  props: {
    code: {
      type: String,
      default: undefined,
    },
  },
  data: vm => ({
    password: '',
    passwordConfirm: '',
    passwordConfirmRules: [
      v => v === vm.password || 'Passwords must match',
    ],
  }),
  watch: {
    code: {
      immediate: true,
      handler: 'reset',
    },
  },
  methods: {
    reset () {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
    },
    async resetPassword () {
      if (!this.$refs.form.validate()) {
        this.$alert({
          title: 'Configuration',
          text: 'Some form input are invalid',
          color: 'error',
        });
        return;
      }
      this.$loading('Resetting password...');
      try {
        await this.$sdk.service('auth').applyActionCode(this.code, this.password);
        this.reset();
      } catch (error) {
        this.$alert(error);
      }
      this.$loading(false);
    },
  },
};
</script>
