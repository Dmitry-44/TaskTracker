import { flushPromises, shallowMount, VueWrapper, mount } from '@vue/test-utils';
import TaskCard from '@/components/kanban/TaskCard.vue';
import { createPinia } from 'pinia';
import type { Task } from "@/types/task"


// let wrapper: VueWrapper
// let wrapper: VueWrapper;

const taskMock: Task = {
  id: 1,
  title: 'Task 1',
  text: 'text',
  created_at: 124,
  // description: 'Description 1',
  priority: 1,
  status: 1
}


const pinia = createPinia()
// const counterStore = useCounterStore(pinia)

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  // wrapper = shallowMount(TaskCard)
});


describe('TaskKard component', () => {
  // it('При инициализации компонента activeOption равен null', async() => {
  //   wrapper = shallowMount((TaskCard, { 
  //     props: { task: taskMock, active: false, emptyCard: false },
  //     pinia
  //   }) as any)
  //   await wrapper.setProps({ active: true })
  //   await flushPromises()
  //   console.log('html', wrapper.html())
  //   expect(wrapper.classes('active')).toBe(false)
  // })

  it('renders successfully', () => {
    expect(() => {
      shallowMount(TaskCard, {
        props: { task: taskMock, active: false, emptyCard: false },
        pinia
      })
    }).not.toThrow()
  })

  it('когда карточка задачи не пустая, заголовок задачи отображается правильно', () => {
    const wrapper = mount(TaskCard, {
      props: { task: taskMock, active: false, emptyCard: false },
      pinia
    })
    console.log('wrapper', wrapper.html())
    const taskTitle = wrapper.find('.task-title')
    // expect(taskTitle.text()).toContain(taskMock.title)
  })




})