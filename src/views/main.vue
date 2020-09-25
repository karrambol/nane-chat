<template>
  <v-app>
    <v-navigation-drawer
      class="drawer"
      mobile-breakpoint="850"
      v-model="drawerIsOpen"
      app
    >
      <RoomList @drawer-close="drawerUndefined()" @relocate="scrollChat" />
    </v-navigation-drawer>
    <v-app-bar class="top-bar" app>
      <button @click="drawerToggle()"><v-icon>mdi-menu</v-icon></button>
      <h1>{{ currentRoom }}</h1>
    </v-app-bar>
    <v-main>
      <Chat scrollBottom />
    </v-main>
  </v-app>
</template>
<script>
import RoomList from '@/components/RoomList.vue'
import Chat from '@/components/Chat.vue'
export default {
  components: {
    RoomList,
    Chat
  },
  data () {
    return {
      scrollBottom: false,
      drawerIsOpen: undefined
    }
  },
  computed: {
    currentRoom () {
      return this.$store.getters.currentRoom
    },
    messages () {
      return this.$store.getters.messageHistory
    }
  },
  methods: {
    scrollChat () {
      this.scrollBottom = true
      setInterval(() => {
        this.scrollBottom = false
      }, 500)
    },
    drawerToggle () {
      this.drawerIsOpen = !this.drawerIsOpen
    },
    drawerUndefined () {
      this.drawerIsOpen = undefined
    }
  }
}
</script>
<style scoped>
.drawer {
  overflow: hidden;
}
.top-bar {
  vertical-align: sub;
}
h1 {
  position: absolute;
  top: calc(50% - 25px);
  left: 52px;
  white-space: nowrap;
}
</style>
