<template>
  <div>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      grow
    >
      <v-tab> Users</v-tab>
      <v-tab> Projects</v-tab>
    </v-tabs>
    <BaseLoading v-if="!isLoading" />
    <template v-if="isLoading">
      <v-tabs-items
        v-model="tab"
        class="mt-3"
        style="background-color: transparent!important"
      >
        <v-tab-item>
          <div
            v-for="user in allUsersPages"
            :key="user.id"
          >
            <TheCardSmallUser
              :user="user"
            >
              <template #deletebtn>
                <v-btn
                  icon
                  @click="beforeDialog({ user:user.id})"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </TheCardSmallUser>
          </div>
          <div
            v-if="allUsersPages.length===0"
            class="d-flex justify-center"
          >
            No users found
          </div>
          <v-pagination
            v-if="allUsersPages.length>0"
            v-model="page0"
            :length="pages0"
          />
        </v-tab-item>
        <v-tab-item>
          <div
            v-for="project in notOwnProjectsPages"
            :key="project.id"
          >
            <CardSmallProject
              :project="project"
              :path="'/project/'"
            >
              <template #deletebtn>
                <v-btn
                  icon
                  @click="beforeDialog({ project:project})"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
            </CardSmallProject>
          </div>
          <div
            v-if="notOwnProjectsPages.length===0"
            class="d-flex justify-center"
          >
            No projects found
          </div>
          <v-pagination
            v-if="notOwnProjectsPages.length>0"
            v-model="page1"
            :length="pages1"
          />
        </v-tab-item>
      </v-tabs-items>
      <DialogApplication
        :dialog="dialogApplication"
        :project="activeProject"
        :user="activeUser"
        :is-user="activeIsUser"
        :tab="tab"
        @change-dialog="changeDialogApplication"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { projectMapper, projectModule, userMapper, userModule } from '@/store'
import AvatarMixin from '@/mixins/AvatarMixin'

@Component({
  name: 'ProjectParticipantAllView',
  components: {
    BaseLoading: () => import('@/components/Common/BaseLoading.vue'),
    DialogApplication: () => import('@/components/Application/DialogApplication.vue'),
    CardSmallProject: () => import('@/components/Project/CardSmall.vue'),
    TheCardSmallUser: () => import('@/components/User/TheCardSmall.vue')
  },
  computed: {
    ...projectMapper.mapState({ pages1: 'pages', notOwnProjectsPages: 'notOwnProjectsPages' }),
    ...userMapper.mapState({ pages0: 'pages', allUsersPages: 'allUsersPages' })
  }
})
export default class ProjectParticipantAllView extends Mixins(AvatarMixin) {
  private isLoading = false
  private dialogApplication = false
  private activeProject = {}
  private activeUser = ''
  private tab = 0
  private activeIsUser = false
  private page0 = 1
  private page1 = 1

  async mounted() {
    await this.getFromRoute()
    await userModule.actions.userGetAll()
    await userModule.actions.userGetAllPages({ page: this.page0 })
    await projectModule.actions.projectGetNotOwnPages({ page: this.page1 })
    if (userModule.state.pages < this.page0) {
      this.page0 = 1
    }
    if (projectModule.state.pages < this.page1) {
      this.page1 = 1
    }
    this.isLoading = true
  }

  private async getFromRoute() {
    this.tab = parseInt(this.$route.query.tab?.toString()) || 0
    this.page0 = parseInt(this.$route.query.page0?.toString()) || 1
    this.page1 = parseInt(this.$route.query.page1?.toString()) || 1
  }

  private changeDialogApplication(val: boolean) {
    this.dialogApplication = val
  }

  private beforeDialog(payload: { user?: string, project?: object }) {
    this.activeIsUser = !!payload.project
    this.activeProject = payload.project || ''
    this.activeUser = payload.user || ''
    this.changeDialogApplication(true)
  }

  @Watch('tab')
  tabChange(newVal: number) {
    this.$router
      .push({ query: { ...this.$route.query, tab: newVal.toString() } })
      .catch(() => ({}))
  }

  @Watch('page0')
  async page0Change(newVal: number) {
    this.isLoading = false
    this.$router
      .push({ query: { ...this.$route.query, page0: newVal.toString() } })
      .catch(() => ({}))
    await userModule.actions.userGetAllPages({ page: this.page0 })
    this.isLoading = true
  }

  @Watch('page1')
  async page1Change(newVal: number) {
    this.isLoading = false
    this.$router
      .push({ query: { ...this.$route.query, page1: newVal.toString() } })
      .catch(() => ({}))
    await projectModule.actions.projectGetNotOwnPages({ page: this.page1 })
    this.isLoading = true
  }

  @Watch('$route', { immediate: true, deep: true })
  async routeChange() {
    await this.getFromRoute()
  }
}
</script>
