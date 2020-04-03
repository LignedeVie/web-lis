<template lang="pug">
  div
    v-container(fluid)
      v-layout(row align-center justify-center)
        v-flex(xs12 md12)
          print-diagnostic-claim-stub
</template>

<script>
import PrintDiagnosticClaimStub from '@web-plugins/components/diagnostic/print/diagnostic-claim-stub';

export default {
  components: {
    PrintDiagnosticClaimStub,
  },
};
</script>
