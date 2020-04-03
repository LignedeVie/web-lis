<script>
import MTextField from '../MTextField';
import { mergeFunctionalData } from '../utils';

const REGEXP = /\S+@\S+\.\S+/;

export default {
  name: 'MEmailField',
  props: {
    // additional rules
    rules: {
      type: Array,
      default: () => [],
    },
    hideDefaultIcon: {
      type: Boolean,
      default: false,
    },
  },
  render (h) {
    // defaults
    const defdata = {
      props: {
        outline: true,
        label: 'Email',
        placeholder: 'riley@domain.com',
      },
    };
    if (!this.hideDefaultIcon) {
      defdata.props.prependInnerIcon = 'mdi-at';
    }

    // data
    const ctxdata = {
      props: this.$attrs,
      on: this.$listeners,
    };

    // override
    const ovrdata = {
      props: {
        type: 'email',
        rules: this.rules || [],
      },
    };
    ovrdata.props.rules.push(v => !v || REGEXP.test(v) || 'Must be a valid email');

    return h(MTextField, mergeFunctionalData(defdata, ctxdata, ovrdata));
  },
};
</script>
