export default [
  {
    path: 'patients',
    name: 'patients',
    component: () => import(/* webpackChunkName: 'patients' */ '@/views/dash/emr/patients'),
    meta: {
      title: 'Patients List',
      subtitle: 'View, Manage, and Add new patient records',
    },
  },
  {
    path: 'patient/create',
    name: 'create-patient',
    component: () => import(/* webpackChunkName: 'create-patient' */ '@/views/dash/emr/create'),
  },
  {
    path: 'patient/edit/:id',
    name: 'edit-patient',
    component: () => import(/* webpackChunkName: 'create-patient' */ '@/views/dash/emr/create'),
  },
  {
    path: 'patient/:id',
    name: 'patient-profile',
    component: () => import(/* webpackChunkName: 'patient-profile' */ '@/views/dash/lis/patient'),
  },
  {
    path: 'patient/:id/edit',
    name: 'patient-profile-edit',
    component: () => import(/* webpackChunkName: 'create-patient' */ '@/views/dash/emr/create'),
  },
];
