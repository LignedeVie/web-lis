<template lang="pug">
  v-container(fluid)
    v-layout(row)
      v-flex(xs12 md12)
        diagnostic-dashboard(type="laboratory")
</template>

<script>
import DiagnosticDashboard from '@web-plugins/components/dashboard/diagnostic';

export default {
  components: {
    DiagnosticDashboard,
  },
};
</script>
