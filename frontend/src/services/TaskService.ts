import { instance } from '@/utils/api'

export default class TaskService {
  /**
   * Function to get all tasks of the project
   * Authentication is required
   * @param payload
   * @return Promise
   * @example TaskService.getTasks({ id:'Project Id'})
   */
  static async getTasks(payload: { id: string }) {
    return await instance.get('task', { params: payload }).then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response.data
      }
      return Promise.reject(response.status)
    })
  }

  /**
   * Add Task function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example TaskService.addTask({
   *  title: 'Title',
   *  short_description: 'Short description',
   *  description: 'Description',
   *  participants: ["User Id"],
   *  deadline: Date,
   *  project: 'Project Id',
   *  type_task: 0,
   * })
   */
  static async addTask(payload: {
    title?: string;
    short_description?: string;
    description?: string;
    participants?: Array<string>;
    deadline?: Date|string;
    project?: string;
  }) {
    return await instance
      .post('task', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Change Task function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example TaskService.changeTask({
   *  title: 'Title',
   *  short_description: 'Short description',
   *  description: 'Description',
   *  participants: ["User Id"],
   *  deadline: Date,
   *  type_task: 0,
   * })
   */
  static async changeTask(payload: {
    id?: string;
    title?: string;
    short_description?: string;
    description?: string;
    participants?: Array<string>;
    deadline?: Date|string;
    type_task?: number;
  }) {
    return await instance
      .post('task/update', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Delete task function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example TaskService.deleteTask({id:'Participant Id'})
   */
  static async deleteTask(payload: { id: string }) {
    return await instance
      .delete('task', { params: payload})
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }
}
