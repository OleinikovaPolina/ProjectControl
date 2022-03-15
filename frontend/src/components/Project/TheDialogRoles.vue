<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <div class="d-flex align-center">
          <span>Change roles</span>
          <v-btn
            icon
            small
            @click="addRole"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-form
        ref="form"
        @submit.prevent="submit"
      >
        <v-card-text
          v-for="(formRule,i) in form.roles"
          :key="formRule.id"
        >
          <v-text-field
            v-model="formRule.name"
            :rules="rules.string"
            label="Title"
            required
            outlined
            dense
          >
            <template #append-outer>
              <v-slide-x-reverse-transition
                mode="out-in"
              >
                <v-icon
                  :key="`icon-${formRule.id}`"
                  @click="deleteRole(i)"
                >
                  mdi-close
                </v-icon>
              </v-slide-x-reverse-transition>
            </template>
          </v-text-field>
          <v-autocomplete
            v-model="formRule.skills"
            :rules="rules.array"
            :items="skills"
            item-value="id"
            item-text="name"
            label="Skills"
            :dense="!($vuetify.breakpoint.xs ||$vuetify.breakpoint.sm)"
            multiple
            outlined
            small-chips
          />
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
            Change
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { commonMapper, commonModule } from '@/store'
import FormMixin from '@/mixins/FormMixin'
import { RoleInterface, SkillInterface } from '@/types'

interface Role {
  id?: string;
  name:string
  skills: Array<SkillInterface|string>
}
interface Form2Interface {
  id: string;
  roles?: Array<Role>
}
interface FormInterface {
  id: string;
  roles?: Array<RoleInterface>
}

@Component({
  name: 'DialogProjectInfo',
  computed: commonMapper.mapState(['skills'])
})
export default class DialogProjectInfo extends Mixins(FormMixin) {
  @Prop() dialog!: boolean
  @Prop() projectRoles!: FormInterface

  private form: FormInterface = { id: '' }

  async mounted() {
    await commonModule.actions.commonGetSkills()
  }

  @Emit()
  changeDialog(val: boolean) {
    return val
  }

  @Watch('dialog')
  nameChanged(newVal: boolean) {
    if (newVal) {
      this.resetForm()
    }
  }

  private addRole() {
    this.form.roles?.push({name:'',skills:[]})
  }

  private deleteRole(i: number) {
    this.form.roles?.splice(i, 1)
  }

  private formIsValid() {
    const k = this.form.roles?.filter(role => !role.name || !role.skills || role.skills?.length === 0 || role.name?.length === 0) || []
    return k.length === 0
  }

  private resetForm() {
    this.form = { id: this.projectRoles.id, roles: [] }
    this.projectRoles.roles?.forEach(x => {
      this.form.roles?.push(Object.assign({}, x))
    })
  }

  private async submit() {
    let newForm:Form2Interface={id:this.form.id,roles:[]}
    this.form.roles?.forEach(x => {
      if (typeof x.skills[0] === 'string') {
        newForm.roles?.push(Object.assign({},x))
        }else{
        newForm.roles?.push(Object.assign({}, { id: x.id,name:x.name, skills: x.skills.map(y => y.id) }))
      }
    })
    await commonModule.actions.commonUpdateRoles(newForm)
    this.changeDialog(false)
  }
}
</script>