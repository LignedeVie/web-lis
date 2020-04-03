import Vue from 'vue';
import wysiwyg from 'vue-wysiwyg';
import 'vue-wysiwyg/dist/vueWysiwyg.css';

Vue.use(wysiwyg, {
  // { [module]: boolean (set true to hide) }
  hideModules: { image: true },

  // you can override icons too, if desired
  // just keep in mind that you may need custom styles in your application to get everything to align
  iconOverrides: {},

  // if the image option is not set, images are inserted as base64
  image: {
    uploadURL: '/api/myEndpoint',
    dropzoneOptions: {},
  },

  // limit content height if you wish. If not set, editor size will grow with content.
  maxHeight: '500px',

  // set to 'true' this will insert plain text without styling when you paste something into the editor.
  forcePlainTextOnPaste: true,
}); // config is optional. more below
