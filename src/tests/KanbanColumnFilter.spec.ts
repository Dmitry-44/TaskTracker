import  ElementPlus  from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import KanbanColumnFilter from '@/components/kanban/KanbanColumnFilter.vue';

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('HelloWorld', () => {
  it('Устанавливаем активной первую опцию и ожидаем ее название в теге span', async() => {
    const msg = 'Приоритет'
    const wrapper = shallowMount(KanbanColumnFilter)
    await (wrapper.vm as any).setActive(0)
    await flushPromises()
    expect(wrapper.find('.el-dropdown-link').text()).toEqual(msg)
  })
  it('Сбрасываем фильтр и ожидаем увидеть в теге span значение placeholder', async() => {
    const placeholder = 'Фильтр'
    const wrapper = shallowMount(KanbanColumnFilter)
    await (wrapper.vm as any).resetActive()
    await flushPromises()
    expect(wrapper.find('.el-dropdown-link').text()).toEqual(placeholder)
  })
})