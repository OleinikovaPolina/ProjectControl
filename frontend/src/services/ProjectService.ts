import { instance } from '@/utils/api'

export default class ProjectService {
  /**
   * Function to receive user-created projects
   * Authentication is required
   * @return Promise
   * @example ProjectService.getOwnProjects()
   */
  static async getOwnProjects() {
    return await instance.get('project/own').then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response.data
      }
      return Promise.reject(response.status)
    })
  }

  /**
   * Get not own projects
   * Authentication is required
   * @return Promise
   * @example ProjectService.getNotOwnProjects()
   */
  static async getNotOwnProjects() {
    return await instance.get('project/notOwn').then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response.data
      }
      return Promise.reject(response.status)
    })
  }

  /**
   * Get not own projects with pagination
   * Authentication is required
   * @return Promise
   * @example ProjectService.getNotOwnProjectsPages({page:1})
   */
  static async getNotOwnProjectsPages(payload: { page?: number }) {
    return await instance
      .get('project/notOwnPages', { params: payload })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Function to receive user-created one project
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ProjectService.getOwnProject()
   */
  static async getOwnProject(payload: { id: string }) {
    return await instance
      .get('project/one', { params: payload })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Project creation function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ProjectService.createOwnProject({
   *  title:'The name of the project',
   *  short_description:'The short description of the project',
   *  description:'The description of the project'
   * })
   */
  static async createOwnProject(payload: {
    title: string;
    short_description: string;
    description: string;
  }) {
    return await instance
      .post('project', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Project change info function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ProjectService.changeOwnProject({
   *  id:'Project Id',
   *  title:'The name of the project',
   *  short_description:'The short description of the project',
   *  description:'The description of the project'
   * })
   */
  static async changeProjectInfo(payload: {
    id: string;
    title?: string;
    short_description?: string;
    description?: string;
  }) {
    return await instance
      .post('project/update', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }


  /**
   * Project delete function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ProjectService.deleteOwnProject({id:'Project Id'})
   */
  static async deleteOwnProject(payload: { id: string }) {
    return await instance
      .delete('project', { params: payload })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Determine if a user is a project leader or participant
   * Authentication is required
   * @param payload
   * @example ProjectService.isLeader({id:'project id})
   */
  static async projectStatus(payload: { id: string }) {
    return await instance
      .get('project/statusUser', { params: payload })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }
}
