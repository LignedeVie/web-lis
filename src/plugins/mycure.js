import './mycure-unsettables';
import Vue from 'vue';
import sdk from '@mycure/sdk-js';
import store from '@/store';
import socket from 'socket.io-client';
import router from '@/router';
import Auth from '@mycure/mf-auth/lib';
import Commons from '@mycure/mf-commons/lib';
import Organizations from '@mycure/mf-organizations/lib';

// TODO: remove legacy sdk and vue-plugins
import 'firebase/storage';
import 'firebase/messaging';
import firebaseApp from 'firebase/app';
import { core as legacySdk } from '@mycure/sdk';

// app logger
Vue.log = Vue.prototype.$log = require('debug')('mc:app');

// configure sdk
const sdklogger = require('debug')('mf:sdk');
sdklogger.child = name => require('debug')('mf:sdk:' + name);
sdk.setLogger(sdklogger);
Vue.sdk = Vue.prototype.$sdk = sdk;

// initialize sdk (if possible)
const apiServerURI = process.env.VUE_APP_API_SERVER_URI;
if (apiServerURI) {
  sdk.initialize(apiServerURI, {
    // TODO: change to pure websocket (ws in server)
    socket: socket(apiServerURI, {
      transports: ['websocket'],
      upgrade: false,
    }),
  });

  // NOTE: legacy
  firebaseApp.initializeApp({
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_DATABASE_URL,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  });

  legacySdk.initialize(apiServerURI, {
    socket,
    firebaseApp,
    auth: {
      autoSignin: false,
    },
  });

  // synchronize the sdks' currentUsers
  sdk.service('auth').on('currentUser', user => {
    const authService = legacySdk.auth();
    if (user) {
      const accessToken = sdk.service('auth').cachedToken;
      const refreshToken = sdk.service('auth').cachedRefreshToken;
      // authenticate socket
      if (authService.socket) {
        authService.socket.emit('create', 'authentication', { strategy: 'jwt', accessToken }, (error, result) => {
          if (error) return authService.log('socket auth error', error);
          authService.log('successful socket authentication', result);
        });
      }
      // set jwt and refresh token
      localStorage.setItem('mc::jwt', accessToken);
      localStorage.setItem('mc::ref', refreshToken);
    }
    authService.popultdUser$.next(user || null);
  });
}

// install common utils
Vue.use(Commons);

// install auth module
Vue.use(Auth, {
  sdk,
  store,
  router,
  unauthenticated: {
    redirectURL: '/lis',
  },
});

// install organizations module
Vue.use(Organizations, {
  sdk,
  store,
  router,
});
