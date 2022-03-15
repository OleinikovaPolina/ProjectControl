<template>
  <div>
    <BaseLoading v-if="!isLoading" />
    <template v-if="isLoading">
      <v-btn
        color="primary"
        class="mb-5"
        @click="changeDialogApplication(true)"
      >
        Add application
      </v-btn>
      <div v-if="applications.length===0">
        No applications found
      </div>
      <v-expansion-panels multiple>
        <v-expansion-panel
          v-for="application in applications"
          :key="application.id"
          hide-actions
        >
          <v-expansion-panel-header>
            <v-row
              align="center"
              class="spacer"
              no-gutters
            >
              <v-col
                cols="2"
                sm="2"
                md="1"
              >
                <AvatarBase
                  :size="36"
                  :name="application.project.title"
                />
              </v-col>

              <v-col
                cols="8"
                sm="5"
                md="5"
              >
                <span>{{ application.project.title }}</span>
                <span
                  class="grey--text"
                >
                  &nbsp;({{ application.role.name }})
                </span>
              </v-col>

              <v-col
                class="text-no-wrap"
                cols="2"
                sm="5"
              >
                <v-chip
                  v-if="!application.typeUser && application.typeProject"
                  :color="`red lighten-4`"
                  class="ml-0 mr-2 black--text"
                  label
                  small
                >
                  new
                </v-chip>
              </v-col>
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-divider class="pb-3" />
            <span>Leader:</span>
            <router-link
              v-if="application.project.leader"
              class="text-decoration-none"
              style="color: inherit"
              :to="'/profile/'+application.project.leader._id"
              custom
            >
              {{ `${application.project.leader.name} (${application.project.leader.email})` }}
            </router-link>
            <br>
            <span>Description: {{ application.project.short_description }}</span>
            <div
              v-if="application.typeUser && !application.typeProject"
            >
              <v-btn
                color="error"
                small
                outlined
                @click="applicationDelete(application.id)"
              >
                delete
                <v-icon right>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
            <div
              v-if="!application.typeUser && application.typeProject"
            >
              <v-btn
                color="success"
                small
                outlined
                @click="applicationUpdate(application.id,1)"
              >
                accept
                <v-icon right>
                  mdi-check
                </v-icon>
              </v-btn>
              <v-btn
                color="error"
                small
                outlined
                @click="applicationUpdate(application.id,-1)"
              >
                reject
                <v-icon right>
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
            <div
              v-if="application.typeUser && application.typeProject"
            >
              <v-chip
                :color="infoForApplication(application)[0]"
                label
                outlined
                small
                class="text-uppercase"
                style="height: 28px"
              >
                {{ infoForApplication(application)[1] }}
                <v-icon
                  small
                  right
                >
                  mdi-{{ infoForApplication(application)[2] }}
                </v-icon>
              </v-chip>
              <v-btn
                color="orange"
                small
                outlined
                @click="hiddenApplication({id:application.id})"
              >
                Hidden
                <v-icon right>
                  mdi-eye-off
                </v-icon>
              </v-btn>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <DialogApplication
        :is-user="true"
        :dialog="dialogApplication"
        @change-dialog="changeDialogApplication"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import AvatarMixin from '@/mixins/AvatarMixin'
import { applicationMapper, applicationModule } from '@/store'
import { ApplicationInterface } from '@/types'

@Component({
  name: 'ApplicationsUserView',
  components: {
    BaseLoading:()=>import('@/components/Common/BaseLoading.vue'),
    AvatarBase:()=>import('@/components/Common/BaseAvatar.vue'),
    DialogApplication: () => import('@/components/Application/DialogApplication.vue')
  },
  computed: {
    ...applicationMapper.mapState({ applications: 'applicationsUser' })
  }
})
export default class ApplicationsUserView extends Mixins(AvatarMixin) {
  private isLoading = false
  private dialogApplication = false

  async mounted() {
    await applicationModule.actions.applicationUserGet()
    this.isLoading = true
  }

  infoForApplication(application: ApplicationInterface) {
    if (application.typeProject === -1) {
      return ['red', 'Rejected', 'close']
    }
    if (application.typeProject === 1) {
      return ['green', 'Accepted', 'check']
    }
  }

  private changeDialogApplication(val: boolean) {
    this.dialogApplication = val
  }

  async applicationUpdate(id: string, type: number) {
    await applicationModule.actions.applicationUpdate({ id, type })
  }

  async applicationDelete(id: string) {
    await applicationModule.actions.applicationDelete({ id })
  }

  async hiddenApplication(payload: { id: string; }) {
    await applicationModule.actions.applicationHidden(
      {
        req: Object.assign(payload, { hidden: { hiddenUser: true } })
      })
  }
}
</script>