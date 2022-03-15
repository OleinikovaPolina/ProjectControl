import { ParticipantProjectInterface } from '@/types'
import { ParticipantInterface } from '@/types'

export default class ParticipantState {
  projects: Array<ParticipantProjectInterface> = [];
  participants: Array<ParticipantInterface> = [];
}
