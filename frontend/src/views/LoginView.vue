<template>
  <v-card
    class="mx-auto card-shadow mt-8"
    max-width="500"
  >
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <span>Authorization</span>
    </v-card-title>
    <v-form
      ref="form"
      @submit.prevent="submit"
    >
      <v-card-text>
        <v-text-field
          v-model="form.login"
          :rules="rules.string"
          label="Login"
          required
          outlined
          dense
        />
        <v-text-field
          v-model="form.pass"
          :rules="rules.string"
          type="password"
          label="Password"
          required
          outlined
          dense
        />
        <div>
          Don't have an account yet?
          <router-link
            to="/register"
            class="text-decoration-none"
          >
            Register
          </router-link>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          @click="resetForm"
        >
          Clear
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="!formIsValid()"
          text
          color="primary"
          type="submit"
        >
          Sign in
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { userModule } from '@/store'
import FormMixin from '@/mixins/FormMixin'

interface FormLoginInterface {
  login: string;
  pass: string
}

@Component({
  name: 'LoginView'
})
export default class LoginView extends Mixins(FormMixin) {
  private defaultForm: FormLoginInterface = { login: '', pass: '' }
  private form: FormLoginInterface = Object.assign({}, this.defaultForm)

  private formIsValid() {
    return (
      this.form.login &&
      this.form.pass
    )
  }

  private resetForm() {
    this.form = Object.assign({}, this.defaultForm)
    this.$refs.form.reset()
  }

  private async submit() {
    await userModule.actions.userLogin(this.form)
    if (userModule.state.user.id) {
      this.$router.push({ name: 'search' }).catch(() => ({}))
    }
  }
}
</script>