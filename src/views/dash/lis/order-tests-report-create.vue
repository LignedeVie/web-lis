<template lang="pug">
  v-container.pa-3
    diagnostic-order-tests-report-create(
      :members="members"
      :report-targets="reportTargets"
      :order-tests="orderTests"
      :pagination.sync="pagination"
      :order-tests-total="orderTestsTotal"
      :date-filter.sync="dateFilter"
      :filter.sync="filter"
      :filter-items="diagnosticCenters"
      :loading="loading"
      @cancel="onCancel"
      @save="onSave"
      @searchMember="searchMember"
    )
</template>

<script>
// components
import DiagnosticOrderTestsReportCreate from '@web-plugins/components/diagnostic/diagnostic-order-tests-report-create';
// utils
import _ from 'lodash';
import { initLogger } from '@web-plugins/utils/logger';
import { mapPagination, mapDateFilter } from '@web-plugins/utils/ui-store-mapping';
import * as organizationMembers from '@web-plugins/services/organization-members';

const log = initLogger('LisOrderTestsReportCreateView');

const LAB_ROLES = [
  'lab_tech',
  'lab_qc',
  'lab_head',
  'doctor_pathologist',
];

export default {
  components: {
    DiagnosticOrderTestsReportCreate,
  },
  data () {
    return {
      pagination: {},
      dateFilter: {},
      filter: {},
      diagnosticCenters: [],
      loading: false,
      members: [],
    };
  },
  computed: {
    activeOrganization () {
      return this.$activeOrganization;
    },
    reportTargets () {
      return this.activeOrganization?.configLIS?.orderTestsReportTargets;
    },
    orderTests () {
      return this.$store.state.diagnostic.orderTests;
    },
    orderTestsTotal () {
      return this.$store.state.diagnostic.orderTestsTotal;
    },
  },
  watch: {
    pagination: {
      handler () {
        this.fetchDiagnosticOrderTests();
      },
      deep: true,
    },
    dateFilter: {
      handler () {
        this.fetchDiagnosticOrderTests();
      },
      deep: true,
    },
    filter: {
      handler () {
        this.fetchDiagnosticOrderTests();
      },
      deep: true,
    },
  },
  async created () {
    await this.loadMembers();
  },
  mounted () {
    this.fetchDiagnosticCenters();
    this.fetchDiagnosticOrderTests();
  },
  methods: {
    async fetchDiagnosticCenters () {
      this.loading = true;
      try {
        const { items } = await this.$sdk.service('organizations').find({
          type: 'diagnostic-center',
          overlords: this.activeOrganization.id,
        });
        this.diagnosticCenters = items;
        log('fetchDiagnosticCenters#diagnosticCenters: %O', this.diagnosticCenters);
      } catch (error) {
        log('fetchDiagnosticCenters#error: %O', error);
        this.$enqueueSnack({
          message: error.message,
          color: 'error',
        });
      }
      this.loading = false;
    },
    async fetchDiagnosticOrderTests () {
      // prevent querying unrestricted amount data
      this.$store.dispatch('diagnostic/clearOrderTests');
      if (_.isEmpty(this.pagination)) return;
      if (_.isEmpty(this.dateFilter)) return;
      if (_.isEmpty(this.filter)) return;

      this.loading = true;
      try {
        this.$store.dispatch('diagnostic/getOrderTests', {
          facility: this.activeOrganization.id,
          queryOpts: {
            sentOutAt: { $exists: true },
            specimen: { $exists: true },
            reports: { $exists: false },
            sentOutTo: _.get(this.filter, 'id'),
          },
          type: 'laboratory',
          ...mapPagination(this.pagination),
          ...mapDateFilter(this.dateFilter),
        });
      } catch (error) {
        log('fetchDiagnosticOrderTests#error: %O', error);
        this.$enqueueSnack({
          message: error.message,
          color: 'error',
        });
      }
      this.loading = false;
    },
    goBack () {
      this.$router.go(-1);
    },
    onCancel () {
      // TODO: guard for changes
      this.goBack();
    },
    async onSave (report) {
      this.loading = true;
      try {
        await this.$store.dispatch('diagnostic/createDiagnosticOrderTestsReport', {
          ...report,
          organization: this.activeOrganization.id,
        });
        this.$enqueueSnack({
          message: 'Report saved!',
          color: 'success',
        });
        this.goBack();
      } catch (error) {
        log('onSave#error: %O', error);
        this.$enqueueSnack({
          message: error.message,
          color: 'error',
        });
      }
      this.loading = false;
    },
    async searchMember (searchMemberText) {
      await this.loadMembers(searchMemberText);
    },
    async loadMembers (searchString) {
      try {
        const opts = {
          organization: this.activeOrganization.id,
          roles: { $in: LAB_ROLES },
          searchString,
          limit: 50,
        };
        const { items } = await organizationMembers.getOrganizationMembers(this.$sdk, opts);

        log('loadMembers#items: %O', items);
        this.members = items;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
