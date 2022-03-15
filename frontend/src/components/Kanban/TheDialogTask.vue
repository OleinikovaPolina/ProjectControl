<template>
  <v-dialog
    v-if="task"
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title
        :style="{borderBottom: '3px solid '+ getColor(titles[task.type_task])}"
      >
        <v-sheet
          class="rounded mr-1"
          :color="getColor(titles[task.type_task])"
          width="15"
          height="15"
        />
        <span>{{ task.title }}</span>
        <v-spacer />
        <v-btn
          icon
          @click="changeDialog(false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text
        class="pt-3 pb-1"
        v-html="task.description"
      />
      <v-card-text class="pb-1">
        <v-list-item
          class="pa-0"
        >
          <v-list-item-avatar
            dark
            class="grey lighten-1"
            size="36"
          >
            <v-icon>mdi-clock-outline</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-subtitle v-if="task.createdAt">
              <v-icon small>
                mdi-calendar-arrow-right
              </v-icon>
              <span>{{ $moment(task.createdAt).format("DD.MM.YYYY") }}</span>
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="task.deadline">
              <v-icon small>
                mdi-calendar-alert
              </v-icon>
              <span>{{ $moment(task.deadline).format("DD.MM.YYYY") }}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
      <v-card-title
        v-if="task.participants && task.participants.length>0"
        class="font-weight-regular"
      >
        Participants
      </v-card-title>
      <v-card-text v-if="task.participants && task.participants.length>0">
        <v-list-item
          v-for="participant in task.participants"
          :key="participant.id"
          class="pa-0"
        >
          <v-list-item-avatar>
            <AvatarBase
              size="36"
              :name="participant.participant.name"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              <router-link
                style="color: inherit"
                class="text-decoration-none"
                :to="'/profile/'+participant.participant.id"
              >
                {{ participant.participant.name }}
              </router-link>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ participant.roles.map(x => x.name).join(", ") }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="status"
          text
          @click="deleteTask"
        >
          Delete
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="changeDialog(false)"
        >
          Close
        </v-btn>
        <v-btn
          v-if="status"
          text
          color="blue darken-1"
          @click="changeDialogForm(true)"
        >
          Change
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop } from 'vue-property-decorator'
import { TaskInterface } from '@/types'
import AvatarMixin from '@/mixins/AvatarMixin'
import { taskModule } from '@/store'


@Component({
  name: 'DialogTask',
  components: { AvatarBase:()=>import('@/components/Common/BaseAvatar.vue') }
})
export default class DialogTask extends Mixins(AvatarMixin) {
  @Prop() dialog!: boolean
  @Prop() task!: TaskInterface
  @Prop() titles!: boolean
  @Prop() status!:boolean

  @Emit()
  changeDialog(val: boolean) {
    return val
  }
  @Emit()
  changeDialogForm(val: boolean) {
    return val
  }

  private async deleteTask() {
    await taskModule.actions.taskDelete({id:this.task.id})
    this.changeDialog(false)
  }
}
</script>