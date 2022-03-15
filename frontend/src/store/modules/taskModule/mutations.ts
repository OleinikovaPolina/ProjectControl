import { Mutations } from 'vuex-smart-module'
import TaskState from './state'
import { TaskInterface } from '@/types'

export default class UserMutations extends Mutations<TaskState> {
  SET_TASKS(payload: Array<TaskInterface>) {
    this.state.tasks = payload.reduce(function (r, a) {
      r[a.type_task] = r[a.type_task] || []
      r[a.type_task].push(a)
      return r
    }, Object.create(null))
  }

  DELETE_TASK(payload: { id: string }) {
    for (const key in this.state.tasks) {
      this.state.tasks[key] = this.state.tasks[key].filter(
        (x) => x.id !== payload.id
      )
    }
  }
}
