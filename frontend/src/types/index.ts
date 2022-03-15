export interface UserInterface {
  id: string;
  name: string;
  login?: string;
  email: string;
  bio: string;
  skills: Array<SkillInterface>;
}

export interface ProjectInterface {
  id: string;
  title: string;
  short_description: string;
  description: string;
  leader: UserInterface;
  roles: Array<RoleInterface>;
}

export interface ParticipantProjectInterface {
  id: string;
  roles: Array<RoleInterface>;
  project: ProjectInterface;
}

export interface SkillInterface {
  id: string;
  name: string;
}

export interface RoleInterface {
  id?: string;
  name: string;
  skills: Array<SkillInterface>;
}

export interface ParticipantInterface {
  id: string;
  participant: UserInterface;
  roles: Array<RoleInterface>;
}

export interface TaskInterface {
  id: string;
  title: string;
  short_description: string;
  description: string;
  participants: Array<ParticipantInterface>;
  times: [Date];
  deadline: Date;
  type_task: number;
  project: { leader: string };
  createdAt: Date;
}

export interface ObjectTasksInterface {
  [key: number]: Array<TaskInterface>;
}

export interface ApplicationInterface {
  id: string;
  user?: UserInterface;
  project?: {
    id: string;
    title: string;
  };
  typeProject: number;
  typeUser: number;
  typeStart: number;
  role: RoleInterface;
}

export interface AlertInterface {
  type: string;
  text: string;
}

export interface StatusInterface {
  leader: boolean;
  participant: boolean;
}
