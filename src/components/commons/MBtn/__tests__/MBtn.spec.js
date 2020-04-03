import MBtn from '../MBtn';
import { mount } from '@vue/test-utils';

describe('MBtn.vue', () => {
  it('should emit a click event', async () => {
    const wrapper = mount(MBtn, {
      propsData: {
        href: '#!',
      },
    });

    const click = jest.fn();
    wrapper.vm.$on('click', click);
    wrapper.trigger('click');
    wrapper.trigger('click');

    expect(click.mock.calls).toHaveLength(2);
  });
});
