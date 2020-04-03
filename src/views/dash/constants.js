export const VERSION = process.env.VUE_APP_VERSION || 'development';
export const MODE = process.env.VUE_APP_MODE;

export const LOCAL_STORAGE_TOKEN_KEY = 'mc::jwt';

export const SETTINGS_BASE_ROLES = [
  'doctor',
  'nurse',
];

export const SETTINGS_ROLES = [
  'admin',
  'frontdesk_head',
  'nurse_head',
  'lab_head',
  'imaging_head',
  'billing_head',
  'warehouse_head',
  'pme_head',
];

export const NAV_GROUPS = [
  {
    title: 'Dashboard',
    route: { name: 'lis-dashboard' },
  },
  {
    title: 'Worklist',
    route: { name: 'lis-tests' },
  },
  {
    title: 'Patients',
    route: { name: 'patients' },
  },
  {
    title: 'Print Orders',
    route: { name: 'lis-orders' },
  },
  {
    title: 'Specimen Tracking Report',
    route: { name: 'lis-order-tests-reports' },
  },
];
