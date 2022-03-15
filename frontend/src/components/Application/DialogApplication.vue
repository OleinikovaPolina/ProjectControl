<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span>Add application</span>
        <v-spacer />
        <v-btn
          icon
          @click="changeDialog(false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-form
        ref="form"
        @submit.prevent="submit"
      >
        <v-card-text>
          <v-autocomplete
            v-if="!isUser"
            id="in1"
            v-model="form.user"
            :rules="rules.array"
            :items="allUsers"
            item-value="id"
            item-text="name"
            label="User"
            outlined
            dense
            :readonly="!!user"
          >
            <template #item="data">
              <v-list-item-content>
                <v-list-item-title>{{ data.item.name }}</v-list-item-title>
                <v-list-item-subtitle style="height: 100%">
                  <v-sheet
                    elevation="10"
                    class="px-1"
                  >
                    <v-chip-group
                      mandatory
                      class="pt-0"
                    >
                      <v-chip
                        v-for="skill in data.item.skills"
                        :key="skill.id"
                        small
                      >
                        {{ skill.name }}
                      </v-chip>
                    </v-chip-group>
                  </v-sheet>
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            id="in2"
            v-model="form.project"
            :rules="rules.array"
            :items="project?[project]:isUser?notOwnProjects: ownProjects"
            item-value="id"
            item-text="title"
            label="Project"
            outlined
            dense
            :readonly="!!project"
          />
          <v-autocomplete
            v-if="(form.project && isUser) || (form.project && form.user) ||tab===1"
            id="in3"
            v-model="form.role"
            :rules="rules.array"
            :items="rolesForApps"
            item-value="id"
            item-text="name"
            label="Role"
            outlined
            dense
            no-data-text="The project has no roles"
          >
            <template #item="data">
              <v-list-item-content>
                <v-list-item-title>{{ data.item.name }}</v-list-item-title>
                <v-list-item-subtitle style="height: 100%">
                  <v-sheet
                    elevation="10"
                    class="px-1"
                  >
                    <v-chip-group
                      mandatory
                      class="pt-0"
                    >
                      <v-chip
                        v-for="skill in data.item.skills"
                        :key="skill.id"
                        small
                      >
                        {{ skill.name }}
                      </v-chip>
                    </v-chip-group>
                  </v-sheet>
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="resetForm"
          >
            Revoke
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="changeDialog(false)"
          >
            Close
          </v-btn>
          <v-btn
            :disabled="!formIsValid()"
            text
            color="primary"
            type="submit"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import {
  applicationModule,
  commonMapper,
  commonModule,
  projectMapper,
  projectModule,
  userMapper,
  userModule
} from '@/store'
import { ProjectInterface } from '@/types'
import FormMixin from '@/mixins/FormMixin'

interface FormInterface {
  user: string;
  project: string;
  role: string;
}

@Component({
  name: 'DialogApplication',
  computed: {
    ...commonMapper.mapState({ rolesForApps: 'rolesForApps' }),
    ...projectMapper.mapState({ notOwnProjects: 'notOwnProjects', ownProjects: 'ownProjects' }),
    ...userMapper.mapState(['allUsers'])
  }
})
export default class DialogApplication extends Mixins(FormMixin) {
  @Prop() dialog!: boolean
  @Prop() isUser!: boolean
  @Prop() project!: ProjectInterface
  @Prop() user!: string
  @Prop() tab!: number

  private defaultForm: FormInterface = {
    project: '',
    role: '',
    user: ''
  }
  private form: FormInterface = Object.assign({}, this.defaultForm)

  async mounted() {
    await projectModule.actions.projectGetNotOwn()
    await projectModule.actions.projectGetOwn()
    await userModule.actions.userGetAll()
    this.resetForm()
  }

  @Emit()
  changeDialog(val: boolean) {
    return val
  }

  @Watch('dialog')
  dialogChanged(newVal: boolean) {
    if (newVal) {
      this.resetForm()
    }
  }

  @Watch('project')
  projectChanged(newVal: ProjectInterface) {
    if (newVal) {
      this.form.project=newVal.id
    }
  }

  @Watch('user')
  userChanged(newVal: string) {
    if (newVal) {
      this.form.user=newVal
    }
  }

  @Watch('form.project')
  async formProjectChanged(newVal: string) {
    if ((newVal && this.isUser) || (newVal && this.form.user)) {
      await this.getRoles({ id: newVal, user: this.form.user })
    }
  }

  @Watch('form.user')
  async userFormChanged(newVal: string) {
    if ((this.form.project && this.isUser) || (this.form.project && newVal)) {
      await this.getRoles({ id: this.form.project, user: newVal })
    }
  }

  async getRoles(payload: { id: string, user?: string }) {
    await commonModule.actions.commonGetRolesForApps(payload)
  }

  private formIsValid() {
    return this.form.role
  }

  private resetForm() {
    this.defaultForm.project = this.project ? this.project.id : ''
    this.defaultForm.user = this.user ? this.user : ''
        this.form = Object.assign({}, this.defaultForm)
    if (this.$refs.form) {
      this.$refs.form.inputs.forEach((input: HTMLFormElement) => {
        if (!input.readonly) {
          input.reset()
        }
      })
    }
  }

  private async submit() {
    if (this.isUser) {
      await applicationModule.actions.applicationAddUser(this.form)
    } else {
      await applicationModule.actions.applicationAddProject(this.form)
    }
    this.changeDialog(false)
  }
}
</script>