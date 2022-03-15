import { ProjectInterface, StatusInterface } from '@/types'

export default class ProjectState {
  project: ProjectInterface = <ProjectInterface>{};
  ownProjects: Array<ProjectInterface> = [];
  notOwnProjects: Array<ProjectInterface> = [];
  notOwnProjectsPages: Array<ProjectInterface> = [];
  pages = 1;
  status : StatusInterface=<StatusInterface>{}
}
