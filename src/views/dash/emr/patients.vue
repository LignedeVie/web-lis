<template lang="pug">
  div
    v-container(fluid)
      v-layout(row align-center justify-center)
        v-flex(xs12 md12)
          patients-table(
            :patient-route="{ name: 'patient-profile' }"
          )
</template>

<script>
import PatientsTable from '@web-plugins/components/patient/table';

export default {
  components: {
    PatientsTable,
  },
};
</script>
