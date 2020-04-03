<template lang='pug'>
  v-container(fluid)
    v-layout(row wrap justify-center)
      v-flex(xs12 md10)
        v-card
          v-toolbar(flat)
            v-spacer
            v-btn(
              large
              color="primary"
              depressed
              @click="switchFacilityDialog = true"
            ) Switch Clinic
              v-icon mdi-swap-horizontal
            v-btn(
              large
              color="primary"
              depressed
              :to="{ name: 'settings-clinic-details', params: { clinic: activeOrganization.id } }"
            ) Edit Clinic
              v-icon mdi-pencil
          v-card-text
            v-layout(row justify-center wrap)
              v-flex(xs12 md2).text-xs-center
                img(width="100%" :src="clinicPicValue").elevation-1
            v-layout(row)
              v-flex(grow).pl-2.pt-0.text-xs-center
                h1 {{activeOrganization.name}}
                div
                  p {{activeOrganization.description}}
            v-layout(row justify-center wrap)
              v-flex(xs12).text-xs-center
                v-tooltip(bottom)
                  template(slot="activator")
                    v-btn(
                      bottom
                      large
                      depressed
                      :color="isClinicOpen ? 'warning' : 'success'"
                      @click="authDialog = true"
                      v-if="canOpen"
                    ).ml-0 {{isClinicOpen ? 'Close' : 'Open'}} {{ activeOrganization.name }}
                  | {{ isClinicOpen ? 'Close Clinic' : 'Open Clinic' }}
          v-divider
          v-card-text
            generic-table(
              :headers="headers"
              :items="attendances"
              :total-items="activeOrganizationOpeningTimesTotal"
              :loading="loading"
              :pagination.sync="pagination"
            ).red
              tr(slot="items" slot-scope="props")
                td {{ props.item.startAt | morph-date('MMM DD, YYYY hh:mm A')}}
                td {{ props.item | prop('startedBy.name') | prettify-name-first }}
                td {{ props.item.endAt | morph-date('MMM DD, YYYY hh:mm A')}}
                td {{ props.item | prop('endedBy.name') | prettify-name-first }}

    async-confirm-dialog(ref="confirmDialog")

    switch-facility(
      :dialog.sync="switchFacilityDialog"
      @select="clinicSelected"
    )

    v-dialog(
      v-model="authDialog"
      width="500"
    )
      v-card
        v-toolbar(flat)
          v-toolbar-title
            h4 Confirm Authentication
          v-spacer
          v-btn(icon @click.stop="authDialog = false")
            v-icon mdi-close
        v-card-text
          auth-form(
            ref="authFormRef"
            isReauth
            outline
            :emailPrefill="$currentUser.email"
            password-only
            @success="updateClinicAttendance"
            @isLoading="loading = $event"
          )
        v-divider
        v-card-actions
          v-spacer
          v-btn(
            color="success"
            @click.stop="login"
            :loading="loading"
            :disabled="loading"
          ) Confirm
          v-btn(
            style="background-color: lightgray"
            @click.stop="authDialog = false;"
            :loading="loading"
            :disabled="loading"
          ) Cancel
</template>

<script>
// components
import AuthForm from '@web-plugins/components/account/auth-form';
import GenericTable from '@web-plugins/components/commons/generic-table';
import SwitchFacility from '@web-plugins/components/org/switch-facility';
import AsyncConfirmDialog from '@web-plugins/components/commons/async-confirm-dialog';
// utils
import _ from 'lodash';
import { initLogger } from '@web-plugins/utils/logger';
import { permitBaseRoles } from '@web-plugins/utils/permissions';
import { mapPagination } from '@web-plugins/utils/ui-api-mapping';

const log = initLogger('UpdateClinic');

export default {
  filters: {
    prop (item, prop) {
      return _.get(item, prop);
    },
  },
  components: {
    AuthForm,
    GenericTable,
    SwitchFacility,
    AsyncConfirmDialog,
  },
  data () {
    return {
      switchFacilityDialog: false,
      loading: false,
      dateFilter: {},
      authDialog: false,
      headers: [
        {
          text: 'OPENING TIME',
          value: 'startAt',
          sortable: false,
        },
        {
          text: 'OPENED BY',
          value: 'startedBy',
          sortable: false,
        },
        {
          text: 'CLOSING TIME',
          value: 'endAt',
          sortable: false,
        },
        {
          text: 'CLOSED BY',
          value: 'endedBy',
          sortable: false,
        },
      ],
      pagination: {},
      activeOrganizationOpeningTimes: [],
      activeOrganizationOpeningTimesTotal: 0,
    };
  },
  computed: {
    activeOrganization () {
      return this.$activeOrganization;
    },
    clinicPicValue () {
      const base64 = this.activeOrganization.picDataURI;
      if (base64) return base64;
      return this.$activeOrganization.picURL;
    },
    canOpen () {
      return permitBaseRoles(this.$activeMembership, ['admin']);
    },
    attendances () {
      return this.activeOrganizationOpeningTimes
        ?.map(clock => ({
          ...clock,
          startedBy: clock?.$populated.startedBy,
          endedBy: clock?.$populated.endedBy,
        }));
    },
    isClinicOpen () {
      return this.activeOrganizationOpeningTimes?.some(clock => !clock.endAt);
    },
  },
  watch: {
    dateFilter () {
      this.init();
    },
    pagination: {
      async handler () {
        await this.loadClinicAttendances();
      },
      deep: true,
    },
  },
  async created () {
    await this.init();
  },
  methods: {
    async init () {
      try {
        this.loading = true;
        this.$route.meta.title = this.activeOrganization.name;
        this.$forceUpdateRoute();
        this.loadClinicAttendances();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async loadClinicAttendances () {
      if (_.isEmpty(this.pagination)) return;
      try {
        this.loading = true;

        const { items, total } = await this.$sdk.service('clocks').find({
          type: 'opening',
          organization: this.activeOrganization.id,
          ...mapPagination(this.pagination),
          $sort: { startAt: -1 },
          $populate: {
            startedBy: {
              service: 'accounts',
              localKey: 'startedBy',
            },
            endedBy: {
              service: 'accounts',
              localKey: 'endedBy',
            },
          },
        });
        log('loadClinicAttendances#items: %O', items);
        log('loadClinicAttendances#total: %O', total);
        this.activeOrganizationOpeningTimes = items;
        this.activeOrganizationOpeningTimesTotal = total;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async clinicSelected (clinic) {
      await this.$store.dispatch('organizations/setActiveMembership', {
        organization: clinic.id,
      });
      // TODO: for removal
      this.$store.dispatch('inventory/clearStockRooms');
      this.$store.dispatch('table/resetState');
      this.$router.push({
        name: 'landing',
      });
    },
    async login () {
      try {
        await this.$refs.authFormRef.submit();
      } catch (e) {
        console.error(e);
        this.$enqueueSnack({
          color: 'error',
          message: 'There was an error. Please try again later.',
        });
      }
    },
    async updateClinicAttendance ({ cleanupForce = false } = {}) {
      try {
        if (!this.isClinicOpen) {
          await this.$sdk.service('clocks').create({
            type: 'opening',
            organization: this.activeOrganization.id,
          });
        } else {
          // end encounters
          const encountersQuery = {
            facility: this.activeOrganization.id,
            finishedAt: null,
          };
          const encounters = await this.$sdk.service('medical-encounters').find({
            ...encountersQuery,
            $limit: 0,
          });
          // throw for not forced
          if (encounters.total && !cleanupForce) {
            const error = new Error('Active organization has pending encounters');
            error.code = 'organization/close-clinic-has-pending-encounters';
            throw error;
          }
          // force end
          if (encounters.total) {
            await this.$sdk.service('medical-encounters').update(encountersQuery, {
              finish: true,
              force: true,
              save: true,
            });
          }

          // update pending queue items as finished
          const queueItemsQuery = {
            organization: this.activeOrganization.id,
            finishedAt: { $exists: false },
          };
          await this.$sdk.service('queue-items').update(queueItemsQuery, {
            finish: true,
          });

          // reset queue numbers
          const countersQuery = {
            type: { $in: ['queue-number', 'organization-queue-number'] },
            organization: this.activeOrganization.id,
          };
          await this.$sdk.service('counters').update(countersQuery, {
            value: 0,
          });

          const query = {
            type: 'opening',
            organization: this.activeOrganization.id,
            endAt: null,
          };
          await this.$sdk.service('clocks').update(query, { end: true });
        }

        this.$enqueueSnack({
          color: 'success',
          message: `Clinic is now ${this.isClinicOpen ? 'closed' : 'open'}`,
        });
        this.authDialog = false;
        await this.init();
      } catch (error) {
        log('updateClinicAttendance#error: %O', error);

        if (error.code === 'organization/close-clinic-has-pending-encounters') {
          const confirm = await this.$refs.confirmDialog.open(
            'Pending Encounters',
            `
              There are still pending encounters in the clinic. 
              These encounters must be ended before closing the clinic. 
              Active and Postponed queue items' history will also be deleted. 
              Would you like to continue?
            `,
            {
              primaryAction: 'End Encounters & Close',
              primaryColor: 'error',
            }
          );
          if (!confirm) {
            this.authDialog = false;
            return;
          }
          log('updateClinicAttendance: trying again with cleanupForce');
          this.updateClinicAttendance({ cleanupForce: true });
        } else {
          this.$enqueueSnack({
            color: 'error',
            message: error.message || 'There was an error. Please try again later',
          });
        }
      }
    },
  },
};
</script>
