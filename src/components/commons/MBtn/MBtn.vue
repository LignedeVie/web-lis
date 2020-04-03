<script>
import { mergeFunctionalData } from '../utils';
import { VTooltip, VBtn, VIcon } from 'vuetify/lib';

export default {
  name: 'MBtn',
  functional: true,
  props: {
    confirm: {
      type: Boolean,
    },
    confirmText: {
      type: String,
      default: 'Confirm action?',
    },
    confirmCancelButtonText: {
      type: String,
      default: 'Cancel',
    },
    confirmCancelButtonProps: {
      type: Object,
      default: () => ({
        color: 'error',
      }),
    },
    confirmButtonText: {
      type: String,
      default: 'Confirm',
    },
    confirmButtonProps: {
      type: Object,
      default: () => ({
        color: 'primary',
      }),
    },
    tooltip: {
      type: String,
      default: undefined,
    },
    tooltipProps: {
      type: Object,
      default: () => ({
        bottom: true,
      }),
    },
    icon: {
      type: [Boolean, String],
      default: undefined,
    },
    iconProps: {
      type: Object,
      default: () => ({}),
    },
  },
  render: (h, ctx) => {
    const props = ctx.props;

    // auto-inserted icon
    const isIcon = props.icon === true || (typeof props.icon === 'string' && !ctx.children?.length);
    const children = !ctx.children ? [] : ctx.children.slice(0);
    if (typeof props.icon === 'string') {
      children.unshift(h(VIcon, {
        class: { 'mr-1': !isIcon },
        props: props.iconProps,
      }, props.icon));
    }

    // normal button
    if (!props.tooltip) {
      return h(
        VBtn,
        mergeFunctionalData(ctx.data, {
          props: {
            icon: isIcon,
          },
        }),
        children,
      );
    }

    // with tooltip
    return h(VTooltip, {
      props: props.tooltipProps,
      scopedSlots: {
        activator: ({ on }) => h(
          VBtn,
          mergeFunctionalData(ctx.data, {
            props: {
              icon: isIcon,
            },
            on,
          }),
          children,
        ),
      },
    }, props.tooltip);
  },
};
</script>
