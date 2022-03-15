<template>
  <div>
    <BaseLoading v-if="!isLoading" />
    <template v-if="isLoading">
      <v-btn
        color="primary"
        class="mb-5"
        @click="changeDialogInfo(true)"
      >
        Add project
      </v-btn>
      <div v-if="ownProjects.length===0">
        No projects found
      </div>
      <div
        v-for="project in ownProjects"
        :key="project.id"
      >
        <CardSmall
          :project="project"
          :path="'/ownproject/'"
        >
          <template #deletebtn>
            <v-btn
              icon
              @click="deleteProject({id:project.id})"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </CardSmall>
      </div>
      <DialogProjectInfo
        :dialog="dialogInfo"
        :project-info="{id:'',title: '', short_description: '', description: ''}"
        @change-dialog="changeDialogInfo"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { projectMapper, projectModule } from '@/store'
import AvatarMixin from '@/mixins/AvatarMixin'

@Component({
  name: 'ProjectOwnAllView',
  computed: projectMapper.mapState(['ownProjects']),
  components: {
    BaseLoading:()=>import('@/components/Common/BaseLoading.vue'),
    DialogProjectInfo: () => import('@/components/Project/DialogInfo.vue'),
    CardSmall: () => import('@/components/Project/CardSmall.vue')
  }
})
export default class ProjectOwnAllView extends Mixins(AvatarMixin) {
  private dialogInfo = false
  private isLoading = false

  async mounted() {
    await projectModule.actions.projectGetOwn()
    this.isLoading = true
  }

  private changeDialogInfo(val: boolean) {
    this.dialogInfo = val
  }

  async deleteProject(project: { id: string }) {
    await projectModule.actions.projectDeleteOwnProject(project)
  }
}
</script>