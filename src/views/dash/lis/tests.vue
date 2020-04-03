<template lang="pug">
  div
    v-container(fluid)
      v-layout(row align-center justify-center)
        v-flex(xs12 md12)
          diagnostic-order-tests(
            :toRoute="{ name: 'lis-test' }"
            addable
            type="laboratory"
          )
</template>

<script>
import DiagnosticOrderTests from '@mycure/web-plugins/lib/components/diagnostic/diagnostic-order-tests';

export default {
  components: {
    DiagnosticOrderTests,
  },
};
</script>
