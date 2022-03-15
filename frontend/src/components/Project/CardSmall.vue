<template>
  <v-card
    class="mb-3"
    :style="{borderLeft:`25px solid ${ getColor(project.title) }`}"
  >
    <v-card-title>
      <router-link
        class="text-decoration-none"
        style="color: inherit"
        :to="path+project.id"
        custom
      >
        {{ project.title }}
      </router-link>
      <slot name="role" />
    </v-card-title>
    <v-card-text>
      <span>{{ project.short_description }}</span>
      <br>
      <router-link
        v-if="project.leader"
        class="text-decoration-none"
        style="color: inherit"
        :to="'/profile/'+project.leader.id"
        custom
      >
        {{ `${project.leader.name} (${project.leader.email})` }}
      </router-link>
    </v-card-text>
    <div style="position:absolute; right: 0;top: 0">
      <slot name="deletebtn" />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import AvatarMixin from '@/mixins/AvatarMixin'
import { ProjectInterface } from '@/types'

@Component({
  name: 'CardSmall'
})
export default class CardSmall extends Mixins(AvatarMixin) {
  @Prop() project!: ProjectInterface
  @Prop() path!: string
}
</script>