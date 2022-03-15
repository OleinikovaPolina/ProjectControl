import { Actions } from 'vuex-smart-module'
import UserState from '@/store/modules/userModule/state'
import UserGetters from '@/store/modules/userModule/getters'
import UserMutations from '@/store/modules/userModule/mutations'
import UserService from '@/services/UserService'
import { commonModule } from '@/store'

export default class UserActions extends Actions<
  UserState,
  UserGetters,
  UserMutations,
  UserActions
> {
  /**
   * Authorization function
   * @param payload
   * @example userModule.actions.userLogin({ login: 'Login'; pass: 'Pa$$w0rd' })
   */
  async userLogin(payload: { login: string; pass: string }) {
    return await UserService.login(payload)
      .then((user) => {
        localStorage.setItem('user', user.id)
        this.commit('SET_USER', user)
        this.commit('SET_IS_AUTH', true)
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Successful login',
        })
        return Promise.resolve(true)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Login failed',
        })
      })
  }

  /**
   * Registration function
   * @param payload
   */
  async userRegister(payload: {
    login: string;
    pass: string;
    name: string;
    email: string;
  }) {
    return await UserService.register(payload)
      .then((user) => {
        localStorage.setItem('user', user.id)
        this.commit('SET_USER', user)
        this.commit('SET_IS_AUTH', true)
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Successful registration',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Registration error',
        })
      })
  }

  /**
   * Logout function
   * @example userModule.actions.userLogout()
   */
  async userLogout() {
    await UserService.logout()
      .then(() => {
        localStorage.removeItem('user')
        this.commit('DELETE_USER')
        this.commit('SET_IS_AUTH', false)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Logout error',
        })
      })
  }

  /**
   * Check user function
   */
  async userCheck(payload: { id: string }) {
    await UserService.check(payload)
      .then((user) => {
        this.commit('SET_USER', Object.assign(user, payload))
        this.commit('SET_IS_AUTH', true)
      })
      .catch(() => {
        this.commit('SET_IS_AUTH', false)
        localStorage.removeItem('user')
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Error user check',
        })
      })
  }

  /**
   * Get all users function
   * @example userModule.actions.userGetAll({ page: 1 })
   */
  async userGetAllPages(payload: { page?: number }) {
    await UserService.getAllPages(payload)
      .then((data) => {
        this.commit('SET_USERS_ALL_PAGES', data.data)
        this.commit('SET_PAGES', data.pages)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get all users error',
        })
      })
  }

  /**
   * Get all users function
   * @example userModule.actions.userGetAll()
   */
  async userGetAll() {
    await UserService.getAll()
      .then((users) => {
        this.commit('SET_USERS_ALL', users)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get all users error',
        })
      })
  }

  /**
   * Get person function
   * @param payload
   * @example userModule.actions.userGetOne({id:'id user'})
   */
  async userGetOne(payload: { id: string }) {
    await UserService.getOne(payload)
      .then((person) => {
        this.commit('SET_PERSON', person)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get person error',
        })
      })
  }

  /**
   * Update profile function
   * @param payload
   */
  async userUpdateProfile(payload: {
    email: string;
    name: string;
    bio: string;
    skills: Array<string>;
  }) {
    await UserService.updateProfile(payload)
      .then((person) => {
        this.dispatch('userCheck', person)
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Profile updated successfully',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Update profile error',
        })
      })
  }
}
