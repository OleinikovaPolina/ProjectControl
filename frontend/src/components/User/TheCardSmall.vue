<template>
  <v-card
    class="mb-3"
    :style="{borderLeft:`25px solid ${ getColor(user.name) }`}"
  >
    <v-card-title class="pb-0">
      <router-link
        class="text-decoration-none"
        style="color: inherit"
        :to="'/profile/'+user.id"
        custom
      >
        {{ user.name }}
      </router-link>
      <slot name="role" />
    </v-card-title>
    <v-card-text>
      <span>{{ user.email }}</span>
      <v-chip-group class="pt-0">
        <v-chip
          v-for="skill in user.skills"
          :key="skill.id"
          small
        >
          {{ skill.name }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <div style="position:absolute; right: 0;top: 0">
      <slot name="deletebtn" />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import AvatarMixin from '@/mixins/AvatarMixin'
import { UserInterface } from '@/types'

@Component({
  name: 'CardSmall'
})
export default class CardSmall extends Mixins(AvatarMixin) {
  @Prop() user!: UserInterface
}
</script>