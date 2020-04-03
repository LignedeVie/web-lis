<template lang="pug">
  div
    v-container(fluid)
      v-layout(row align-center justify-center)
        v-flex(xs12 md12)
          diagnostic-orders(type="laboratory")
</template>

<script>
import DiagnosticOrders from '@web-plugins/components/diagnostic/diagnostic-orders';

export default {
  components: {
    DiagnosticOrders,
  },
};
</script>
