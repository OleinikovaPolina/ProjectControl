<template>
  <v-navigation-drawer
    app
    permanent
    expand-on-hover
    mini-variant
  >
    <v-list>
      <v-list-item class="px-2">
        <v-avatar
          color="primary"
          size="38"
        >
          <v-icon dark>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </v-list-item>

      <v-list-item
        link
        :to="'/profile/'+user.id"
      >
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ user.name }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list
      nav
      dense
    >
      <v-list-item
        v-for="item in items"
        :key="item.text"
        link
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>mdi-{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list>
      <v-list-item @click="changeTheme">
        <v-list-item-icon>
          <v-icon>{{ $vuetify.theme.dark ? "mdi-moon-waning-crescent" : "mdi-white-balance-sunny" }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Theme</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { userMapper } from '@/store'
import NavigationMixin from '@/mixins/NavigationMixin'

@Component({
  name: 'TheNavigationComponent',
  computed: userMapper.mapState(['user'])
})
export default class TheNavigationComponent extends Mixins(NavigationMixin) {
}
</script>