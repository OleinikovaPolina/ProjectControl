import { UserInterface } from '@/types'

export default class UserState {
  user: UserInterface = <UserInterface>{};
  isAuth = false;
  allUsers: Array<UserInterface> = [];
  allUsersPages: Array<UserInterface> = [];
  pages=1
  person: UserInterface = <UserInterface>{};
}
