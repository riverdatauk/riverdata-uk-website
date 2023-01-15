import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import StationPage from '../StationPage.vue';

describe('The `station` page', () => {
  it('renders properly', () => {
    // const wrapper = mount(StationPage, { props: { msg: 'Hello Vitest' } });
    const wrapper = mount(StationPage);
    expect(wrapper.text()).toContain('This is a station page');
  });
});
