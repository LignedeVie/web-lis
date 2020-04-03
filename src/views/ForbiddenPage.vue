<template lang="pug">
  div#container
    div#content
      img(src="@/assets/images/lab-result-logo.svg" width="300")
      p.subheading Error 403. You are not allowed in this page.
      p(v-if="reason" key="forbidden-page-reason") {{ reason }}
      router-link(v-if="from" :to="from" key="forbidden-page-back-btn") Back
      router-link(v-else to="/signout" key="forbidden-page-signout-btn") Back to Login
</template>

<script>
export default {
  name: 'ForbiddenPage',
  props: {
    // path where the user is before navigating to target
    // a go back button (where you are allowed) button
    // can be shown if this is present
    // if empty, a go back to signin page can be shown
    from: {
      type: String,
      default: undefined,
    },
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
