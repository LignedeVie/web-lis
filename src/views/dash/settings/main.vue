<template lang="pug">
  fragment
    v-toolbar(color="primary" fixed).elevation-1
      v-btn(icon :to="{name: 'landing'}")
        v-icon.white--text mdi-arrow-left
      v-toolbar-title(style="width: 300px" class="ml-0 pl-3").hidden-sm-and-down
        span.white--text Settings
    settings-main
    global-snackbar
</template>

<script>
import SettingsMain from '@web-plugins/components/settings/main';

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
    SettingsMain,
    GlobalSnackbar,
  },
  watch: {
    $route: {
      handler (val) {
        window.scrollTo(0, 0);
      },
    },
  },
};
</script>
