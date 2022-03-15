<template>
  <div>
    <BaseLoading v-if="!isLoading" />
    <template v-if="isLoading">
      <CardFull
        :project="project"
        :applications="applications"
        :participants="participants"
        :roles="roles"
      >
        <template #changeRoles>
          <v-btn
            icon
            small
            @click="()=>{changeDialogRoles(true)}"
          >
            <v-icon>mdi-square-edit-outline</v-icon>
          </v-btn>
        </template>
        <template #changeInfo>
          <v-btn
            icon
            small
            @click="()=>{changeDialogInfo(true)}"
          >
            <v-icon>mdi-square-edit-outline</v-icon>
          </v-btn>
        </template>
        <template #addApplication>
          <v-btn
            icon
            small
            @click="()=>{changeDialogApplication(true)}"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <template #deleteRole="role">
          <v-btn
            icon
            type="button"
            @click="deleteRole(role.role.id,project.id)"
          >
            <v-icon color="grey lighten-1">
              mdi-close
            </v-icon>
          </v-btn>
        </template>
        <template #deleteParticipant="slotProps">
          <v-btn
            icon
            type="button"
            @click="deleteParticipant(slotProps.participant.id)"
          >
            <v-icon color="grey lighten-1">
              mdi-close
            </v-icon>
          </v-btn>
        </template>
        <template #applicationDelete="slotProps">
          <v-btn
            color="error"
            small
            outlined
            @click="applicationDelete(slotProps.application.id)"
          >
            delete
            <v-icon right>
              mdi-close
            </v-icon>
          </v-btn>
        </template>
        <template #applicationUpdateTrue="slotProps">
          <v-btn
            color="success"
            small
            outlined
            @click="applicationUpdate(slotProps.application.id,1)"
          >
            accept
            <v-icon right>
              mdi-check
            </v-icon>
          </v-btn>
        </template>
        <template #applicationUpdateFalse="slotProps">
          <v-btn
            color="error"
            small
            outlined
            @click="applicationUpdate(slotProps.application.id,-1)"
          >
            reject
            <v-icon right>
              mdi-check
            </v-icon>
          </v-btn>
        </template>
        <template #hiddenApplication="slotProps">
          <v-btn
            color="orange"
            small
            outlined
            @click="hiddenApplication({id:slotProps.application.id},project.id)"
          >
            Hidden
            <v-icon right>
              mdi-eye-off
            </v-icon>
          </v-btn>
        </template>
      </CardFull>
      <DialogProjectInfo
        :dialog="dialogInfo"
        :project-info="{id:project.id,title: project.title,
                        short_description: project.short_description,
                        description: project.description}"
        @change-dialog="changeDialogInfo"
      />
      <TheDialogProjectRoles
        :dialog="dialogRoles"
        :project-roles="{id:project.id,roles:roles}"
        @change-dialog="changeDialogRoles"
      />
      <DialogApplication
        :project="project"
        :dialog="dialogApplication"
        @change-dialog="changeDialogApplication"
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
  projectModule, userModule
} from '@/store'


@Component({
  name: 'ProjectOwnView',
  components: {
    BaseLoading:()=>import('@/components/Common/BaseLoading.vue'),
    CardFull: () => import('@/components/Project/CardFull.vue'),
    TheDialogProjectRoles: () => import('@/components/Project/TheDialogRoles.vue'),
    DialogProjectInfo: () => import('@/components/Project/DialogInfo.vue'),
    DialogApplication: () => import('@/components/Application/DialogApplication.vue')
  },
  computed: {
    ...commonMapper.mapState({roles:'roles'}),
    ...projectMapper.mapState(['project']),
    ...participantMapper.mapState(['participants']),
    ...applicationMapper.mapState({ applications: 'applicationsProject' })
  }
})
export default class ProjectOwnView extends Mixins(AvatarMixin) {
  private dialogInfo = false
  private dialogRoles = false
  private dialogApplication = false
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
    if(projectModule.state.project.leader.id!==userModule.state.user.id){
      this.$router.push({ name:'404' }).catch(()=>({}))
    }
    this.isLoading = true
  }


  private changeDialogInfo(val: boolean) {
    this.dialogInfo = val
  }

  private changeDialogRoles(val: boolean) {
    this.dialogRoles = val
  }

  private changeDialogApplication(val: boolean) {
    this.dialogApplication = val
  }

  async applicationUpdate(id: string, type: number): Promise<void> {
    await applicationModule.actions.applicationUpdate({ id, type })
  }

  async deleteRole(role: string, project: string): Promise<void> {
    await commonModule.actions.commonDeleteRole({ id: role, project })
  }

  async deleteParticipant(id: string): Promise<void> {
    await participantModule.actions.participantDeleteByOwner({ id })
  }

  async applicationDelete(id: string): Promise<void> {
    await applicationModule.actions.applicationDelete({ id })
  }

  async hiddenApplication(payload: { id: string; }, project: string): Promise<void> {
    await applicationModule.actions.applicationHidden(
      {
        req: Object.assign(payload, { hidden: { hiddenProject: true } }),
        project
      })
  }
}
</script>