<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar
          flat
          dark
          color="primary"
        >
          <v-toolbar-title>Change profile</v-toolbar-title>
          <v-btn
            icon
            dark
            @click="changeDialog(false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              text
              :icon="$vuetify.breakpoint.xs ||$vuetify.breakpoint.sm"
              @click="resetForm"
            >
              <v-icon v-if="$vuetify.breakpoint.xs ||$vuetify.breakpoint.sm">
                mdi-restart
              </v-icon>
              <span v-else>REVOKE</span>
            </v-btn>
            <v-btn
              :disabled="!formIsValid()"
              text
              :icon="$vuetify.breakpoint.xs ||$vuetify.breakpoint.sm"
              @click="submit"
            >
              <v-icon v-if="$vuetify.breakpoint.xs ||$vuetify.breakpoint.sm">
                mdi-check
              </v-icon>
              <span v-else>Change</span>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-form
            ref="form"
          >
            <v-text-field
              v-model="form.name"
              :rules="rules.string"
              label="Name"
              required
              outlined
              dense
            />
            <v-text-field
              v-model="form.email"
              :rules="rules.string"
              label="Email"
              required
              outlined
              dense
            />
            <v-autocomplete
              v-model="form.skills"
              :rules="rules.array"
              :items="skills"
              item-value="id"
              item-text="name"
              label="Skills"
              :search-input.sync="search"
              :dense="!($vuetify.breakpoint.xs ||$vuetify.breakpoint.sm)"
              multiple
              outlined
              small-chips
            >
              <template #no-data>
                <v-list-item>
                  No results matching "<strong>{{ search }}</strong>"
                  <v-btn
                    x-small
                    dark
                    @click="addSkill"
                  >
                    add
                  </v-btn>
                </v-list-item>
              </template>
            </v-autocomplete>
            <div class="text--secondary">
              Biography
            </div>
            <VueEditor
              v-model="form.bio"
              :editor-toolbar="customToolbar"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { UserInterface } from '@/types'
import { commonMapper, commonModule, userModule } from '@/store'
import { VueEditor } from 'vue2-editor'
import FormMixin from '@/mixins/FormMixin'

interface FormInterface {
  email: string,
  name: string,
  bio: string,
  skills: Array<string>
}

@Component({
  name: 'DialogUser',
  computed: commonMapper.mapState(['skills']),
  components: { VueEditor }
})
export default class DialogUser extends Mixins(FormMixin) {
  @Prop() dialog!: boolean
  @Prop() personInfo!: UserInterface
  private search = ''
  private form: FormInterface = { email: '', name: '', bio: '', skills: [] }

  async mounted() {
    await commonModule.actions.commonGetSkills()
    this.resetForm()
  }

  @Watch('personInfo')
  personInfoChanged(newVal: UserInterface) {
    if (newVal) {
      this.resetForm()
    }
  }

  @Watch('dialog')
  dialogChanged(newVal: UserInterface) {
    if (newVal) {
      this.resetForm()
    }
  }

  @Emit()
  changeDialog(val: boolean) {
    return val
  }

  private formIsValid() {
    return (
      this.form.name && this.form.email && this.form.bio && this.form.skills?.length !== 0
    )
  }

  private resetForm() {
    this.form = {
      email: this.personInfo.email,
      name: this.personInfo.name,
      bio: this.personInfo.bio,
      skills: this.personInfo.skills.map(x=>x.id)
    }
  }

  private async submit() {
    await userModule.actions.userUpdateProfile(this.form)
    this.changeDialog(false)
  }

  private async addSkill() {
    if (this.search) {
      await commonModule.actions.commonAddSkills({ name: this.search })
      let newSkill = commonModule.state.skills[commonModule.state.skills.length-1]
      if (newSkill) {
        this.form.skills=this.form.skills.concat([newSkill.id])
        this.search=''
      }
    }
  }
}
</script>