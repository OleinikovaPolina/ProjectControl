<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title class="text-h6 font-weight-regular justify-space-between">
          <span>{{ form.id ? "Change" : "Create" }} task</span>
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
            <v-text-field
              v-model="form.title"
              :rules="rules.string"
              label="Title"
              required
              outlined
              dense
            />
            <v-text-field
              v-model="form.short_description"
              :rules="rules.string"
              label="Short description"
              required
              outlined
              dense
            />
            <v-autocomplete
              v-model="form.participants"
              :rules="rules.array"
              :items="participants"
              item-value="id"
              item-text="participant.name"
              label="Participants"
              outlined
              :dense="!($vuetify.breakpoint.xs ||$vuetify.breakpoint.sm)"
              small-chips
              multiple
              no-data-text="The project has no participants"
            >
              <template #item="data">
                <v-list-item-content>
                  <v-list-item-title>{{ data.item.participant.name }}</v-list-item-title>
                  <v-list-item-subtitle style="height: 100%">
                    {{ data.item.roles.map(x => x.name).join(", ") }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-checkbox
              v-model="checkbox"
              class="my-0"
              label="Deadline"
              :hide-details="!!form.deadline && checkbox"
              @click="checkboxChanged"
            />
            <div
              v-if="checkbox&&form.deadline"
              class="mb-3 mt-1 d-flex align-center"
            >
              <div
                class="text-subtitle-1"
              >
                {{ $moment(form.deadline).format("DD.MM.YYYY") }}
              </div>
              <v-btn
                icon
                @click="dialog2=true"
              >
                <v-icon>mdi-square-edit-outline</v-icon>
              </v-btn>
            </div>
            <div class="text--secondary">
              Description
            </div>
            <VueEditor
              v-model="form.description"
              :editor-toolbar="customToolbar"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="resetForm"
            >
              {{ form.id ? "Revoke" : "Clear" }}
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
              {{ form.id ? "Change" : "Add" }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      max-width="300px"
    >
      <v-date-picker
        v-if="checkbox"
        v-model="form.deadline"
        :min="task&&task.id?
          ($moment(task.deadline).format('YYYY-MM-DD')):
          ($moment().format('YYYY-MM-DD')) "
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { VueEditor } from 'vue2-editor'
import { participantMapper, participantModule, taskModule } from '@/store'
import { TaskInterface } from '@/types'
import FormMixin from '@/mixins/FormMixin'

interface FormInterface {
  id?: string;
  project: string;
  title?: string;
  short_description?: string;
  description?: string;
  participants?: Array<string>;
  deadline?: Date | string;
}


@Component({
  name: 'DialogTaskForm',
  components: { VueEditor },
  computed: {
    ...participantMapper.mapState({ participants: 'participants' })
  }
})
export default class DialogTaskForm extends Mixins(FormMixin) {
  @Prop() dialog!: boolean
  @Prop() task!: TaskInterface

  private dialog2 = false
  private checkbox = false
  private defaultForm: FormInterface = {
    project: this.$route.params.id.toString(),
    title: '',
    short_description: '',
    description: '',
    participants: []
  }
  private form: FormInterface = Object.assign({}, this.defaultForm)

  async mounted() {
    await participantModule.actions.participantGetForProject({ id: this.form.project })
  }

  private checkboxChanged() {
    if (this.checkbox) {
      this.dialog2 = true
    } else {
      this.form.deadline = undefined
    }
  }

  @Watch('dialog')
  dialogChanged(newVal: boolean) {
    if (newVal) {
      this.resetForm()
    }
  }

  @Watch('dialog2')
  dialog2Changed(newVal: boolean) {
    if (!newVal && !this.form.deadline) {
      this.checkbox = false
    }
  }

  @Emit()
  changeDialog(val: boolean) {
    return val
  }

  @Emit()
  changeTask(val: TaskInterface) {
    return val
  }

  private formIsValid() {
    return (
      this.form.title &&
      this.form.short_description &&
      this.form.description &&
      this.form.participants &&
      this.form.participants.length > 0
    )
  }

  private resetForm() {
    if (this.task) {
      this.form = {
        id: this.task.id,
        project: this.$route.params.id.toString(),
        title: this.task.title,
        short_description: this.task.short_description,
        description: this.task.description,
        participants: this.task.participants?.map(x => x.id),
        deadline: this.$moment(this.task.deadline).format('YYYY-MM-DD')
      }
      if (this.task.deadline) {
        this.checkbox = true
      }
    } else {
      this.form = Object.assign({}, this.defaultForm)
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
    }
  }

  private async submit() {
    if (!this.form.id) {
      await taskModule.actions.taskCreate(this.form)
    } else {
      await taskModule.actions.taskChange({ data: this.form, project: this.$route.params.id })
      this.changeTask(this.task)
    }
    this.changeDialog(false)
  }
}
</script>