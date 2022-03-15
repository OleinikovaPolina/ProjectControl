import { Mutations } from 'vuex-smart-module'
import UserState from './state'
import { UserInterface } from '@/types'

export default class UserMutations extends Mutations<UserState> {
  SET_USER(payload: UserInterface) {
    this.state.user = payload
  }

  SET_PAGES(payload: number) {
    this.state.pages = payload
  }

  SET_PERSON(payload: UserInterface) {
    this.state.person = payload
  }

  DELETE_USER() {
    this.state.user = <UserInterface>{}
  }

  SET_IS_AUTH(payload: boolean) {
    this.state.isAuth = payload
  }

  SET_USERS_ALL(payload: Array<UserInterface>) {
    this.state.allUsers = payload
  }

  SET_USERS_ALL_PAGES(payload: Array<UserInterface>) {
    this.state.allUsersPages = payload
  }
}
