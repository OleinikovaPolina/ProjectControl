import { Mutations } from 'vuex-smart-module'
import ParticipantState from './state'
import { ParticipantInterface, ParticipantProjectInterface } from '@/types'

export default class ParticipantMutations extends Mutations<ParticipantState> {
  SET_PROJECTS(payload: Array<ParticipantProjectInterface>) {
    this.state.projects = payload
  }

  SET_PARTICIPANTS(payload: Array<ParticipantInterface>) {
    this.state.participants = payload
  }

  DELETE_PARTICIPANT(payload: { id: string }) {
    this.state.participants = this.state.participants.filter(
      (participant) => participant.id != payload.id
    )
  }
}
