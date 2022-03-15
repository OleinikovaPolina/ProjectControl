import { instance } from '@/utils/api'

export default class ApplicationService {
  /**
   * Get user application function
   * Authentication is required
   * @return Promise
   * @example ApplicationService.getUserApplication()
   */
  static async getUserApplication() {
    return await instance.get('application/user').then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response.data
      }
      return Promise.reject(response.status)
    })
  }

  /**
   * Get project application function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ApplicationService.getProjectApplication()
   */
  static async getProjectApplication(payload: { id: string }) {
    return await instance
      .get('application/project', { params: payload })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Add user application function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ApplicationService.addUserApplication({
   *  project: 'Project Id',
   *  role: 'Designer';
   * })
   */
  static async addUserApplication(payload: { role: string; project: string }) {
    return await instance
      .post('application/user', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Add project application function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ApplicationService.addProjectApplication({
   *  user: 'User Id',
   *  project: 'Project Id',
   *  role: 'Designer';
   * })
   */
  static async addProjectApplication(payload: {
    user: string;
    role: string;
    project: string;
  }) {
    return await instance
      .post('application/project', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Update application function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ApplicationService.updateApplication({
   *  id: 'Application Id',
   *  type: -1|1,
   * })
   */
  static async updateApplication(payload: { id: string; type: number }) {
    return await instance
      .post('application/update', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Hidden application function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ApplicationService.hiddenApplication({
   *  id: 'Application Id',
   *  hidden:{hiddenUser:true}
   * })
   */
  static async hiddenApplication(payload: {
    id: string;
    hidden: { hiddenUser?: boolean; hiddenProject?: boolean };
  }) {
    return await instance
      .post('application/hidden', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }


  /**
   * Delete application function
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ApplicationService.deleteApplication({
   *  id: 'Application Id'
   * })
   */
  static async deleteApplication(payload: {
    id: string;
  }) {
    return await instance
      .delete('application', {params:payload})
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }
}
