import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils';
import KanbanColumnFilter from '@/components/kanban/KanbanColumnFilter.vue';


let wrapper: VueWrapper

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  wrapper = shallowMount(KanbanColumnFilter)
});


describe('KanbanColumnFilter component', () => {
  it('Устанавливаем активной первую опцию и ожидаем ее название в теге span', async() => {
    const msg = 'Приоритет'
    await (wrapper.vm as any).setActive(0)
    await flushPromises()
    expect(wrapper.find('.el-dropdown-link').text()).toEqual(msg)
  })

  it('Сбрасываем фильтр и ожидаем увидеть в теге span значение placeholder', async() => {
    const placeholder = 'Фильтр'
    await (wrapper.vm as any).resetActive()
    await flushPromises()
    expect(wrapper.find('.el-dropdown-link').text()).toEqual(placeholder)
  })

  it('После выбора опции происходит событие emit "changeSort" ', async() => {
    await (wrapper.vm as any).setActive(0)
    expect(wrapper.emitted()['changeSort']).toBeTruthy()
  })

  it('После выбора опции событие emit "changeSort" не вызывается', async() => {
    await (wrapper.vm as any).setActive(-1)
    expect(wrapper.emitted()['changeSort']).not.toBeTruthy()
  })

  it('Установим опцию 100', async() => {
    await (wrapper.vm as any).setActive(100)
    expect(wrapper.emitted()['changeSort']).not.toBeTruthy()
  })

  it('При сбрасывании фильтра происходит событие emit "noSort" ', async() => {
    await (wrapper.vm as any).resetActive()
    expect(wrapper.emitted()['noSort']).toBeTruthy()
  })

})