<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>Change project info</span>
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
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { projectModule } from '@/store'
import { VueEditor } from 'vue2-editor'
import FormMixin from '@/mixins/FormMixin'

interface FormInterface {
  id: string;
  title?: string;
  short_description?: string;
  description?: string;
}

@Component({
  name: 'DialogProjectInfo',
  components: { VueEditor }
})
export default class DialogProjectInfo extends Mixins(FormMixin) {
  @Prop() dialog!: boolean
  @Prop() projectInfo!: FormInterface

  private form: FormInterface = { id: '' }

  @Watch('projectInfo')
  nameChanged(newVal: FormInterface) {
    this.form = Object.assign({}, newVal)
  }

  @Emit()
  changeDialog(val: boolean) {
    return val
  }

  private formIsValid() {
    return (
      this.form.title &&
      this.form.short_description &&
      this.form.description
    )
  }

  private resetForm() {
    this.form = Object.assign({}, this.projectInfo)
    if (!this.form.id) {
      this.$refs.form.reset()
    }
  }

  private async submit() {
    if (this.form.id) {
      await projectModule.actions.projectChangeInfo(this.form)
    } else {
      let newForm = {
        title: this.form.title || '',
        short_description: this.form.short_description || '',
        description: this.form.description || ''
      }
      await projectModule.actions.projectCreateOwnProject(newForm)
    }
    this.changeDialog(false)
  }
}
</script>