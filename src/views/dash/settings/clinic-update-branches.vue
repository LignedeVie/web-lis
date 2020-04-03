<template lang="pug">
  settings-clinic-update-branches(
    :clinic="selectedClinic"
  )
</template>

<script>
import SettingsClinicUpdateBranches from '@web-plugins/components/settings/clinic/update-branches';
export default {
  components: {
    SettingsClinicUpdateBranches,
  },
  props: {
    selectedClinic: {
      type: Object,
      default: undefined,
    },
  },
};
</script>
