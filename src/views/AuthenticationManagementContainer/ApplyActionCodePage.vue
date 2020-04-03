<template lang="pug">
  fragment
    v-toolbar(app flat)
      v-toolbar-title
        img(src="@/assets/images/lab-result-logo.svg" width="200")
    v-content
      v-container
        v-layout(row).mt-5
          v-layout(column).text-xs-center
            // loading
            template(v-if="loading")
              div.text-center
                v-progress-circular(color="primary" indeterminate size="30").mt-3
                h1.font-weight-medium {{ loadingText}}
                div(v-if="loadingExplanationText").caption {{ loadingExplanationText}}

            // success
            template(v-else-if="!error")
              div.text-center
                h1.font-weight-medium {{ successText }}
                router-link(to="/") Back to home

            // error
            template(v-else)
              div.text-center
                h2.font-weight-medium Something went Wrong!
                div.subtitle Please try again later.
                router-link(to="/") Back to home
                br
                code.mt-3 {{ error }}
</template>

<script>
export default {
  name: 'ApplyActionCode',
  props: {
    code: {
      type: String,
      default: undefined,
    },
    loadingText: {
      type: String,
      required: true,
    },
    loadingExplanationText: {
      type: String,
      default: undefined,
    },
    successText: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    error: '',
  }),
  watch: {
    code: {
      immediate: true,
      handler: 'applyActionCode',
    },
  },
  methods: {
    async applyActionCode () {
      this.error = '';
      this.loading = true;
      try {
        if (!this.code) throw new Error('Code is required!');
        await this.$sdk.service('auth').applyActionCode(this.code);
      } catch (error) {
        this.$snack(error);
        this.error = error.message;
      }
      this.loading = false;
    },
  },
};
</script>
