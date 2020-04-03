<template lang="pug">
  v-container.pa-3
    diagnostic-order-tests-report(
      :report="report"
      :selected-map="selectedMap"
      :status="status"
      :loading="loading"
      :can-receive="canReceive"
      :are-all-selected="areAllSelected"
      :are-some-selected="areSomeSelected"
      @select="onSelectionToggle"
      @select:all="onSelectAll"
      @receive="onReceive"
      @print="onPrint"
    )

    authenticate-dialog(
      :dialog.sync="authDialog"
      :email="user.email"
      password-only
      @auth="receiveReport"
      title="Authenticate"
      login-text="Authenticate"
    )
</template>

<script>
import _ from 'lodash';
import { initLogger } from '@web-plugins/utils/logger';
import AuthenticateDialog from '@web-plugins/components/dialogs/authenticate';
import DiagnosticOrderTestsReport from '@web-plugins/components/diagnostic/diagnostic-order-tests-report';

const log = initLogger('LisOrderTestsReportView');

export default {
  components: {
    AuthenticateDialog,
    DiagnosticOrderTestsReport,
  },
  data () {
    return {
      report: null,
      selectedMap: {},
      loading: false,
      authDialog: false,
    };
  },
  computed: {
    reportId () {
      return _.get(this.$route, 'params.id');
    },
    user () {
      return this.$store.state.auth.currentUser;
    },
    items () {
      return _.get(this.report, 'items');
    },
    receivedItems () {
      return _.filter(this.items, 'receivedAt');
    },
    nonreceivedItems () {
      return _.reject(this.items, 'receivedAt');
    },
    areSomeSelected () {
      log('computed#areSomeSelected#selectedMap: %O', this.selectedMap);
      return !_.isEmpty(_.filter(this.selectedMap));
    },
    areAllSelected () {
      return _.size(this.nonreceivedItems) === _.size(_.filter(this.selectedMap));
    },
    status () {
      if (_.isEmpty(this.receivedItems)) return 'delivered';
      if (!_.isEmpty(this.nonreceivedItems)) return 'partial';
      return 'received';
    },
    canReceive () {
      return this.status !== 'received';
    },
  },
  mounted () {
    this.fetchReport();
  },
  methods: {
    async fetchReport () {
      this.loading = true;
      try {
        this.report = await this.$store.dispatch('diagnostic/getDiagnosticOrderTestsReport', this.reportId);
        log('fetchReport#report: %O', this.report);
      } catch (error) {
        log('fetchReport#error: %O', error);
        this.$enqueueSnack({
          message: error.message,
          color: 'error',
        });
      }
      this.loading = false;
    },
    onSelectionToggle ({ orderTest, selected }) {
      log('onSelectionToggle#orderTest: %O', orderTest);
      log(`onSelectionToggle#selected: ${selected}`);
      if (selected) {
        this.selectedMap = {
          ...this.selectedMap,
          [orderTest.id]: true,
        };
      } else {
        this.selectedMap = _.omit(this.selectedMap, orderTest.id);
      }
    },
    onSelectAll (selected) {
      if (selected) {
        this.selectedMap = _.reduce(
          this.nonreceivedItems,
          (acc, item) => ({ ...acc, [item.id]: true }),
          {}
        );
      } else {
        this.selectedMap = {};
      }
    },
    onReceive () {
      log('onReceive#selectedMap: %O', this.selectedMap);
      this.authDialog = true;
    },
    async receiveReport ({ accessToken }) {
      this.loading = true;
      try {
        await Promise.all(_.map(
          _.keys(this.selectedMap),
          id => this.$store.dispatch('diagnostic/receiveOrderTest', { id, accessToken })
        ));
        // if all order tests are received, verify report
        if (this.areAllSelected) {
          await this.$store.dispatch(
            'diagnostic/verifyDiagnosticOrderTestsReport',
            this.reportId
          );
        }
        await this.fetchReport();
        this.authDialog = false;
        this.selectedMap = {};
      } catch (error) {
        log('receiveReport#error: %O', error);
        this.$enqueueSnack({
          message: error.message,
          color: 'error',
        });
      }
      this.loading = false;
    },
    onPrint () {
      this.$router.push({
        name: 'lis-print-order-tests-report',
        params: { id: this.reportId },
      });
    },
  },
};
</script>
