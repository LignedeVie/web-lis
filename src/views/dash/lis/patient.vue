<template lang="pug">
  div(v-mc-scroll="handleScroll")
    v-container(fluid).pa-0
      v-layout(row wrap).white.elevation-2.pt-3.px-3.banner
        v-flex(xs12 md12)
          patient-profile(
            hide-appointment
            hide-patient-drawer
            :patient="patient"
            :edit-patient-route="{ name: 'patient-profile-edit', params: { id: patient } }"
            @archived="pxIsArchived = $event"
          )
      v-layout(row align-center justify-center v-if="!pxIsArchived")
        v-flex(xs12 md12).pa-4
          v-card.enc-card
            v-card-title.grey.lighten-3.py-2
              v-layout(row justify-end)
                date-filter(
                  v-model="dateFilter"
                  v-bind="dateFilterOptions"
                  outline
                )
            v-card-text
              previous-per-record-view(
                hide-internal-date
                expand-on-start
                :date.sync="dateFilter"
                :filtered-record-types="{ type: 'lab-test-order' }"
              )
</template>

<script>
import DateFilter from '@mycure/web-plugins/lib/components/commons/date-filter';
import PatientProfile from '@mycure/web-plugins/lib/components/patient/profile';
import PreviousPerRecordView from '@mycure/web-plugins/lib/components/encounter/previous/per-record-view';

export default {
  components: {
    DateFilter,
    PatientProfile,
    PreviousPerRecordView,
  },
  data () {
    return {
      loading: true,
      pxIsArchived: false,
      dateFilter: {},
      dateFilterOptions: {
        noFuture: true,
        allowAllOption: true,
      },
    };
  },
  computed: {
    patient () {
      return this.$route.params.id;
    },
  },
  methods: {
    handleScroll (evt, el) {
      if (window.scrollY > 160) {
        this.showMinPxProfile = true;
      }
      if (window.scrollY < 160) {
        this.showMinPxProfile = false;
      }
    },
  },
};
</script>

<style scoped>
#fab {
  position: fixed !important;
  bottom: 30px !important;
  right: 50px !important;
}

.enc-card {
  border: 1px solid lightgrey;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.banner {
  /* position: fixed !important; */
  z-index: 1 !important;
  margin-bottom: 8px;
}

.fillWidth {
  width: 100% !important;
}

.min-px-profile {
  position: fixed !important;
  z-index: 999 !important;
  /* margin: 0px auto; */
  width: 100%;
}
</style>
