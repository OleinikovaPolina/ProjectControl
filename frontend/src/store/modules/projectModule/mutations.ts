import { Mutations } from 'vuex-smart-module'
import ProjectState from './state'
import { ProjectInterface, StatusInterface } from '@/types'

export default class ProjectMutations extends Mutations<ProjectState> {
  SET_OWN_PROJECTS(payload: Array<ProjectInterface>) {
    this.state.ownProjects = payload
  }

  SET_NOT_OWN_PROJECTS_PAGES(payload: Array<ProjectInterface>) {
    this.state.notOwnProjectsPages = payload
  }

  SET_PAGES(payload: number) {
    this.state.pages = payload
  }

  SET_STATUS(payload: StatusInterface) {
    this.state.status = payload
  }

  ADD_PROJECT(payload: ProjectInterface) {
    this.state.ownProjects.unshift(payload)
  }

  DELETE_PROJECT(payload: { id: string }) {
    this.state.ownProjects = this.state.ownProjects.filter(
      (project) => project.id !== payload.id
    )
  }

  SET_NOT_OWN_PROJECTS(payload: Array<ProjectInterface>) {
    this.state.notOwnProjects = payload
  }

  SET_PROJECT(payload: ProjectInterface) {
    this.state.project = payload
  }

  CHANGE_PROJECT_INFO(payload: ProjectInterface) {
    this.state.project = Object.assign(this.state.project, payload)
  }
}
