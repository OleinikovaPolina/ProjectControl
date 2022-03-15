<template>
  <v-bottom-navigation app>
    <v-btn
      v-for="item in items"
      :key="item.text"
      link
      :to="item.link"
    >
      <v-icon>mdi-{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import NavigationMixin from '@/mixins/NavigationMixin'

@Component({
  name: 'TheBottomNavigationComponent'
})
export default class TheBottomNavigationComponent extends Mixins(NavigationMixin) {}
</script>