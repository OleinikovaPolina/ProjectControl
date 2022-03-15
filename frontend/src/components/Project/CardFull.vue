<template>
  <v-card v-if="project">
    <div
      :style="{background: getColor(project.title),height:'50px'}"
    />
    <v-card-title>
      <div class="d-flex align-center">
        <span>{{ project.title }}</span>
        <slot name="changeInfo" />
      </div>
    </v-card-title>
    
    <v-card-text v-html="project.description" />

    <v-card-text
      v-if="status"
      class="pt-0"
    >
      <router-link
        :to="'/kanban/'+project.id"
        class="text-decoration-none"
      >
        <v-btn
          small
          color="primary"
        >
          Kanban
        </v-btn>
      </router-link>
    </v-card-text>

    <v-divider />

    <v-card-title>
      <div class="d-flex align-center">
        <span>Roles</span>
        <slot name="changeRoles" />
      </div>
    </v-card-title>
    <v-card-subtitle v-if="roles.length===0">
      There are no roles in the project yet
    </v-card-subtitle>
    <v-list
      v-else
      class="pt-0"
    >
      <v-list-item
        v-for="role in roles"
        :key="role.id"
      >
        <v-list-item-content class="pt-0">
          <v-list-item-title class="text-capitalize">
            {{ role.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-chip-group class="pt-0">
              <v-chip
                v-for="skill in role.skills"
                :key="skill.id"
                small
              >
                {{ skill.name }}
              </v-chip>
            </v-chip-group>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <slot
            name="deleteRole"
            :role="role"
          />
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-card-title>Participants</v-card-title>
    <v-card-subtitle v-if="participants.length===0">
      There are no participants in the project yet
    </v-card-subtitle>
    <v-list
      v-else
      class="pt-0"
    >
      <v-list-item
        v-for="participant in participants"
        :key="participant.id"
      >
        <v-list-item-avatar>
          <AvatarBase
            :size="36"
            :name="participant.participant.name"
          />
        </v-list-item-avatar>

        <v-list-item-content class="pt-0">
          <v-list-item-title>
            <router-link
              class="text-decoration-none"
              style="color: inherit"
              :to="'/profile/'+participant.participant.id"
              custom
            >
              {{ participant.participant.name }}
            </router-link>
          </v-list-item-title>
          <v-list-item-subtitle>{{ participant.roles.map(role => role.name).join(", ") }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action v-if="participant.participant.id!==user.id">
          <slot
            name="deleteParticipant"
            :participant="participant"
          />
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-card-title>
      <div class="d-flex align-center">
        <span>Applications</span>
        <slot name="addApplication" />
      </div>
    </v-card-title>
    <v-card-subtitle v-if="applications.length===0">
      There are no applications in the project yet
    </v-card-subtitle>
    <v-expansion-panels
      v-else
      multiple
    >
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
                :name="application.user.name"
              />
            </v-col>

            <v-col
              cols="8"
              sm="5"
              md="4"
            >
              <span>{{ application.user.name }}</span>
              <span
                class="grey--text"
              >
                &nbsp;({{ application.role.name }})
              </span>
            </v-col>

            <v-col
              class="text-no-wrap"
              cols="2"
              sm="3"
            >
              <v-chip
                v-if="application.typeUser && !application.typeProject"
                :color="`red lighten-4`"
                class="ml-0 mr-2 black--text"
                label
                small
              >
                new
              </v-chip>
            </v-col>

            <v-col
              class="grey--text text-truncate hidden-sm-and-down"
            >
              <span>{{ application.user.email }}</span>
            </v-col>
          </v-row>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-divider class="pb-3" />
          <v-chip-group
            active-class="primary--text"
          >
            <v-chip
              v-for="skill in application.user.skills"
              :key="skill.id"
              small
            >
              {{ skill.name }}
            </v-chip>
          </v-chip-group>
          <div
            v-if="!application.typeUser && application.typeProject"
          >
            <slot
              name="applicationDelete"
              :application="application"
            />
          </div>
          <div
            v-if="application.typeUser && !application.typeProject"
          >
            <slot
              name="applicationUpdateTrue"
              :application="application"
            />
            <slot
              name="applicationUpdateFalse"
              :application="application"
            />
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
            <slot
              name="hiddenApplication"
              :application="application"
            />
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import AvatarMixin from '@/mixins/AvatarMixin'
import { ApplicationInterface, ParticipantInterface, ProjectInterface, RoleInterface } from '@/types'
import { participantModule, userMapper } from '@/store'

@Component({
  name: 'CardFull',
  components: { AvatarBase:()=>import('@/components/Common/BaseAvatar.vue') },
  computed: userMapper.mapState({user:'user'})
})
export default class CardFull extends Mixins(AvatarMixin) {
  @Prop() project!: ProjectInterface
  @Prop() roles!: Array<RoleInterface>
  @Prop() participants!: Array<ParticipantInterface>
  @Prop() applications!: Array<ApplicationInterface>

  infoForApplication(application: ApplicationInterface) {
    if (application.typeProject === -1) {
      return ['red', 'Rejected', 'close']
    }
    if (application.typeProject === 1) {
      return ['green', 'Accepted', 'check']
    }
  }

  get status(): boolean {
    return participantModule.getters.statusOfParticipation
  }
}
</script>