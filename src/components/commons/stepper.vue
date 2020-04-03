<template lang="pug">
  div
    v-stepper(v-model="step" hide-details).elevation-0
      v-stepper-header
        template(v-for="n in steps" )
          v-stepper-step(
            :complete="step > n"
            :step="n"
            :key="`${n}-step`"
          )
          v-divider(v-if="n !== steps" :key="n")
    h5(align="center").primary--text {{step}} of {{steps}}
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1
    },
    steps: {
      type: Number,
      default: 4
    }
  }
};
</script>