import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils';
import KanbanColumnFilter from '@/components/kanban/KanbanColumnFilter.vue';


// let wrapper: VueWrapper
let wrapper: VueWrapper;

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  wrapper = shallowMount(KanbanColumnFilter)
});


describe('KanbanColumnFilter component', () => {
  it('При инициализации компонента activeOption равен null', () => {
    expect((wrapper.vm as any).activeOption).toBeNull()
  })

  it('Сбрасываем фильтр и ожидаем увидеть в теге span значение placeholder', async() => {
    const placeholder = 'Фильтр'
    await (wrapper.vm as any).resetActive()
    await flushPromises()
    expect(wrapper.find('.el-dropdown-link').text()).toEqual(placeholder)
  })

  it('Метод setActive изменяет значение activeOption и эмитит событие "changeSort"', async() => {
    const optionIndex = 3 // выбранный индекс опции
    await (wrapper.vm as any).setActive(optionIndex)
    expect((wrapper.vm as any).activeOption).toEqual((wrapper.vm as any).FILTER_OPTIONS[optionIndex])
    expect(wrapper.emitted('changeSort')).toBeTruthy()

  })

  it('После выбора опции событие emit "changeSort" не вызывается', async() => {
    const optionIndex = -1 // выбранный индекс опции
    await (wrapper.vm as any).setActive(optionIndex)
    expect(wrapper.emitted()['changeSort']).not.toBeTruthy()
  })

  it('Установим опцию 100', async() => {
    const optionIndex = 100 // выбранный индекс опции
    await (wrapper.vm as any).setActive(optionIndex)
    expect(wrapper.emitted()['changeSort']).not.toBeTruthy()
  })

  it('Метод resetActive устанавливает значение activeOption в null и эмитит событие "noSort" ', async() => {
    (wrapper.vm as any).resetActive()
    expect((wrapper.vm as any).activeOption).toBeNull()
    expect(wrapper.emitted()['noSort']).toBeTruthy()
  })

})