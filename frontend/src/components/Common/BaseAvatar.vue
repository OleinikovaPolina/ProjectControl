<template>
  <v-avatar
    :size="size"
    :color="getColor(name)"
  >
    <span
      style="mix-blend-mode: lighten;  color: white;"
      class="font-weight-light"
    >
      {{ initials(name) }}
    </span>
  </v-avatar>
</template>

<script lang="ts">

import { Component, Mixins,Prop } from 'vue-property-decorator'
import AvatarMixin from '../../mixins/AvatarMixin'

@Component({
  name: 'AvatarBase'
})
export default class AvatarBase extends Mixins(AvatarMixin) {
  @Prop() name!: string
  @Prop() size!: number
}
</script>