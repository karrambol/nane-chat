import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: 'Аноним',
    serverSettings: {
      max_room_title_length: 50,
      max_message_length: 10500,
      max_username_length: 50
    },
    roomList: [],
    currentRoom: undefined,
    messageHistory: undefined,
    socket: undefined,
    messageText: 'asdad'
  },
  getters: {
    roomList (state) {
      return state.roomList
    },
    username (state) {
      return state.username
    },
    currentRoom (state) {
      return state.currentRoom
    },
    messageHistory (state) {
      return state.messageHistory
    },
    maxRoomTitleLength (state) {
      return state.serverSettings.max_room_title_length
    },
    maxMessageLength (state) {
      return state.serverSettings.max_message_length
    },
    maxUsernameLength (state) {
      return state.serverSettings.max_username_length
    }
  },
  mutations: {
    setUsername (state, username) {
      state.username = username
    },
    setServerSettings (state, value) {
      state.serverSettings = value
    },
    setRoomList (state, value) {
      state.roomList = value
    },
    setMessageHistory (state, value) {
      state.messageHistory = value
    },
    pushToMessageHistory (state, value) {
      state.messageHistory = [...state.messageHistory, value]
    },
    setCurrentRoom (state, name) {
      state.currentRoom = name
    },
    setSocket (state, value) {
      state.socket = value
    }
  },
  actions: {
    changeRoom (store, name) {
      store.commit('setCurrentRoom', name)
      store.dispatch('fetchMessageHistory', name)
      store.dispatch('fetchRoomList')
    },
    setUsername (store, username) {
      store.commit('setUsername', username)
      store.dispatch('openSocket')
    },
    createRoom (store, name) {
      store.commit('setCurrentRoom', name)
      store.dispatch('fetchRoomList')
      if (store.state.roomList.filter(el => el.name === name).length === 0) {
        store.state.socket.onmessage = function (message) {
          const data = JSON.parse(message.data)
          if (data.room === store.state.currentRoom) {
            store.dispatch('changeRoom', name)
            store.dispatch('openSocket')
          }
        }
        store.dispatch('sendMessage', { text: 'Создает комнату' })
      } else {
        console.error('already exists')
      }
    },
    joinRoom (store) {},
    fetchServerSettings (store) {
      axios('https://nane.tada.team/api/settings', {
        method: 'GET'
      })
        .then(response => {
          store.commit('setServerSettings', response.data.result)
        })
        .catch(error => {
          console.error(error)
        })
    },
    fetchRoomList (store) {
      axios('https://nane.tada.team/api/rooms', {
        method: 'GET'
      })
        .then(response => {
          this.commit(
            'setRoomList',
            response.data.result.sort(
              (a, b) =>
                new Date(b.last_message.created) -
                new Date(a.last_message.created)
            )
          )
        })
        .catch(error => {
          console.error(error)
        })
    },
    fetchMessageHistory (store) {
      axios(
        `https://nane.tada.team/api/rooms/${store.state.currentRoom}/history`,
        {
          method: 'GET'
        }
      )
        .then(response => {
          this.commit('setMessageHistory', response.data.result)
        })
        .catch(error => {
          console.log(error)
        })
    },
    openSocket (store) {
      const currentSocket = store.state.socket
      const newSocket = new WebSocket(
        `wss://nane.tada.team/ws?username=${store.state.username}`
      )
      newSocket.onopen = data => {
        if (currentSocket) {
          currentSocket.onclose = function () {}
          currentSocket.close()
        }
      }
      newSocket.onerror = function () {
        setInterval(
          store
            .dispatch('openSocket')
            .then(res => store.dispatch('fetchMessageHistory')),
          5000
        )
      }
      newSocket.onmessage = function (message) {
        const data = JSON.parse(message.data)
        store.dispatch('fetchRoomList')
        if (data.room === store.state.currentRoom) {
          store.commit('pushToMessageHistory', JSON.parse(message.data))
        }
      }
      newSocket.onclose = function reconnect () {
        store
          .dispatch('openSocket')
          .then(res => store.dispatch('fetchMessageHistory'))
      }
      store.commit('setSocket', newSocket)
    },
    sendMessage (store, { text, id = undefined }) {
      store.state.socket.send(
        JSON.stringify({
          room: store.state.currentRoom,
          text: text,
          id: id
        })
      )
    }
  },
  modules: {}
})
