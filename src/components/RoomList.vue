<template>
  <div>
    <div class="room-list__form">
      <v-text-field
        label="new room"
        outlined
        class="room-list__input"
        v-model="newRoomName"
        :rules="[rules.maxRoom, rules.exists]"
      >
        <v-btn
          slot="append"
          small
          outlined
          class="room-list__button"
          @click="createRoom()"
          >Create</v-btn
        >
      </v-text-field>
    </div>
    <ul class="unpadded room-list__list">
      <li v-for="room in rooms" :key="room.id" @click="changeRoom(room.name)">
        <h3>{{ room.name }}</h3>
        <p>
          {{
            (room.last_message.sender.username + ': ' + room.last_message.text)
              .length > 30
              ? (
                  room.last_message.sender.username +
                  ': ' +
                  room.last_message.text
                ).substr(0, 30) + '...'
              : room.last_message.sender.username +
                ': ' +
                room.last_message.text
          }}
        </p>
      </li>
    </ul>
    <div class="room-list__user-form">
      <v-text-field
        label="username"
        outlined
        class="room-list__input"
        v-model="username"
        :rules="[rules.maxUsername]"
        ><v-btn
          small
          slot="append"
          outlined
          class="room-list__button"
          @click="setUsername()"
          >Change</v-btn
        ></v-text-field
      >
    </div>
  </div>
</template>
<script>
export default {
  name: 'RoomList',
  async created () {
    this.$store.dispatch('fetchServerSettings')
    this.$store.dispatch('fetchRoomList')
    this.$store.dispatch('openSocket')
    this.username = this.$store.getters.username
  },
  data () {
    return {
      newRoomName: '',
      username: '',
      rules: {
        maxUsername: value =>
          value.length <= this.maxUsernameLength ||
          `Max ${this.maxUsernameLength} symbols`,
        maxRoom: value =>
          value.length <= this.maxRoomTitleLength ||
          `Max ${this.maxRoomTitleLength} symbols`,
        exists: value =>
          this.rooms.filter(el => el.name === value).length === 0 ||
          'already exists'
      }
    }
  },
  computed: {
    rooms () {
      return this.$store.getters.roomList
    },
    maxUsernameLength () {
      return this.$store.getters.maxUsernameLength || 50
    },
    maxRoomTitleLength () {
      return this.$store.getters.maxRoomTitleLength || 50
    },
    usernameInvalid () {
      return this.username.length > this.maxUsernameLength
    },
    newRoomNameInvalid () {
      return this.newRoomName.length > this.maxRoomTitleLength
    }
  },
  methods: {
    changeRoom (name) {
      this.$store.dispatch('changeRoom', name)
      this.$emit('drawer-close')
      this.$emit('relocate')
    },
    createRoom () {
      if (!this.newRoomNameInvalid) {
        this.$store.dispatch('createRoom', this.newRoomName)
        this.$emit('relocate')
      }
    },
    setUsername () {
      if (!this.usernameInvalid) {
        this.$store.dispatch('setUsername', this.username)
      }
    }
  }
}
</script>
<style scoped>
ul.unpadded {
  padding: 0;
}
li {
  padding: 0 10px;
  list-style: none;
}
li:nth-child(odd) {
  background-color: rgba(238, 238, 238, 0.473);
}
li:hover {
  cursor: pointer;
  background-color: #1976d25e;
}
li p {
  font-size: 14px;
  margin: 0;
}
.room-list__form {
  background-color: #fff;
  padding: 16px 10px 0 10px;
}
.room-list__list {
  position: absolute;
  max-height: calc(100% - 200px);
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.room-list__user-form {
  position: absolute;
  padding: 0 10px;
  bottom: 0;
}
</style>
