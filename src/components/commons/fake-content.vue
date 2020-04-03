<template lang="pug">
  div(:style="{ height: height, width: width }").grey.lighten-3.fake-content
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '10px'
    },
    width: {
      type: String,
      default: '100%'
    }
  }
};
</script>

<style scoped>
.fake-content {
  margin: 5px 0 5px 0;
}
</style>