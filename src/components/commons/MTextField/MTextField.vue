<script>
import { VTextField } from 'vuetify/lib';
import { mergeFunctionalData } from '../utils';

const REGEX_NOSPACE = /\s/;

export default {
  name: 'MTextField',
  functional: true,
  props: {
    // additional rules
    rules: {
      type: Array,
      default: () => [],
    },
    required: {
      type: Boolean,
      default: false,
    },
    minLength: {
      type: Number,
      default: undefined,
    },
    maxLength: {
      type: Number,
      default: undefined,
    },
    nospace: {
      type: Boolean,
    },
  },
  render (h, ctx) {
    const props = ctx.props;

    // defaults
    const defdata = {
      props: {
        outline: true,
      },
    };

    // override
    const ovrdata = {
      props: {
        rules: props.rules?.slice(0) || [],
      },
    };
    if (props.required) {
      ovrdata.props.rules.push(v => (v != null && v !== '') || 'Value is required');
    }
    if (props.minLength) {
      ovrdata.props.rules.push(v => (v && v.length >= props.minLength) || `Must be at least ${props.minLength} characters long`);
    }
    if (props.maxLength) {
      ovrdata.props.rules.push(v => (v && v.length <= props.maxLength) || `Must be at most ${props.maxLength} characters long`);
    }
    if (props.nospace) {
      ovrdata.props.rules.push(v => !v || !REGEX_NOSPACE.test(v) || 'Whitespace not allowed');
    }

    return h(VTextField, mergeFunctionalData(defdata, ctx.data, ovrdata));
  },
};
</script>
