import Vue from 'vue';

function noScroll () {
  window.scrollTo(0, 0);
}

Vue.use({
  install (Vue) {
    Vue.prototype.$addNoScroll = () => {
      const div = window.document.createElement('div');
      div.setAttribute('id', 'domFreezer');
      div.setAttribute('style', 'position: absolute; background-color: rgba(0,0,0,0.0); top: 0; right: 0; bottom: 0; left: 0; z-index: 10; cursor: not-allowed;');
      window.document.documentElement.appendChild(div);
      window.document.documentElement.style.overflow = 'hidden';
      window.addEventListener('scroll', noScroll);
    };

    Vue.prototype.$removeNoScroll = () => {
      try {
        const div = window.document.getElementById('domFreezer');
        window.document.documentElement.removeChild(div);
        window.document.documentElement.style.overflow = 'auto';
        window.removeEventListener('scroll', noScroll);
      } catch (e) {
        console.error(e);
      }
    };
  },
});
