<template lang="pug">
  div
    lis-order-test(
      :user="$currentUser"
      :lab-members="labMembers"
      :pathologist-members="pathologistMembers"
      :lab-report-templates="labReportTemplates"
      @searchLabMembers="searchLabMembers"
      @searchPathologistMembers="searchPathologistMembers"
      @searchLabReportTemplates="searchLabReportTemplates"
    )
</template>

<script>
// components
import LisOrderTest from '@web-plugins/components/diagnostic/lis-order-test';
// utils
import * as organizationMembers from '@web-plugins/services/organization-members';

const LAB_ROLES = ['lab_tech', 'lab_qc', 'lab_head'];
const PATHOLOGIST_ROLES = ['doctor_pathologist'];

export default {
  components: {
    LisOrderTest,
  },
  data () {
    return {
      labMembers: [],
      pathologistMembers: [],
      labReportTemplates: [],
    };
  },
  computed: {
    activeOrganization () {
      return this.$activeOrganization;
    },
  },
  async created () {
    this.loadLabMembers('lab-members');
    this.loadLabMembers('pathologist-members');
    this.loadLabReportTemplates();
  },
  methods: {
    async loadLabMembers (type, searchString) {
      try {
        const opts = { organization: this.activeOrganization.id };
        if (type === 'lab-members') opts.roles = { $in: LAB_ROLES };
        if (type === 'pathologist-members') opts.roles = { $in: PATHOLOGIST_ROLES };
        if (searchString) opts.searchString = searchString;

        const { items } = await organizationMembers.getOrganizationMembers(this.$sdk, opts);

        if (type === 'lab-members') this.labMembers = items;
        if (type === 'pathologist-members') this.pathologistMembers = items;
      } catch (e) {
        console.error(e);
      }
    },
    async searchLabMembers (searchString) {
      await this.loadLabMembers('lab-members', searchString);
    },
    async searchPathologistMembers (searchString) {
      await this.loadLabMembers('pathologist-members', searchString);
    },
    async loadLabReportTemplates (searchString) {
      try {
        const query = {
          facility: this.$activeOrganization.id,
          type: 'lab-result',
          $sort: { name: 1 },
          $limit: 20,
        };

        if (searchString) {
          query.$or = [
            { tags: { $regex: `^${searchString}`, $options: 'i' } },
            { name: { $regex: `^${searchString}`, $options: 'i' } },
          ];
        }

        const { items } = await this.$sdk.service('form-templates').find(query);

        this.labReportTemplates = items;
      } catch (e) {
        console.error(e);
      }
    },
    searchLabReportTemplates (searchString) {
      this.loadLabReportTemplates(searchString);
    },
  },
};
</script>
