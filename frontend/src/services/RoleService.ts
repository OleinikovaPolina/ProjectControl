import { instance } from '@/utils/api'

export default class RoleService {
  /**
   * Get roles for project
   * @return Promise
   * @example RoleService.deleteRole({id:'Project Id'})
   */
  static async getRoles(payload: { id: string }) {
    return await instance.get('role', { params: payload }).then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response.data
      }
      return Promise.reject(response.status)
    })
  }

  /**
   * Get roles for adding applications for project
   * @return Promise
   * @example RoleService.deleteRole({id:'Project Id'})
   */
  static async getRolesForApps(payload: { id: string; user?: string }) {
    return await instance
      .get('role/forApps', { params: payload })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Delete role
   * @return Promise
   * @example RoleService.deleteRole({id:'Role Id'})
   */
  static async deleteRole(payload: { id: string }) {
    return await instance
      .delete('role', { params: payload })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Update roles function
   * @param payload
   * @return Promise
   * @example RoleService.updateRoles({id:'Project Id',roles:[{id:'Role id',name:'frontender',skills:["Skill Id"]}]})
   */
  static async updateRoles(payload: {
    id: string;
    roles?: Array<RoleService>;
  }) {
    return await instance
      .post('role/update', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }
}
