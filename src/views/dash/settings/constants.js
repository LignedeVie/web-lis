export const navGroups = [
  {
    title: 'My Clinic',
    icon: 'mdi-hospital-building',
    active: true,
    navs: [
      {
        title: 'Details',
        route: { name: 'settings-clinic-details' },
      },
      {
        title: 'Members',
        route: { name: 'settings-clinic-members' },
      },
      {
        title: 'Branches',
        route: { name: 'settings-clinic-branches' },
      },
      {
        title: 'History',
        route: { name: 'settings-clinic-history' },
      },
      {
        title: 'Attendance',
        route: { name: 'settings-clinic-attendance' },
      },
      {
        title: 'Printing Header',
        route: { name: 'settings-clinic-printing-header' },
      },
    ],
  },
  {
    title: 'Partners',
    icon: 'mdi-briefcase',
    active: false,
    navs: [
      {
        title: 'HMOs',
        route: { name: 'settings-partners-hmos' },
      },
      {
        title: 'Companies',
        route: { name: 'settings-partners-companies' },
      },
      {
        title: 'Diagnostic Centers',
        route: { name: 'settings-partners-diagnostic-centers' },
      },
      {
        title: 'Government Insurances',
        route: { name: 'settings-partners-gov-insurances' },
      },
    ],
  },
  {
    title: 'Laboratory',
    icon: 'mdi-water',
    active: false,
    navs: [
      {
        title: 'Test Directory',
        route: { name: 'settings-laboratory-test-directory' },
      },
      {
        title: 'Analyzers',
        route: { name: 'settings-laboratory-analyzers' },
      },
      {
        title: 'Order Templates',
        route: { name: 'settings-laboratory-order-templates' },
      },
    ],
  },
];

const navs = [];

navGroups.forEach(group => {
  group.navs.forEach(nav => {
    navs.push({ ...nav, title: `${group.title} - ${nav.title}` });
  });
});

export const searchableNavs = navs;
