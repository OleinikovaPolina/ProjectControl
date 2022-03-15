<template>
  <div>
    <BaseLoading v-if="!isLoading" />
    <template v-if="isLoading">
      <div v-if="projects.length===0">
        No projects found
      </div>
      <div
        v-for="participant in projects"
        :key="participant.id"
      >
        <CardSmall
          :project="participant.project"
          :path="'/project/'"
        >
          <template #role>
            <span class="text--secondary">&nbsp;({{ participant.roles.map(role => role.name).join(', ') }})</span>
          </template>
          <template #deletebtn>
            <v-btn
              icon
              @click="deleteProject({id:participant.id})"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </CardSmall>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { participantMapper, participantModule } from '@/store'
import AvatarMixin from '@/mixins/AvatarMixin'

@Component({
  name: 'ProjectParticipantAllView',
  components: {
    BaseLoading:()=>import('@/components/Common/BaseLoading.vue'),
    CardSmall: () => import('@/components/Project/CardSmall.vue')
  },
  computed: participantMapper.mapState(['projects'])
})
export default class ProjectParticipantAllView extends Mixins(AvatarMixin) {
  private isLoading = false

  async mounted() {
    await participantModule.actions.participantGetProjects()
    this.isLoading = true
  }

  async deleteProject(project: { id: string }) {
    await participantModule.actions.participantDeleteByHimself(project)
  }
}
</script>