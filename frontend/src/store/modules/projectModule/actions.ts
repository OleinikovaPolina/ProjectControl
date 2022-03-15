import { Actions } from 'vuex-smart-module'
import ProjectState from '@/store/modules/projectModule/state'
import ProjectGetters from '@/store/modules/projectModule/getters'
import ProjectMutations from '@/store/modules/projectModule/mutations'
import ProjectService from '@/services/ProjectService'
import { commonModule } from '@/store'

export default class ProjectActions extends Actions<
  ProjectState,
  ProjectGetters,
  ProjectMutations,
  ProjectActions
> {
  /**
   * Get all projects function
   * @example projectModule.actions.projectGetAll()
   */
  async projectGetOwn() {
    await ProjectService.getOwnProjects()
      .then((projects) => {
        this.commit('SET_OWN_PROJECTS', projects)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get projects error',
        })
      })
  }

  /**
   * Get not own projects function
   * @example projectModule.actions.projectGetAll()
   */
  async projectGetNotOwn() {
    await ProjectService.getNotOwnProjects()
      .then((projects) => {
        this.commit('SET_NOT_OWN_PROJECTS', projects)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get projects error',
        })
      })
  }

  /**
   * Get not own projects with pagination function
   * @example projectModule.actions.projectGetNotOwnPages({page:1})
   */
  async projectGetNotOwnPages(payload: { page?: number }) {
    await ProjectService.getNotOwnProjectsPages(payload)
      .then((data) => {
        this.commit('SET_NOT_OWN_PROJECTS_PAGES', data.data)
        this.commit('SET_PAGES', data.pages)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get projects error',
        })
      })
  }

  /**
   * Get one project function
   * @example projectModule.actions.projectGet({id:'project id'})
   */
  async projectGet(payload: { id: string }) {
    await ProjectService.getOwnProject(payload)
      .then((project) => {
        this.commit('SET_PROJECT', project)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get project error',
        })
      })
  }

  /**
   * Create own project function
   * @param payload
   */
  async projectCreateOwnProject(payload: {
    title: string;
    short_description: string;
    description: string;
  }) {
    await ProjectService.createOwnProject(payload)
      .then((project) => {
        this.commit('ADD_PROJECT', project)
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Project successfully created',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Add project error',
        })
      })
  }

  /**
   * Change own project info function
   * @param payload
   */
  async projectChangeInfo(payload: {
    id: string;
    title?: string;
    short_description?: string;
    description?: string;
  }) {
    await ProjectService.changeProjectInfo(payload)
      .then((project) => {
        this.commit('CHANGE_PROJECT_INFO', project)
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Project successfully updated',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Update project error',
        })
      })
  }

  /**
   * Delete own project function
   * @param payload
   * @example projectModule.actions.projectDeleteOwnProject({id:'id project'})
   */
  async projectDeleteOwnProject(payload: { id: string }) {
    await ProjectService.deleteOwnProject(payload)
      .then(() => {
        this.commit('DELETE_PROJECT', payload)
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Project successfully deleted',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Delete project error',
        })
      })
  }

  /**
   * Determine if a user is a project leader or participant
   * @param payload
   * @example projectModule.actions.projectStatus(id:'id project')
   */
  async projectStatus(payload: { id: string }) {
    await ProjectService.projectStatus(payload)
      .then((data) => {
        this.commit('SET_STATUS', data)
      })
      .catch(() => {
        this.commit('SET_STATUS', { leader: false, participant: false })
      })
  }
}
