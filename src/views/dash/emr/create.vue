<template lang="pug">
  div
    v-container(fluid)
      v-layout(row align-center justify-center)
        v-flex(xs12 md12)
          patient-create
</template>

<script>
import PatientCreate from '@web-plugins/components/patient/create';

export default {
  components: {
    PatientCreate,
  },
};
</script>
