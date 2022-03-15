<template>
  <v-card
    class="mx-auto mt-8"
    max-width="500"
  >
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <span>{{ currentTitle[step] }}</span>
      <v-avatar
        color="primary lighten-2"
        class="subheading white--text"
        size="24"
        v-text="step+1"
      />
    </v-card-title>

    <v-window v-model="step">
      <v-window-item :value="0">
        <v-form
          ref="form0"
          @submit.prevent="step++"
        >
          <v-card-text>
            <v-text-field
              v-model="form.login"
              :rules="rules.string"
              label="Login"
              required
              outlined
              dense
              data-form="0"
            />
            <v-text-field
              v-model="form.name"
              :rules="rules.string"
              label="Name"
              required
              outlined
              dense
              data-form="0"
            />
            <v-text-field
              v-model="form.email"
              :rules="rules.string"
              label="Email"
              required
              outlined
              dense
              data-form="0"
            />
            <div>
              Already have an account?
              <router-link
                to="/"
                class="text-decoration-none"
              >
                Sign in
              </router-link>
            </div>
          </v-card-text>
        </v-form>
      </v-window-item>

      <v-window-item :value="1">
        <v-form
          ref="form1"
          @submit.prevent="step++"
        >
          <v-card-text>
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
              data-form="1"
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
              data-form="1"
              :editor-toolbar="customToolbar"
            />
          </v-card-text>
        </v-form>
      </v-window-item>

      <v-window-item :value="2">
        <v-form
          ref="form2"
          @submit.prevent="submit"
        >
          <v-card-text>
            <v-text-field
              v-model="form.pass"
              label="Password"
              :rules="rules.string"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              data-form="2"
              @click:append="showPass = !showPass"
            />
            <v-text-field
              v-model="form.confirm"
              label="Confirm Password"
              :rules="rules.string"
              :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showConfirm ? 'text' : 'password'"
              data-form="2"
              @click:append="showConfirm = !showConfirm"
            />
          </v-card-text>
        </v-form>
      </v-window-item>
    </v-window>

    <v-divider />

    <v-card-actions>
      <v-btn
        :disabled="step === 0"
        text
        @click="step--"
      >
        Back
      </v-btn>
      <v-spacer />
      <v-btn
        text
        @click="resetForm"
      >
        Clear
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="step !== 2"
        :disabled="!formIsValid()"
        color="primary"
        text
        @click="step++"
      >
        Next
      </v-btn>
      <v-btn
        v-if="step === 2"
        :disabled="!formIsValid()"
        color="primary"
        text
        @click="submit"
      >
        Register
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { commonMapper, commonModule, userModule } from '@/store'
import FormMixin from '@/mixins/FormMixin'
import { VueEditor } from 'vue2-editor'

interface FormRegisterInterface {
  login: string;
  email: string;
  name: string
  bio: string;
  skills: Array<string>
  pass: string;
  confirm: string
}

@Component({
  name: 'RegisterView',
  computed: commonMapper.mapState({ skills: 'skills' }),
  components: { VueEditor }
})
export default class RegisterView extends Mixins(FormMixin) {
  private search = ''
  private step = 0
  private showConfirm = false
  private showPass = false
  private currentTitle = ['Introduce yourself', 'Tell about your skills', 'Create a password']
  private defaultForm0 = { login: '', name: '', email: '' }
  private defaultForm1 = { skills: [], bio: '' }
  private defaultForm2 = { pass: '', confirm: '' }
  private form: FormRegisterInterface = Object.assign({},
    this.defaultForm1,
    this.defaultForm2,
    this.defaultForm0
  )

  async mounted() {
    await commonModule.actions.commonGetSkills()
    this.rules.confirm = [
      (val: string) => (val || '').length > 0 || 'This field is required',
      (val: string) => val === this.form.pass || 'Wrong confirm password'
    ]
  }

  private formIsValid() {
    switch (this.step) {
      case 0:
        return this.form.login && this.form.name && this.form.email
      case 1:
        return this.form.bio && this.form.skills.length > 0
      case 2:
        return this.form.pass && this.form.confirm && this.form.pass === this.form.confirm
    }
  }

  private resetForm() {
    let defaultForms = [this.defaultForm0, this.defaultForm1, this.defaultForm2]
    this.form = Object.assign(this.form, defaultForms[this.step])
    switch (this.step) {
      case 0: this.$refs.form0.reset(); break
      case 1: this.$refs.form1.reset(); break
      case 2: this.$refs.form2.reset(); break
    }
  }

  private async submit() {
    await userModule.actions.userRegister(this.form)
    if (userModule.state.user.id) {
      this.$router.push({ name: 'search' }).catch(() => ({}))
    }
  }

  private async addSkill() {
    if (this.search) {
      await commonModule.actions.commonAddSkills({ name: this.search })
      let newSkill = commonModule.state.skills[commonModule.state.skills.length - 1]
      if (newSkill) {
        this.form.skills = this.form.skills.concat([newSkill.id])
        this.search = ''
      }
    }
  }
}
</script>
