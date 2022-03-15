import { Mutations } from 'vuex-smart-module'
import CommonState from './state'
import { AlertInterface, RoleInterface, SkillInterface } from '@/types'

export default class CommonMutations extends Mutations<CommonState> {
  SET_SKILLS(payload: Array<SkillInterface>) {
    this.state.skills = payload
  }

  ADD_SKILLS(payload: SkillInterface) {
    this.state.skills.push(payload)
  }

  SET_ROLES(payload: Array<RoleInterface>) {
    this.state.roles = payload
  }

  SET_ROLES_FOR_APPS(payload: Array<RoleInterface>) {
    this.state.rolesForApps = payload
  }

  ADD_ALERT(payload: AlertInterface) {
    this.state.alert = payload
  }
}
