import Vue from 'vue'
import Vuex from 'vuex'

import { Module, createStore, createMapper } from 'vuex-smart-module'
import user from './modules/userModule'
import task from '@/store/modules/taskModule'
import project from '@/store/modules/projectModule'
import participant from '@/store/modules/particiantModule'
import application from '@/store/modules/applicationModule'
import common from '@/store/modules/commonModule'

Vue.use(Vuex)

const root = new Module({
  modules: {
    user,
    project,
    participant,
    task,
    application,
    common,
  },
})

const store = createStore(root)

export default store

export const applicationModule = application.context(store)
export const commonModule = common.context(store)
export const participantModule = participant.context(store)
export const projectModule = project.context(store)
export const taskModule = task.context(store)
export const userModule = user.context(store)

export const applicationMapper = createMapper(application)
export const commonMapper = createMapper(common)
export const participantMapper = createMapper(participant)
export const projectMapper = createMapper(project)
export const taskMapper = createMapper(task)
export const userMapper = createMapper(user)
