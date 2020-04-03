<script>
import MTextField from '../MTextField';
import { mergeFunctionalData } from '../utils';

export default {
  inheritAttrs: false,
  props: {
    hideDefaultIcon: {
      type: Boolean,
      default: false,
    },
    requireMinLength: {
      type: Boolean,
      default: true,
    },
  },
  data: vm => ({
    visible: false,
  }),
  render (h) {
    // defaults
    const defdata = {
      props: {
        required: true,
        label: 'Password',
        placeholder: 'password',
        counter: true,
      },
    };

    if (!this.hideDefaultIcon) {
      defdata.props.prependInnerIcon = 'mdi-textbox-password';
    }

    if (this.requireMinLength) {
      defdata.props.minLength = 6;
    }

    // data
    const ctxdata = {
      props: this.$attrs,
      on: this.$listeners,
    };

    // override
    const ovrdata = {
      props: {
        appendIcon: this.visible ? 'mdi-eye' : 'mdi-eye-off',
        type: this.visible ? 'text' : 'password',
      },
      on: {
        'click:append': () => {
          this.visible = !this.visible;
        },
      },
    };

    const data = mergeFunctionalData(defdata, ctxdata, ovrdata);
    return h(MTextField, data);
  },
};
</script>
