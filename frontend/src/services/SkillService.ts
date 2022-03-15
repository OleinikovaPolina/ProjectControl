import { instance } from '@/utils/api'

export default class SkillService {
  /**
   * Get all skills function
   * @return Promise
   * @example SkillService.getSkills()
   */
  static async getSkills() {
    return await instance.get('skill').then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response.data
      }
      return Promise.reject(response.status)
    })
  }

  /**
   * Add skill function
   * @param payload
   * @return Promise
   * @example SkillService.addSkill({name:'HTML'})
   */
  static async addSkill(payload: { name: string }) {
    return await instance
      .post('skill', JSON.stringify(payload))
      .then((response) => {
        if (200 <= response.status && response.status < 300) {
          return response.data
        }
        return Promise.reject(response.status)
      })
  }
}
