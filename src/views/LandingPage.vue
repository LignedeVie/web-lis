<template lang="pug">
  div#container
    div#content
      img(src="@/assets/images/lab-result-logo.svg" width="300")
      br
      v-progress-circular(color="primary" indeterminate size="30").mt-3
</template>

<script>
export default {
  name: 'LandingPage',
  props: {
    redirectFn: {
      type: Function,
      default: null,
    },
  },
  mounted () {
    // delay to show the loading page
    setTimeout(async () => {
      if (typeof this.redirectFn === 'function') {
        try {
          await this.redirectFn.call(this); // eslint-disable-line
        } catch (error) {
          console.error(error);
        }
      }
    }, 200);
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
