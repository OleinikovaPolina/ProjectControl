import { Actions } from 'vuex-smart-module'
import ParticipantState from '@/store/modules/particiantModule/state'
import ParticipantGetters from '@/store/modules/particiantModule/getters'
import ParticipantMutations from '@/store/modules/particiantModule/mutations'
import ParticipantService from '@/services/ParticipantService'
import { commonModule } from '@/store'

export default class ParticipantActions extends Actions<
  ParticipantState,
  ParticipantGetters,
  ParticipantMutations,
  ParticipantActions
> {
  /**
   * Get projects
   * @example participantModule.actions.participantGetProjects()
   */
  async participantGetProjects() {
    await ParticipantService.getProjects()
      .then((projects) => {
        this.commit('SET_PROJECTS', projects)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get projects error',
        })
      })
  }

  /**
   * Get participants fo project
   * @param payload
   * @example participantModule.actions.participantGetForProject({id:'project id'})
   */
  async participantGetForProject(payload: { id: string }) {
    await ParticipantService.getAllParticipants(payload)
      .then((participants) => {
        this.commit('SET_PARTICIPANTS', participants)
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Get projects error',
        })
      })
  }

  /**
   * Delete participant by owner
   * @param payload
   * @example participantModule.actions.participantDeleteByOwner({id:'participant id'})
   */
  async participantDeleteByOwner(payload: { id: string }) {
    await ParticipantService.deleteParticipantByOwner(payload)
      .then(() => {
        this.commit('DELETE_PARTICIPANT', payload)
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'Participant successfully deleted',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Delete project error',
        })
      })
  }

  /**
   * Delete participant by himself
   * @param payload
   * @example participantModule.actions.participantDeleteByHimself({id:'participant id'})
   */
  async participantDeleteByHimself(payload: { id: string }) {
    await ParticipantService.deleteParticipant(payload)
      .then(() => {
        this.dispatch('participantGetProjects')
        commonModule.mutations.ADD_ALERT({
          type: 'success',
          text: 'You have successfully left the project',
        })
      })
      .catch(() => {
        commonModule.mutations.ADD_ALERT({
          type: 'error',
          text: 'Project exit error',
        })
      })
  }
}
