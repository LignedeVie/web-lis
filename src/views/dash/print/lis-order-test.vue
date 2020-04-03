<template lang="pug">
  div
    v-container(fluid)
      v-layout(row align-center justify-center)
        v-flex(xs12 md12)
          print-lis-order-test
</template>

<script>
import PrintLisOrderTest from '@web-plugins/components/diagnostic/print/lis-order-test';

export default {
  components: {
    PrintLisOrderTest,
  },
};
</script>
