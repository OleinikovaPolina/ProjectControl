<template>
  <div>
    <BaseLoading v-if="!isLoading" />
    <template v-if="isLoading">
      <v-btn
        v-if="statusProject.leader"
        class="primary mb-3"
        @click="()=>{activeTask=null;changeDialogTaskForm(true)}"
      >
        Create new task
      </v-btn>
      <v-sheet
        class="mx-auto"
        elevation="8"
      >
        <v-slide-group
          class="pa-4"
          active-class="success"
          :show-arrows="!($vuetify.breakpoint.xs ||$vuetify.breakpoint.sm)"
        >
          <v-slide-item
            v-for="n in 5"
            :key="n"
          >
            <v-card
              v-if="tasks[n-1] && tasks[n-1].length>0"
              class="ma-3"
              min-width="150"
              outlined
              :max-width="$vuetify.breakpoint.xs?'80vw':$vuetify.breakpoint.sm?'40vw':'20vw'"
            >
              <v-card-title
                class="py-1"
                :style="{borderBottom: '3px solid '+getColor(titles[n-1])}"
              >
                <v-sheet
                  class="rounded mr-1"
                  :color="getColor(titles[n-1])"
                  width="15"
                  height="15"
                />
                <span>{{ titles[n - 1] }}</span>
              </v-card-title>
              <v-card
                v-for="task in tasks[n-1]"
                :key="task.id"
                tile
                outlined
              >
                <v-card-title
                  style="height: 42px"
                  class="py-1 text-subtitle-1 font-weight-medium"
                >
                  <span
                    class="d-inline-block text-truncate"
                    style="max-width: calc(100% - 20px); cursor: pointer"
                    @click="forDialogTask(task)"
                  > {{ task.title }}</span>
                  <v-spacer />
                  <v-btn
                    v-if="task.type_task!==4 && status(task)"
                    icon
                    x-small
                    @click="changeTaskType(task.id,task.type_task+1)"
                  >
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text
                  class="pb-0"
                  style="line-height: normal"
                >
                  {{ task.short_description }}
                </v-card-text>
                <v-card-actions
                  class="pl-3"
                >
                  <v-icon
                    v-if="isFire(task)"
                    small
                    color="error"
                  >
                    mdi-fire
                  </v-icon>
                  <v-spacer />
                  <v-tooltip
                    v-for="participant in task.participants"
                    :key="participant.id"
                    bottom
                  >
                    <template #activator="{ on, attrs }">
                      <router-link
                        style="color: inherit"
                        class="text-decoration-none ml-1"
                        :to="'/profile/'+participant.participant.id"
                      >
                        <div
                          v-bind="attrs"
                          v-on="on"
                        >
                          <AvatarBase
                            :size="30"
                            :name="participant.participant.name"
                          />
                        </div>
                      </router-link>
                    </template>
                    {{ participant.participant.name }}
                    <br>
                    {{ participant.roles.map(x => x.name).join(", ") }}
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-card>
            <v-card
              v-else
              class="ma-3"
              outlined
            >
              <v-card-title
                style="height: 42px"
                class="py-1 "
                :style="{borderBottom: '3px solid '+getColor(titles[n-1])}"
              >
                <v-sheet
                  class="rounded"
                  :color="getColor(titles[n-1])"
                  width="15"
                  height="15"
                />
              </v-card-title>
              <v-card-title
                class="px-2"
                style="writing-mode: vertical-rl;"
              >
                {{ titles[n - 1] }}
              </v-card-title>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
      <DialogTask
        :dialog="dialogTask"
        :task="activeTask"
        :titles="titles"
        :status="activeStatus"
        @change-dialog="changeDialogTask"
        @change-dialog-form="changeDialogTaskForm"
      />
      <DialogTaskForm
        :dialog="dialogTaskForm"
        :task="activeTask"
        @change-dialog="changeDialogTaskForm"
        @change-task="changeActiveTask"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { projectMapper, projectModule, taskMapper, taskModule, userModule } from '@/store'
import AvatarMixin from '@/mixins/AvatarMixin'
import { ObjectTasksInterface, TaskInterface } from '@/types'

@Component({
  name: 'KanbanView',
  components: {
    BaseLoading:()=>import('@/components/Common/BaseLoading.vue'),
    AvatarBase: () => import('@/components/Common/BaseAvatar.vue'),
    DialogTask: () => import('@/components/Kanban/TheDialogTask.vue'),
    DialogTaskForm: () => import('@/components/Kanban/TheDialogTaskForm.vue')
  },
  computed: {
    ...taskMapper.mapState(['tasks']),
    ...projectMapper.mapState({ statusProject: 'status' })
  }
})
export default class KanbanView extends Mixins(AvatarMixin) {
  private isLoading = false
  private tasks!: ObjectTasksInterface
  private titles = ['To Do', 'Research', 'In Progress', 'Review', 'Completed']
  private dialogTask = false
  private dialogTaskForm = false
  private activeTask: TaskInterface | object = {}
  private activeStatus = false

  async mounted() {
    await taskModule.actions.taskGetForProject({ id: this.$route.params.id?.toString() })
    await projectModule.actions.projectStatus({ id: this.$route.params.id?.toString() })
    if (!projectModule.state.status.leader&&!projectModule.state.status.participant){
      this.$router.push({ name:'404' }).catch(()=>({}))
    }
    this.isLoading = true
  }

  private changeDialogTask(val: boolean) {
    this.dialogTask = val
  }

  private changeDialogTaskForm(val: boolean) {
    this.dialogTaskForm = val
  }

  private changeActiveTask(val: TaskInterface) {
    for (const key in taskModule.state.tasks) {
      for (const arg of taskModule.state.tasks[key]) {
        if (arg.id === val.id) {
          this.activeTask = arg
        }
      }
    }
  }

  private forDialogTask(task: TaskInterface) {
    this.activeTask = task
    this.activeStatus = this.status(task)
    this.changeDialogTask(true)
  }

  private status(task: TaskInterface): boolean {
    if (task.project.leader === userModule.state.user.id) {
      return true
    }
    let res = task.participants.filter(x => x.participant.id === userModule.state.user.id)
    return res.length > 0
  }

  isFire(task: TaskInterface): boolean {
    if (task.type_task === 4) {
      return false
    }
    const deadlineTask = new Date(task.deadline)
    const now = new Date()
    return deadlineTask < now
  }

  private async changeTaskType(id: string, type: number) {
    await taskModule.actions.taskChange({
      data: { id: id, type_task: type },
      project: this.$route.params.id || ''
    })
  }
}
</script>