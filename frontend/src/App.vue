<template>
  <v-app>
    <div v-if="isAuth">
      <template v-if="$vuetify.breakpoint.xs ||$vuetify.breakpoint.sm">
        <TheAppBarComponent />
        <TheBottomNavigationComponent />
      </template>
      <template v-else>
        <TheNavigationComponent />
      </template>
    </div>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <v-snackbar
      v-model="snackbar"
      :color=" alert.type"
      right
    >
      <v-icon>mdi-{{ alert.type === "error" ? "alert-circle" : "check-circle" }}</v-icon>
      {{ alert.text }}
      <template #action="{ attrs }">
        <v-btn
          icon
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { commonMapper, userMapper } from '@/store'
import { AlertInterface } from '@/types'
import BaseLoading from '@/components/Common/BaseLoading.vue'

@Component({
  name: 'App',
  components: {
    BaseLoading,
    TheAppBarComponent: () => import('@/components/Navigation/TheAppBarComponent.vue'),
    TheBottomNavigationComponent: () => import('@/components/Navigation/TheBottomNavigationComponent.vue'),
    TheNavigationComponent: () => import('@/components/Navigation/TheNavigationComponent.vue')
  },
  computed: {
    ...userMapper.mapState(['isAuth']),
    ...commonMapper.mapState(['alert'])
  }
})
export default class App extends Vue {
  private alert!: AlertInterface
  private snackbar = false
  // private isLoading = false

  // async mounted() {
  //   const idUser: string = localStorage.getItem('user')?.toString() || ''
  //   if (idUser !== '') {
  //     await userModule.actions.userCheck({ id: idUser })
  //   }
  //   this.isLoading = true
  // }

  @Watch('alert')
  nameChanged(newVal: AlertInterface) {
    if (newVal.type) {
      this.snackbar = true
    }
  }
}
</script>