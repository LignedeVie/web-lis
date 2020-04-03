<template lang="pug">
  v-container(fluid).pa-3
    diagnostic-order-tests-reports(
      :reports="reports"
      :pagination.sync="pagination"
      :reports-total="reportsTotal"
      :date-filter.sync="dateFilter"
      :diagnostic-center-filter.sync="diagnosticCenterFilter"
      :diagnostic-center-filter-items="diagnosticCenterFilterItems"
      :status-filter.sync="statusFilter"
      :status-filter-items="statusFilterItems"
      :loading="loading"
      @add="onAdd"
      @click="onClick"
    )
</template>

<script>
// components
import DiagnosticOrderTestsReports from '@web-plugins/components/diagnostic/diagnostic-order-tests-reports';
// constants
// utils
import { isEmpty } from 'lodash';
import { initLogger } from '@web-plugins/utils/logger';
import { syncVuexState } from '@web-plugins/utils/vue';
import { DEFAULT_PAGINATION_VALUE } from '@web-plugins/constants/tables';
import { mapPagination, mapDateFilter } from '@web-plugins/utils/ui-store-mapping';

const COMPONENT_NAME = 'LisOrderTestsReports';
const log = initLogger(COMPONENT_NAME);

export default {
  components: {
    DiagnosticOrderTestsReports,
  },
  data () {
    return {
      reports: [],
      reportsTotal: 0,
      diagnosticCenterFilterItems: [],
      statusFilterItems: [
        { text: 'Delivered', value: 'delivered', queryOpts: { verifiedAt: { $exists: false } } },
        { text: 'Received', value: 'received', queryOpts: { verifiedAt: { $exists: true } } },
      ],
      loading: false,
      isInitialLoad: true,
    };
  },
  computed: {
    activeOrganization () {
      return this.$activeOrganization;
    },
    pagination: {
      get () {
        return this.$store.state.table.diagnosticSpecimenTrackingPagination;
      },
      set (value) {
        const currentPaginationValue = this.$store.state.table.diagnosticSpecimenTrackingPagination;
        if (
          this.isInitialLoad &&
          currentPaginationValue !== DEFAULT_PAGINATION_VALUE
        ) {
          value = currentPaginationValue;
        }
        this.$store.commit('table/setDiagnosticSpecimenTrackingPagination', value);
      },
    },
    dateFilter: syncVuexState('table', 'diagnosticSpecimenTrackingDateFilter'),
    statusFilter: syncVuexState('table', 'diagnosticSpecimenTrackingStatusFilter'),
    diagnosticCenterFilter: syncVuexState('table', 'diagnosticSpecimenTrackingDiagnosticCenterFilter'),
  },
  watch: {
    pagination: {
      async handler () {
        await this.fetchReports();
        this.isInitialLoad = false;
      },
      deep: true,
      immediate: true,
    },
    dateFilter: {
      handler () {
        if (this.isInitialLoad) return;
        this.pagination.page = 1;
        this.fetchReports();
      },
      deep: true,
    },
    diagnosticCenterFilter: {
      handler () {
        if (this.isInitialLoad) return;
        this.pagination.page = 1;
        this.fetchReports();
      },
      deep: true,
    },
    statusFilter: {
      handler () {
        if (this.isInitialLoad) return;
        this.pagination.page = 1;
        this.fetchReports();
      },
      deep: true,
    },
  },
  mounted () {
    this.fetchDiagnosticCenters();
  },
  methods: {
    async fetchDiagnosticCenters () {
      this.loading = true;
      try {
        this.diagnosticCenterFilterItems = await this.$store.dispatch(
          'organizations/getOrganizations',
          { diagnosticCenters: true }
        );
        log('fetchDiagnosticCenters#diagnosticCenterFilterItems: %O', this.diagnosticCenterFilterItems);
      } catch (error) {
        console.error(error);
        log('fetchDiagnosticCenters#error');
        this.$enqueueSnack({
          message: error.message,
          color: 'error',
        });
      }
      this.loading = false;
    },
    async fetchReports () {
      if (isEmpty(this.dateFilter)) return;

      this.loading = true;
      try {
        const { items, total } = await this.$store.dispatch('diagnostic/getDiagnosticOrderTestsReports', {
          organization: this.activeOrganization.id,
          ...mapPagination(this.pagination),
          ...mapDateFilter(this.dateFilter),
          sentOutTo: this.diagnosticCenterFilter?.id,
          queryOpts: this.statusFilter?.queryOpts,
        });
        log('fetchReports#items: %O', items);
        log('fetchReports#total: %O', total);
        this.reports = items;
        this.reportsTotal = total;
      } catch (error) {
        console.error(error);
        log('fetchReports#error');
        this.$enqueueSnack({
          message: error.message,
          color: 'error',
        });
      }
      this.loading = false;
    },
    onAdd () {
      log('onAdd: rerouting');
      this.$router.push({ name: 'lis-order-tests-report-create' });
    },
    onClick (report) {
      log('onClick#report: %O', report);
      this.$router.push({
        name: 'lis-order-tests-report',
        params: { id: report.id },
      });
    },
  },
};
</script>
