<template lang="pug">
  div#container
    div#content
      img(src="@/assets/images/lab-result-logo.svg" width="300")
      br
      v-progress-circular(color="primary" indeterminate size="30").my-3
      p {{ text }}
</template>

<script>
export default {
  name: 'SignoutPage',
  props: {
    // target url where the current user is not allowed
    target: {
      type: String,
      default: undefined,
    },
    // reason why the current user isn't allowed
    reason: {
      type: String,
      default: undefined,
    },
    signoutFn: {
      type: Function,
      default: undefined,
    },
  },
  computed: {
    text () {
      return ['Signing out', this.reason && `(${this.reason})`, '...'].join(' ');
    },
  },
  async mounted () {
    // call signout
    if (typeof this.signoutFn === 'function') {
      try {
        await this.signoutFn.call(this); // eslint-disable-line
      } catch (error) {
        console.error('signout error', error);
      }
    }
    // redirect to landing page
    this.$router.replace('/');
  },
};
</script>

<style scoped>
#container {
  font-family: 'Poppins', sans-serif;
  color: #34495F !important;
  height: 100vh;
  position: relative;
  text-align: center;
}

#content {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
