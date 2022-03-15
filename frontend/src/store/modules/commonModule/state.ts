import { AlertInterface, RoleInterface, SkillInterface } from '@/types'

export default class CommonState {
  skills: Array<SkillInterface> = [];
  roles: Array<RoleInterface> = [];
  rolesForApps: Array<RoleInterface> = [];
  alert: AlertInterface=<AlertInterface>{}
}
