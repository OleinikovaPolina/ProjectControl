import { Getters } from 'vuex-smart-module'
import ParticipantState from './state'
import { userModule } from '@/store'

export default class ParticipantGetters extends Getters<ParticipantState> {
  get statusOfParticipation(): boolean {
    const res = this.state.participants.filter(
      (x) => x.participant.id === userModule.state.user.id
    )
    return res.length > 0
  }
}
