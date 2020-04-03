<template lang="pug">
  v-toolbar(flat dense)
    span You are here:
      span(v-html="breadcrumbs")
</template>

<script>
import _ from 'lodash';
export default {
  data () {
    return {
      breadcrumbs: '',
    };
  },
  watch: {
    $route (route) {
      this.init();
    },
  },
  created () {
    this.init();
  },
  methods: {
    init () {
      const trail = _.get(this.$route.meta, 'trail');
      const crumbs = _.map(trail, item => {
        if (item.routeName === this.$route.name) {
          return `<b>${item.name}</b>`;
        }
        return `<button :to="{name: ${item.routeName}}">${item.name}</button>`;
      });
      this.breadcrumbs = crumbs.join(' > ');
      // if (trail.length === 1) {
      //   this.breadcrumbs = `${trail[0].name}`;
      //   return;
      // }
    },
  },
};
</script>
