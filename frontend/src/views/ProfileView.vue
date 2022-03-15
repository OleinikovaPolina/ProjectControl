<template>
  <div>
    <BaseLoading v-if="!isLoading" />
    <template v-else>
      <v-card v-if="Object.keys(person).length>0">
        <v-card-title>
          <div class="d-flex align-center">
            <span>{{ person.name }}</span>
            <v-btn
              v-if="isOwn"
              icon
              small
              @click="()=>{changeDialogPerson(true)}"
            >
              <v-icon>mdi-square-edit-outline</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-subtitle>
          {{ person.email }}
        </v-card-subtitle>
        <v-card-text>
          <v-chip-group
            class="pt-0"
          >
            <v-chip
              v-for="skill in person.skills"
              :key="skill.id"
              small
            >
              {{ skill.name }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
        <v-card-text
          class="pt-0"
          v-html="person.bio"
        />
      </v-card>
      <DialogUser
        v-if="isOwn"
        :person-info="person"
        :dialog="dialogPerson"
        @change-dialog="changeDialogPerson"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import AvatarMixin from '@/mixins/AvatarMixin'
import { userMapper, userModule } from '@/store'
import { UserInterface } from '@/types'


@Component({
  name: 'ProjectOwnView',
  components: {
    BaseLoading:()=>import('@/components/Common/BaseLoading.vue'),
    DialogUser: () => import('@/components/User/TheDialogUser.vue')
  },
  computed: userMapper.mapState(['user'])
})
export default class ProjectOwnView extends Mixins(AvatarMixin) {
  private person: UserInterface | object = {}
  private isOwn = false
  private dialogPerson = false
  private isLoading=false

  @Watch('user')
  userChanged(newVal: UserInterface) {
    if (newVal) {
      this.person = newVal
    }
  }

  @Watch('$route.params.id')
  async routeChanged(newVal: string) {
    await this.getPerson(newVal)
  }

  async mounted() {
    await this.getPerson(this.$route.params.id)
    this.isLoading=true
  }

  private changeDialogPerson(newVal: boolean) {
    this.dialogPerson = newVal
  }

  private async getPerson(id: string) {
    if (id.toString() === userModule.state.user.id) {
      this.person = userModule.state.user
      this.isOwn = true
    } else {
      await userModule.actions.userGetOne(
        { id: id.toString() }
      )
      this.person = userModule.state.person
    }
    if(Object.keys(this.person).length===0){
      this.$router.push({ name:'404' }).catch(()=>({}))
    }
  }
}
</script>