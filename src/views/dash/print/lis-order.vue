<template lang="pug">
  div
    v-container(fluid)
      v-layout(row align-center justify-center)
        v-flex(xs12 md12)
          print-lis-order
</template>

<script>
import PrintLisOrder from '@web-plugins/components/diagnostic/print/lis-order';

export default {
  components: {
    PrintLisOrder,
  },
};
</script>
