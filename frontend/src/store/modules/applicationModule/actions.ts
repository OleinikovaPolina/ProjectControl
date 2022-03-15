import { Actions } from 'vuex-smart-module'
import ApplicationState from '@/store/modules/applicationModule/state'
import ApplicationGetters from '@/store/modules/applicationModule/getters'
import ApplicationMutations from '@/store/modules/applicationModule/mutations'
import ApplicationService from '@/services/ApplicationService'
import { commonModule, participantModule } from '@/store'

export default class ApplicationActions extends Actions<
  ApplicationState,
  ApplicationGetters,
  ApplicationMutations,
  ApplicationActions
> {
  /**
   * Get applications for user
   * @example applicationModule.actions.applicationUserGet()
   */
  async applicationUserGet() {
    await ApplicationService.getUserApplication()
      .then((applications) => {
        this.commit('SET_APPLICATIONS_USER', applications)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get applications error',
        })
      })
  }

  /**
   * Get applications for project
   * @param payload
   * @example applicationModule.actions.applicationProjectGet({id:'project id'})
   */
  async applicationProjectGet(payload: { id: string }) {
    await ApplicationService.getProjectApplication(payload)
      .then((applications) => {
        this.commit('SET_APPLICATIONS_PROJECT', applications)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get applications error',
        })
      })
  }

  /**
   * Add application by user
   * @param payload
   */
  async applicationAddUser(payload: { role: string; project: string }) {
    await ApplicationService.addUserApplication(payload)
      .then(() => {
        this.dispatch('applicationUserGet')
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Application successfully added',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Add application error',
        })
      })
  }

  /**
   * Add application by owner of project
   * @param payload
   */
  async applicationAddProject(payload: {
    user: string;
    role: string;
    project: string;
  }) {
    await ApplicationService.addProjectApplication(payload)
      .then(() => {
        this.dispatch('applicationProjectGet', { id: payload.project })
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Application successfully added',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Add application error',
        })
      })
  }

  /**
   * Update application
   * @param payload
   */
  async applicationUpdate(payload: { id: string; type: number }) {
    await ApplicationService.updateApplication(payload)
      .then((res) => {
        this.dispatch('applicationUserGet')
        participantModule.actions.participantGetProjects()
        this.dispatch('applicationProjectGet', { id: res.project })
        participantModule.actions.participantGetForProject({ id: res.project })
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Application successfully updated',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Update application error',
        })
      })
  }

  /**
   * Hidden application
   * @param payload
   */
  async applicationHidden(payload: {
    req: {
      id: string;
      hidden: { hiddenUser?: boolean; hiddenProject?: boolean };
    };
    project?: string;
  }) {
    await ApplicationService.hiddenApplication(payload.req)
      .then(() => {
        if (payload.req.hidden.hiddenUser) {
          this.dispatch('applicationUserGet')
        }
        if (payload.req.hidden.hiddenProject) {
          this.dispatch('applicationProjectGet', { id: payload.project || '' })
        }
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Application successfully hidden',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Hidden application error',
        })
      })
  }

  /**
   * Delete application
   * @param payload
   * @example applicationModule.actions.applicationDelete({id:'application id'})
   */
  async applicationDelete(payload: { id: string }) {
    await ApplicationService.deleteApplication(payload)
      .then(() => {
        this.commit('DELETE_APPLICATION_USER', payload)
        this.commit('DELETE_APPLICATION_PROJECT', payload)
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Application successfully deleted',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Delete application error',
        })
      })
  }
}
