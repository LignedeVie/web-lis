<template lang="pug">
  v-card.elevation-1.mt-3
    v-card-text
      v-layout(row)
        template(v-if="type === 'default' || type === 'template-2'")
          v-flex(shrink).mr-2
            img(
              width="80" 
              src="../../assets/images/facility-placeholder.png"
              style="border-radius: 5px;"
            )
          v-flex(:class="{ 'text-xs-center': type === 'template-2' }")
            h2.mb-2 {{clinic.name}}
            p.caption 107 Maginhawa Street Teacher's Village East Quezon City
            p.caption +63917-000-0000
            p.caption M-F 10:00am - 5:00pm
        template(v-else)
          v-layout
            v-flex.my-3.text-xs-center
              img(v-if="headerPicURL" :src="headerPicURL" width="100%")
              h2(v-else)
                pre Custom Image Header Here
        slot(name="selected")
    //- v-divider
    //- v-card-text
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default'
    },
    clinic: {
      type: Object,
      default: undefined
    },
    headerPicURL: {
      type: String,
      default: undefined
    }
  }
};
</script>

<style scoped>
p {
  line-height: 4px;
}
</style>