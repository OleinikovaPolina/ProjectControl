import { instance } from '@/utils/api'

export default class UserService {
  /**
   * Authorization function
   * @param payload
   * @return Promise
   * @example UserService.login({login:'myLogin', pass:'pa$$w0rd'})
   */
  static async login(payload: { login: string; pass: string }) {
    return await instance
      .post('user/login', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Registration function
   * @param payload
   * @return Promise
   * @example UserService.register({login:'myLogin', pass:'pa$$w0rd', name:'User'})
   */
  static async register(payload: {
    login: string;
    pass: string;
    name: string;
    email: string;
  }) {
    return await instance
      .post('user/register', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Logout function
   * @return Promise
   * @example UserService.logout()
   */
  static async logout() {
    return await instance.post('user/logout').then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response.data
      }
      return Promise.reject(response.status)
    })
  }

  /**
   * Check user
   * Authentication is required
   * @param payload
   * @return Promise
   * @example UserService.check({id:'User Id'})
   */
  static async check(payload: { id: string }) {
    return await instance
      .post('user/check', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Get all users
   * Authentication is required
   * @return Promise
   * @example UserService.getAll()
   */
  static async getAll() {
    return await instance
      .get('user/check/all')
      .then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response.data
      }
      return Promise.reject(response.status)
    })
  }
  /**
   * Get all users with pagination
   * Authentication is required
   * @return Promise
   * @example UserService.getAll({page:1})
   */
  static async getAllPages(payload: { page?: number }) {
    return await instance
      .get('user/check/allPages',{params:payload})
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }
  /**
   * Get person
   * Authentication is required
   * @param payload
   * @return Promise
   * @example UserService.getOne({id:'user Id'})
   */
  static async getOne(payload: { id: string }) {
    return await instance
      .get('user/check/one', { params: payload })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Update profile
   * Authentication is required
   * @param payload
   * @return Promise
   */
  static async updateProfile(payload: {
    email: string;
    name: string;
    bio: string;
    skills: Array<string>;
  }) {
    return await instance
      .post('user/check/update', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }
}
