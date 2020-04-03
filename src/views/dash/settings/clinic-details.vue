<template lang="pug">
  settings-clinic-details(
    :clinic="$activeOrganization"
    is-edit
  )
</template>

<script>
import SettingsClinicDetails from '@web-plugins/components/settings/clinic/details';
export default {
  components: {
    SettingsClinicDetails,
  },
};
</script>
