import { instance } from '@/utils/api'

export default class ParticipantService {
  /**
   * Function that receives projects in which the user participates
   * Authentication is required
   * @return Promise
   * @example ParticipantService.getProjects()
   */
  static async getProjects() {
    return await instance.get('participant').then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response.data
      }
      return Promise.reject(response.status)
    })
  }

  /**
   * Function to get all project participants
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ParticipantService.getAllParticipants({ id:'Project Id'})
   */
  static async getAllParticipants(payload: { id: string }) {
    return await instance
      .get('participant/project', { params: payload })
      .then(function(response) {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Function of removing a participant by the creator of the project
   * Authentication is required
   * @param payload
   * @return Promise
   * @example ParticipantService.deleteParticipantByOwner({id:'Participant Id'})
   */
  static async deleteParticipantByOwner(payload: { id: string }) {
    return await instance
      .delete('participant', { params: payload })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }

  /**
   * Function of removing a participant by himself
   * Authentication is required
   * @return Promise
   * @example ParticipantService.deleteParticipant({id:'Participant Id'})
   */
  static async deleteParticipant(payload: { id: string }) {
    return await instance
      .delete('participant/me', { params: payload })
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }
}
