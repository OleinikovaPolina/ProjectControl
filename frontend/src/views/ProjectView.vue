<template>
  <div>
    <BaseLoading v-if="!isLoading" />
    <template v-if="isLoading">
      <CardFull
        :project="project"
        :applications="applications"
        :participants="participants"
        :roles="roles"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import AvatarMixin from '@/mixins/AvatarMixin'
import {
  applicationMapper,
  applicationModule, commonMapper,
  commonModule,
  participantMapper,
  participantModule,
  projectMapper,
  projectModule
} from '@/store'


@Component({
  name: 'ProjectOwnView',
  components: {
    BaseLoading:()=>import('@/components/Common/BaseLoading.vue'),
    CardFull: () => import('@/components/Project/CardFull.vue')
  },
  computed: {
    ...commonMapper.mapState(['roles']),
    ...projectMapper.mapState(['project']),
    ...participantMapper.mapState(['participants']),
    ...applicationMapper.mapState({ applications: 'applicationsProject' })
  }
})
export default class ProjectOwnView extends Mixins(AvatarMixin) {
  private isLoading = false

  async mounted() {
    await commonModule.actions.commonGetRoles(
      { id: this.$route.params.id.toString() }
    )
    await projectModule.actions.projectGet(
      { id: this.$route.params.id.toString() }
    )
    await participantModule.actions.participantGetForProject(
      { id: this.$route.params.id.toString() }
    )
    await applicationModule.actions.applicationProjectGet(
      { id: this.$route.params.id.toString() }
    )
    if(Object.keys(projectModule.state.project).length===0){
      this.$router.push({ name:'404' }).catch(()=>({}))
    }
    this.isLoading = true
  }
}
</script>