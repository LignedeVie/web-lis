<template lang="pug">
  fragment
    router-view
    global-snackbar
</template>

<script>
// TODO: replace with snackbar service in @mycure/mf-commons
import GlobalSnackbar from '@web-plugins/components/commons/global-snackbar';
// TODO: pick only those that were used
import '@/filters';
import '@/directives';
import '@/plugins/mc-plugins';
import '@/plugins/vue-wysiwyg';
import '@/plugins/v-viewer';
import '@/plugins/vue-morphling';
import '@/plugins/mycure-full';

export default {
  components: {
    GlobalSnackbar,
  },
};
</script>
