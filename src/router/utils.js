import AsyncComponentError from '@/components/layout/AsyncComponentError';
import AsyncComponentLoader from '@/components/layout/AsyncComponentLoader';
import { failsConfig as failsAuthConfig } from '@mycure/mf-auth/lib/router/authenticated.guard';
import { failsConfig as failsOrganizationGuard } from '@mycure/mf-organizations/lib/router/organization.guard';

/**
 * create an intermediate component
 * that can show a loading spinner
 * while fetching the async component
 * @param {string} routeName
 * @param {() => Component} component component factory
 * @returns {Component}
 */
export function lazyLoadedRouteComponent ({ routeName, component }) {
  return {
    name: routeName + 'Route',
    render (h) {
      return h('lazy-component', {
        props: this.$attrs,
      });
    },
    components: {
      'lazy-component': () => ({
        component: component(),
        delay: 100,
        loading: AsyncComponentLoader,
        timeout: 60000,
        error: AsyncComponentError,
      }),
    },
  };
}

/**
 * @typedef {Object} MenuItem
 * @property {string} id
 * @property {string} title
 * @property {string} [subtitle]
 * @property {string} [icon]
 * @property {string} [link]
 * @property {Object.<string,any>} [meta]
 * @property {MenuItem[]} [menus]
 */

/**
 * @param {Object[]} menus
 * @param {Object} currentUser
 * @param {Object} activeOrganization
 * @param {Object} activeMembership
 * @returns {{ items: MenuItem[], skipped: MenuItem[] }}
 */
export function filterMenus (menus, currentUser, activeOrganization, activeMembership) {
  // apply filtering based on currentUser attributes and roles/privileges
  const skipped = [];
  const shouldBeIncluded = (menu) => {
    const meta = menu.meta;
    if (!meta) return true;
    if (meta.requiresAuth) {
      const reason = failsAuthConfig(currentUser, [meta.requiresAuth]);
      if (reason) {
        skipped.push({ reason, menu });
        return false;
      }
    }
    if (meta.requiresActiveOrganization) {
      const reason = failsOrganizationGuard(activeOrganization, activeMembership, [menu.meta.requiresActiveOrganization]);
      if (reason) {
        skipped.push({ reason, menu });
        return false;
      }
    }
    return true;
  };
  const items = menus
    .map(menu => {
      if (!shouldBeIncluded(menu)) return false;
      if (menu.menus) {
        menu = { ...menu, menus: menu.menus.filter(shouldBeIncluded) };
        if (!menu.menus.length) return false;
      }
      return menu;
    })
    .filter(Boolean);
  return { items, skipped };
}
