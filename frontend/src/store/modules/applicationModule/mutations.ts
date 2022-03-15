import { Mutations } from 'vuex-smart-module'
import ApplicationState from '@/store/modules/applicationModule/state'
import { ApplicationInterface } from '@/types'

export default class ApplicationMutations extends Mutations<ApplicationState> {
  SET_APPLICATIONS_USER(payload: Array<ApplicationInterface>) {
    this.state.applicationsUser = payload
  }

  DELETE_APPLICATION_USER(payload: { id: string }) {
    this.state.applicationsUser = this.state.applicationsUser.filter(
      (application) => application.id !== payload.id
    )
  }

  SET_APPLICATIONS_PROJECT(payload: Array<ApplicationInterface>) {
    this.state.applicationsProject = payload
  }

  DELETE_APPLICATION_PROJECT(payload: { id: string }) {
    this.state.applicationsProject = this.state.applicationsProject.filter(
      (application) => application.id !== payload.id
    )
  }
}
