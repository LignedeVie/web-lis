<template lang="pug">
  print-lis-order-tests-report(
    :report="report"
    :organization="activeOrganization"
    :loading="loading"
  )
</template>

<script>
import _ from 'lodash';
import PrintLisOrderTestsReport from '@web-plugins/components/diagnostic/print/lis-order-tests-report';

const COMPONENT_NAME = 'views/dash/print/lis-order-tests-report';

export default {
  components: {
    PrintLisOrderTestsReport,
  },
  data () {
    return {
      report: null,
      loading: false,
    };
  },
  computed: {
    reportId () {
      return _.get(this.$route, 'params.id');
    },
    activeOrganization () {
      this.$log('computed#activeOrganization: %O', this.$activeOrganization);
      return this.$activeOrganization;
    },
  },
  created () {
    this.$initLogger(COMPONENT_NAME);
  },
  mounted () {
    this.fetchReport();
  },
  methods: {
    async fetchReport () {
      this.loading = true;
      try {
        this.report = await this.$store.dispatch('diagnostic/getDiagnosticOrderTestsReport', this.reportId);
        this.$log('fetchReport#report: %O', this.report);
      } catch (error) {
        this.$log('fetchReport#error: %O', error);
        this.$enqueueSnack({
          message: error.message,
          color: 'error',
        });
      }
      this.loading = false;
    },
  },
};
</script>
