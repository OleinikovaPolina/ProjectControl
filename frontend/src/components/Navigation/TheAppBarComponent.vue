<template>
  <v-app-bar
    dense
    app
  >
    <v-toolbar-title>Project control</v-toolbar-title>
    <v-spacer />
    <v-menu
      left
      bottom
    >
      <template #activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          dark
          v-on="on"
        >
          <v-avatar
            color="primary"
            size="36"
          >
            <v-icon>
              mdi-account-circle
            </v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list>
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

        <v-list>
          <v-list-item @click="changeTheme">
            <v-list-item-icon>
              <v-icon>
                {{ $vuetify.theme.dark ? "mdi-moon-waning-crescent" : "mdi-white-balance-sunny" }}
              </v-icon>
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
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { userMapper } from '@/store'
import NavigationMixin from '@/mixins/NavigationMixin'

@Component({
  name: 'TheAppBarComponent',
  computed: userMapper.mapState(['user'])
})
export default class TheAppBarComponent extends Mixins(NavigationMixin) {
}
</script>
