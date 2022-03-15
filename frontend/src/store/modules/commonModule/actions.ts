import { Actions } from 'vuex-smart-module'
import CommonState from '@/store/modules/commonModule/state'
import CommonGetters from '@/store/modules/commonModule/getters'
import CommonMutations from '@/store/modules/commonModule/mutations'
import SkillService from '@/services/SkillService'
import RoleService from '@/services/RoleService'
import { applicationModule, commonModule, participantModule } from '@/store'

export default class CommonActions extends Actions<
  CommonState,
  CommonGetters,
  CommonMutations,
  CommonActions
> {
  /**
   * Get all skills function
   * @example commonModule.actions.commonGetSkills()
   */
  async commonGetSkills() {
    return await SkillService.getSkills()
      .then((skills) => {
        this.commit('SET_SKILLS', skills)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get skills error',
        })
      })
  }

  /**
   * Get all skills function
   * @param payload
   * @example commonModule.actions.commonAddSkills({name:'HTML'})
   */
  async commonAddSkills(payload:{name:string}) {
    return await SkillService.addSkill(payload)
      .then((skill) => {
        this.commit('ADD_SKILLS', skill)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get skills error',
        })
      })
  }

  /**
   * Get  roles for project function
   * @param payload
   * @example commonModule.actions.commonGetRoles({id:'project id'})
   */
  async commonGetRoles(payload: { id: string }) {
    return await RoleService.getRoles(payload)
      .then((roles) => {
        this.commit('SET_ROLES', roles)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get roles error',
        })
      })
  }

  /**
   * Get roles for adding applications function
   * @param payload
   */
  async commonGetRolesForApps(payload: { id: string; user?: string }) {
    return await RoleService.getRolesForApps(payload)
      .then((roles) => {
        this.commit('SET_ROLES_FOR_APPS', roles)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get roles error',
        })
      })
  }

  /**
   * Update roles function
   * @param payload
   */
  async commonUpdateRoles(payload: { id: string; roles?: Array<RoleService> }) {
    return await RoleService.updateRoles(payload)
      .then(() => {
        this.dispatch('commonGetRoles', { id: payload.id })
        applicationModule.actions.applicationProjectGet({ id: payload.id })
        participantModule.actions.participantGetForProject({ id: payload.id })
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Update roles successfully',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Update roles error',
        })
      })
  }

  /**
   * Delete role function
   * @param payload
   */
  async commonDeleteRole(payload: { id: string; project: string }) {
    return await RoleService.deleteRole({ id: payload.id })
      .then(() => {
        this.dispatch('commonGetRoles', { id: payload.project })
        applicationModule.actions.applicationProjectGet({ id: payload.project })
        participantModule.actions.participantGetForProject({ id: payload.project })
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Role successfully deleted',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Delete role error',
        })
      })
  }
}
