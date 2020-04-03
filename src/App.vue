<template lang="pug">
  v-app.transparent
    router-view
    div(v-show="showFooter").bottom-bg
</template>

<script>
import { NAV_GROUPS } from './views/dash/constants';

export default {
  name: 'App',
  data () {
    return {
      navGroups: NAV_GROUPS,
      showFooter: false,
    };
  },
  watch: {
    $route (val) {
      this.navGroups = this.navGroups.map((item, index, array) => {
        const { navs } = item;
        if (navs.find((nav) => ((nav.route && nav.route.name) === val.name))) {
          return {
            ...item,
            active: true,
          };
        } else {
          return {
            ...item,
            active: false,
          };
        }
      });
      this.setFooterState(!val.meta.hideFooter);
    },
  },
  methods: {
    setFooterState (showFooter) {
      this.showFooter = showFooter;
    },
  },
};
</script>

<style scoped>
.bottom-bg {
  background-image: url('./assets/images/body-footer.png');
  background-size: contain;
  background-position: center;
  bottom: 0;
  position: fixed;
  width: 100%;
  height: 150px;
  z-index: -1;
}
</style>
