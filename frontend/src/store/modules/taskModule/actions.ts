import { Actions } from 'vuex-smart-module'
import TaskState from '@/store/modules/taskModule/state'
import TaskGetters from '@/store/modules/taskModule/getters'
import TaskMutations from '@/store/modules/taskModule/mutations'
import TaskService from '@/services/TaskService'
import { commonModule } from '@/store'

export default class TaskActions extends Actions<
  TaskState,
  TaskGetters,
  TaskMutations,
  TaskActions
> {
  /**
   * Get tasks for project
   * @param payload
   * @example taskModule.actions.taskGetForProject({id:'project id'})
   */
  async taskGetForProject(payload: { id: string }) {
    await TaskService.getTasks(payload)
      .then((tasks) => {
        this.commit('SET_TASKS', tasks)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get tasks error',
        })
      })
  }

  /**
   * Create task
   * @param payload
   */
  async taskCreate(payload: {
    title?: string;
    short_description?: string;
    description?: string;
    participants?: Array<string>;
    deadline?: Date|string;
    project: string;
  }) {
    await TaskService.addTask(payload)
      .then(() => {
        this.dispatch('taskGetForProject', { id: payload.project })
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Task successfully created',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Add task error',
        })
      })
  }

  /**
   * Change task
   * @param payload
   */
  async taskChange(payload: {
    data: {
      id?: string;
      title?: string;
      short_description?: string;
      description?: string;
      participants?: Array<string>;
      deadline?: Date|string;
      type_task?: number;
    };
    project: string;
  }) {
    await TaskService.changeTask(payload.data)
      .then(async () => {
        await this.dispatch('taskGetForProject', { id: payload.project })
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Task successfully changed',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Task change error',
        })
      })
  }

  /**
   * Delete task
   * @param payload
   * @example taskModule.actions.taskDelete({id:'task id'})
   */
  async taskDelete(payload: { id: string }) {
    await TaskService.deleteTask(payload)
      .then((id) => {
        this.commit('DELETE_TASK', id)
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Task successfully deleted',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Task deletion error',
        })
      })
  }
}
