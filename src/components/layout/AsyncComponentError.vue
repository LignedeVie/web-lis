<template lang="pug">
  div#container
    div#content
      img(src="@/assets/images/lab-result-logo.svg" width="300")
      p.subheading Error loading component. Please refresh the page.
      a(@click="refresh") refresh
</template>

<script>
export default {
  name: 'AsyncComponentError',
  methods: {
    refresh () {
      location.reload();
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
