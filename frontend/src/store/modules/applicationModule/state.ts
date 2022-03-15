import { ApplicationInterface } from '@/types'

export default class ApplicationState {
  applicationsUser: Array<ApplicationInterface> = [];
  applicationsProject: Array<ApplicationInterface> = [];
}
