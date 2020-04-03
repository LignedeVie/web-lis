// TODO: remove this script once sdk has been fixed
import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/storage';
import _ from 'lodash';

// FIXME: remove this script once sdk has been fixed
const apiServerURI = process.env.VUE_APP_API_SERVER_URI;
if (apiServerURI) {
  const storage = firebase.storage();
  const storageRef = storage.ref();

  const fbUploader = async ({ file, service, id, filename }) => {
    const path = [
      service,
      id,
      filename || new Date().toISOString(),
      _.uniqueId(),
    ].filter(Boolean).join('/');

    const res = await fetch(file);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const task = storageRef.child(path).put(blob);

      task.on('state_changed', (snap) => {
        const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
        console.log('uploading...', `${progress}%`);
      }, e => {
        reject(e);
      }, async () => {
        const url = await task.snapshot.ref.getDownloadURL();
        console.warn(url);
        resolve(url);
      });
    });
  };

  Vue.use({
    install (Vue) {
      Vue.prototype.$fbUploader = fbUploader;
    },
  });
}
