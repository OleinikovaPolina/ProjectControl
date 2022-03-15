import { Module } from 'vuex-smart-module'
import getters from './getters'
import state from './state'
import actions from './actions'
import mutations from './mutations'

const user = new Module({
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations,
})

export default user
