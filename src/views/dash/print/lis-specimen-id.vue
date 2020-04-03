<template lang="pug">
  div
    v-container(fluid)
      v-layout(row align-center justify-center)
        v-flex(xs12 md12)
          print-diagnostic-specimen-id
</template>

<script>
import PrintDiagnosticSpecimenId from '@web-plugins/components/diagnostic/print/diagnostic-specimen-id';

export default {
  components: {
    PrintDiagnosticSpecimenId,
  },
};
</script>
