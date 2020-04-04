<template lang="pug">
  fragment
    //- MAIN TOOLBAR
    v-toolbar(
      color="primary"
      dark
      fixed
      app
      clipped-right
    ).elevation-1
      async-confirm-dialog(ref="confirmDialog")
      v-toolbar-side-icon(@click.stop="drawerLeft = !drawerLeft")
      div
        h1 {{$route.meta.title}}
        h5 {{$route.meta.subtitle}}
      v-spacer
      span.px-2.white--text v{{ VERSION }}
      v-tooltip(bottom)
        v-btn(icon flat @click.stop="drawerNotif = !drawerNotif" slot="activator")
          v-badge(
            color="error"
            :value="unreadNotificationsCount"
            overlap
            left
            bottom
          )
            template(slot="badge")
              small(v-if="unreadNotificationsCount <= 99")
                | {{ unreadNotificationsCount }}
              small(v-else) 99+
            v-icon mdi-bell
        | Notifications
      v-tooltip(bottom)
        v-btn(icon flat @click.stop="drawerChat = !drawerChat" slot="activator")
          v-badge(
            color="error"
            :value="unreadChatMessages"
            overlap
            left
            bottom
          )
            template(slot="badge")
              small(v-if="unreadChatMessages <= 99")
                | {{ unreadChatMessages }}
              small(v-else) 99+
            v-icon mdi-forum
        | Chat
      v-toolbar-items
        v-menu(offset-y left)
          v-btn(flat slot="activator")
            v-avatar.mr-1
              img(v-if="$currentUser.picURL" :src="$currentUser.picURL")
              img(v-else src="@/assets/images/person-placeholder.png")
              div(
                v-for="(role, key) in reversedLimitedBadgeRoles"
                v-if="role"
                :style="{'background-color': role.color, right: `${key * 6}px`}"
              ).role-indicator.role-indicator-border.role-indicator-absolute.elevation-1
          v-list(style="width: 300px;")
            v-list-tile(avatar two-line)
              v-list-tile-avatar
                img(v-if="$currentUser.picURL" :src="$currentUser.picURL")
                img(v-else src="@/assets/images/person-placeholder.png")
              v-list-tile-content
                v-list-tile-title {{$currentUser.name | prettifyNameFirst}}
                v-list-tile-sub-title {{$currentUser.email}}
            v-hover
              template(slot-scope="{ hover }")
                .role-panel(
                  :class="{ expanded: userWidgetRolesExpanded }"
                  ref="rolePanel"
                  @click.stop="userWidgetRolesExpanded = !userWidgetRolesExpanded"
                )
                  span.ml-2.role-label
                    b User Roles
                    small(v-show="showExpand")  (click to show more)
                  v-layout(row wrap).pa-1
                    template(v-for="(role, key) in badgeRoles")
                      v-chip(
                        :color="role.color"
                        text-color="white"
                        small
                      ) {{role.name}}
                  v-layout(
                    v-show="hover"
                    column
                    align-center
                  ).chevron
                    v-icon(v-if="userWidgetRolesExpanded") mdi-chevron-up
                    v-icon(v-else) mdi-chevron-down
            v-divider
            v-list-tile(@click="gotoAccounts")
              v-list-tile-title
                v-icon(style="font-size: 20px;").mr-2 mdi-account-outline
                | My Account
            v-list-tile(v-if="isSettingsEnabled" :to="settingsRoute")
              v-list-tile-title
                v-icon(style="font-size: 20px;").mr-2 mdi-settings
                | Settings
            v-list-tile(@click="signOutDialog = true")
              v-list-tile-title.error--text
                v-icon(style="font-size: 20px;").error--text.mr-2 mdi-logout-variant
                | Sign out
            v-divider
            v-list-tile.pa-0
              v-list-tile-title.pa-0
                small.right App version: {{ VERSION }} - {{ buildType }}

    //- LEFT NAV
    v-navigation-drawer(
      v-model="drawerLeft"
      fixed
      app
      inset
      width="250"
    )#nav-parent
      v-toolbar(color="white" fixed).elevation-1
        img(src="@/assets/images/lab-result-logo.svg" width="100%")
      v-list(two-line).pa-0.ma-0
        v-list-tile(:to="{name: 'update-clinic'}")
          v-list-tile-avatar(size="45")
            img(:src="clinicPicValue")
          v-list-tile-content.ma-0
            v-list-tile-title
              v-tooltip(bottom :disabled="$activeOrganization.name > 15")
                span(slot="activator").primary--text {{$activeOrganization.name}}
                | {{ $activeOrganization.name }}
            v-list-tile-sub-title
              v-tooltip(bottom :disabled="$activeOrganization.description > 15")
                small(slot="activator") {{$activeOrganization.description}}
                | {{ $activeOrganization.description }}
      v-divider
      //- div
      v-list#nav-child
        template(v-for="nav in navGroups")
          v-list-tile(:key="nav.title" :to="nav.route")
            v-list-tile-title.subnav-indent.left-nav-tile-title {{nav.title}}
            v-list-tile-action(v-if="nav.icon")
              v-icon {{nav.icon}}

        //- settings route
        v-list-tile(:to="settingsRoute")
          v-list-tile-title.subnav-indent.left-nav-tile-title Settings

    //- CONTENT
    v-content
      router-view

    //- RIGHT NAV
    v-navigation-drawer(
      v-model="drawerNotif"
      fixed
      right
      temporary
      floating
      :width="400"
    )
      notifications-list(@close="drawerNotif = false")

    //- RIGHT NAV CHAT
    v-navigation-drawer(
      v-model="drawerChat"
      right
      app
      clipped
      stateless
      floating
      width="350"
      style="border-left: 1px solid lightgrey;"
    )
      chat-rooms(:is-displaying="drawerChat")

    yes-or-no(
      title="Sign out"
      message="Do you really want to sign out?"
      :dialog="signOutDialog"
      @close="v => signOutDialog = v"
      @yes="signOut"
    )

    global-snackbar
</template>

<script>
// components
import YesOrNo from '@web-plugins/components/dialogs/yes-no';
import ChatRooms from '@web-plugins/components/chat/chat-rooms';
import NotificationsList from '@web-plugins/components/notifications/notifications';
import AsyncConfirmDialog from '@web-plugins/components/commons/async-confirm-dialog';
// constants
import {
  LOCAL_STORAGE_TOKEN_KEY,
  NAV_GROUPS,
  SETTINGS_BASE_ROLES,
  SETTINGS_ROLES,
  VERSION,
  MODE,
} from './constants';
import { ROLES_MAP } from '@web-plugins/constants/organizations';
// utils
import _ from 'lodash';
import {
  permitRoles,
  permitBaseRoles,
  checkRoles,
  checkBaseRoles,
} from '@web-plugins/utils/permissions';
import { initLogger } from '@web-plugins/utils/logger';

// TODO: replace with snackbar service in @mycure/mf-commons
import GlobalSnackbar from '@web-plugins/components/commons/global-snackbar';
// TODO: pick only those that were used
import '@/filters';
import '@/directives';
import '@/plugins/mc-plugins';
import '@/plugins/vue-wysiwyg';
import '@/plugins/v-viewer';
import '@/plugins/vue-morphling';
import '@/plugins/mycure-full';

const log = initLogger('dash/main');

export default {
  components: {
    YesOrNo,
    ChatRooms,
    NotificationsList,
    AsyncConfirmDialog,
    GlobalSnackbar,
  },
  props: {
    source: {
      type: String,
      default: undefined,
    },
  },
  data () {
    return {
      VERSION,
      buildType: MODE,
      loading: false,
      showFooter: false,
      userWidgetRolesExpanded: false,
      drawerLeft: true,
      drawerNotif: false,
      drawerChat: false,
      signOutDialog: false,
      navGroups: NAV_GROUPS,
      // keep a reference to a single bound checkLoginState
      // for easily adding and removing event listeners
      boundCheckLoginState: this.checkLoginState.bind(this),
    };
  },
  computed: {
    clinicPicValue () {
      const base64 = this.$activeOrganization.picDataURI;
      if (base64) return base64;
      return this.$activeOrganization.picURL;
    },
    /** @returns {number} */
    unreadNotificationsCount () {
      return this.$store.getters['notifications/unreadNotificationsCount'];
    },
    isSettingsEnabled () {
      return permitBaseRoles(this.$activeMembership, SETTINGS_BASE_ROLES) ||
        permitRoles(this.$activeMembership, SETTINGS_ROLES);
    },
    settingsRoute () {
      return {
        name: 'settings',
        params: { clinic: _.get(this.$activeOrganization, 'id') },
      };
    },
    unreadChatMessages () {
      return this.$store.getters['chat/unreadMessages'];
    },
    badgeRoles () {
      const rolesValues = this.$activeMembership.roles?.map(role => ROLES_MAP[role]);
      log('computed#badgeRoles#rolesValues: %O', rolesValues);
      return _.sortBy(_.filter(rolesValues, Boolean), 'name');
    },
    reversedLimitedBadgeRoles () {
      // used for mini badges displayed beneath the user widget
      // limited to 5 so as not to extend too far from the user widget
      // reversed since rendering is done right to left:
      // this way, first role appears in the extreme left, above all other roles
      return _.reverse(_.take(this.badgeRoles, 5));
    },
    showExpand () {
      return _.size(this.badgeRoles) > 2;
    },
    isChildOrg () {
      return _.get(this.$activeOrganization, 'parent');
    },
    isParentOrg () {
      return !this.isChildOrg;
    },
    clinicType () {
      return _.get(this.$activeOrganization, 'type');
    },
    subscription () {
      return _.get(this.$activeOrganization, 'subscription');
    },
  },
  watch: {
    $route (val) {
      // automatically set left drawer state only if open in the first place
      // to avoid thrashing drawer state when changing between tabs with differing settings
      if (this.drawerLeft) this.setDrawerState(!val.meta.isLeftDrawerClosed);
      this.setFooterState(!val.meta.hideFooter);
    },
    async drawerChat (val) {
      this.$route.meta.isLeftDrawerClosed = val;
      this.$forceUpdateRoute();
    },
  },
  async mounted () {
    this.setDrawerState(!this.$route.meta.isLeftDrawerClosed);
    this.setFooterState(!this.$route.meta.hideFooter);
    await this.$store.dispatch('chat/watchChatRooms').catch(error => console.error(error));
    await this.init();
  },
  destroyed () {
    this.unwatchLoginState();
  },
  methods: {
    async init () {
      try {
        this.loading = true;
        this.watchLoginState();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    watchLoginState () {
      log('watchLoginState: attaching storage watcher');
      window.addEventListener('storage', this.boundCheckLoginState);
    },
    unwatchLoginState () {
      log('unwatchLoginState: removing storage watcher');
      window.removeEventListener('storage', this.boundCheckLoginState);
    },
    checkLoginState (event) {
      log('checkLoginState:event: %O', event);
      if (event.key === LOCAL_STORAGE_TOKEN_KEY && _.isNil(event.newValue)) {
        // token has been cleared from a different document, e.g. a different tab
        // force sign out in this case
        this.signOut();
      }
    },
    setDrawerState (drawerLeft) {
      this.drawerLeft = drawerLeft;
    },
    setFooterState (showFooter) {
      this.showFooter = showFooter;
    },
    isNavEnabled ({
      childOnly,
      parentOnly,
      clinicTypes,
      ignoredClinicTypes,
      subscriptions,
      baseRoles,
      roles,
      ignoredRoles,
      route,
    }) {
      return this.checkChildOrg(childOnly) &&
        this.checkParentOrg(parentOnly) &&
        this.checkClinicTypes(clinicTypes) &&
        this.checkIgnoredClinicTypes(ignoredClinicTypes) &&
        this.checkSubscriptions(subscriptions) &&
        this.checkBaseRoles(baseRoles) &&
        this.checkRoles(roles) &&
        this.checkIgnoredRoles(ignoredRoles);
    },
    /**
     * Returns true if active organization meets the childOnly condition.
     * If childOnly is false, this check is bypassed; returns true immediately.
     * If childOnly is true, active organization must be a child organization.
     * @return {boolean}
     */
    checkChildOrg (childOnly) {
      if (!childOnly) return true;
      return this.isChildOrg;
    },
    /**
     * Returns true if active organization meets the parentOnly condition.
     * If parentOnly is false, this check is bypassed; returns true immediately.
     * If parentOnly is true, active organization must be a parent organization.
     * @return {boolean}
     */
    checkParentOrg (parentOnly) {
      if (!parentOnly) return true;
      return this.isParentOrg;
    },
    /**
     * Returns true if active organization matches any of the required types.
     * @return {boolean}
     */
    checkClinicTypes (clinicTypes) {
      if (_.isEmpty(clinicTypes)) return true;
      return _.includes(clinicTypes, this.clinicType);
    },
    /**
     * Returns true if active organization does not match any of the ignored types.
     * @return {boolean}
     */
    checkIgnoredClinicTypes (ignoredClinicTypes) {
      if (_.isEmpty(ignoredClinicTypes)) return true;
      // we don't want any of ignoredClinicTypes
      return !_.includes(ignoredClinicTypes, this.clinicType);
    },
    /**
     * Returns true if active subscription has any of the required keys.
     * @return {boolean}
     */
    checkSubscriptions (subscriptions) {
      if (_.isEmpty(subscriptions)) return true;
      return _.some(subscriptions, s => _.get(this.subscription, s));
    },
    /**
     * Returns true if active membership has any of the required base roles.
     * Superadmin does NOT bypass this check.
     * @return {boolean}
     */
    checkBaseRoles (baseRoles) {
      if (_.isEmpty(baseRoles)) return true;
      return checkBaseRoles(this.$activeMembership, baseRoles);
    },
    /**
     * Returns true if active membership has any of the required roles.
     * Superadmin bypasses this check; returns true immediately.
     * @return {boolean}
     */
    checkRoles (roles) {
      if (_.isEmpty(roles)) return true;
      return permitRoles(this.$activeMembership, roles);
    },
    /**
     * Returns true if active membership does not have any of the ignored roles.
     * Superadmin bypasses this check; returns true immediately.
     * @return {boolean}
     */
    checkIgnoredRoles (ignoredRoles) {
      if (_.isEmpty(ignoredRoles)) return true;
      if (_.get(this.$activeMembership, 'superadmin')) return true;
      // we don't want any of ignoredRoles
      return !checkRoles(this.$activeMembership, ignoredRoles);
    },
    async clinicSelected (clinic) {
      await this.$store.dispatch('organizations/setActiveMembership', {
        organization: clinic.id,
      });
      this.$router.push({
        name: 'landing',
      });
    },
    async gotoAccounts () {
      const token = await this.$store.dispatch('auth/getAccessToken');
      if (token) {
        const signinURL = process.env.VUE_APP_ACCOUNTS_URI;
        const href = `${signinURL}/?token=${token}`;
        window.open(href, '_blank');
      }
    },
    async signOut () {
      try {
        this.loading = true;
        this.$store.dispatch('table/resetState');
        this.$router.replace({ name: 'signout' });
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = true;
      }
    },
  },
};
</script>

<style scoped>
.role-indicator {
  border-radius: 100%;
  width: 15px;
  height: 15px;
}

.role-indicator.role-indicator-border {
  border: 2px solid white !important;
}

.role-indicator.role-indicator-absolute {
  position: absolute;
  bottom: -5px;
  right: 0px;
}

.role-panel {
  position: relative;
  max-height: 60px;
  transition: max-height 0.5s ease-in-out;
  overflow: hidden;
}

.role-panel:hover {
  background-color: #eff3f5;
}

.role-panel .role-label {
  font-size: 12px;
}

.role-panel .chevron {
  position: absolute;
  bottom: -5px;
  z-index: 1;
  width: 100%;
}

.expanded {
  max-height: 999px;
}

#nav-parent {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  padding-top: 65px;
}

#nav-child {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 0 0 100px 0;
  margin-top: -1px;
  background: transparent;
}

#nav-child::-webkit-scrollbar {
  display: none;
}

.left-nav-tile-title {
  font-size: 13px;
}

.subnav-indent {
  margin-left: 31px;
}

.subnav-width {
  width: 100%;
}

</style>
