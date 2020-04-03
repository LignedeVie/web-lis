const path = require('path');

// app version
process.env.VUE_APP_VERSION = require('./package.json').version;
if (process.env.NODE_ENV !== 'production') process.env.VUE_APP_VERSION += '-' + process.env.NODE_ENV;

module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  parallel: 4,
  devServer: {
    transportMode: 'ws',
  },
  transpileDependencies: [
    // 'vuetify',
    '@mycure/mf-commons',
    '@mycure/mf-auth',
    '@mycure/mf-organizations',
    '@mycure/sdk-js',
    '@mycure/vue-plugins',
    '@mycure/web-plugins',
  ],
  configureWebpack: {
    resolve: {
      alias: {
        // to ensure that the imported vue instance (on project and modules) is always the same
        vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js'),
        // alias mycure modules to process their tree-shakeable code
        '@mycure/mf-commons/lib': '@mycure/mf-commons/src',
        '@mycure/mf-auth/lib': '@mycure/mf-auth/src',
        '@mycure/mf-organizations/lib': '@mycure/mf-organizations/src',
        '@mycure/sdk-js': '@mycure/sdk-js/src',
        '@mycure/vue-plugins/lib': '@mycure/vue-plugins/src',
        '@mycure/web-plugins/lib': '@mycure/web-plugins/src',
        // TODO: remove compat
        '@web-plugins': '@mycure/web-plugins/src',
      },
    },
    // externals: {
    //   // exclude momentjs in chart.js build
    //   moment: 'moment',
    // },
  },
  chainWebpack: config => {
    // modify vuetify plugin to also auto-import mycure components
    config
      .plugin('VuetifyLoaderPlugin')
      .tap(() => [{
        match (originalTag, { kebabTag, camelTag, path, component }) {
          if (kebabTag.startsWith('m-')) {
            return [camelTag, `import { ${camelTag} } from '@/plugins/mycure-exports'`];
          }
          if (kebabTag.startsWith('comp-')) {
            const [prefix, directory, ...rest] = kebabTag.split('-'); // eslint-disable-line
            const name = rest.map(chars => {
              const firstChar = chars[0].toUpperCase();
              return chars.length < 2 ? firstChar : firstChar + chars.slice(1);
            }).join('');
            return [camelTag, `import ${camelTag} from '@/components/${directory}/${name}'`];
          }
        },
      }]);
  },
};
