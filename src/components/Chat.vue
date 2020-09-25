<template>
  <div class="wrapper">
    <div
      class="chat"
      v-chat-scroll="{
        always: scrollBottom,
        smooth: true,
        notSmoothOnInit: true
      }"
    >
      <ul>
        <Message
          v-for="message in messages"
          :key="message.id"
          :sender="message.sender.username"
          :text="message.text"
          :date="message.created"
        />
      </ul>
    </div>
    <div class="chat-form">
      <v-text-field
        class="chat-form__input"
        v-model="message"
        placeholder="message"
        :rules="[rules.max]"
      ></v-text-field>
      <v-btn color="primary" class="chat-form__button" @click="send"
        >Send</v-btn
      >
    </div>
  </div>
</template>
<script>
import Message from '@/components/Message.vue'
export default {
  components: {
    Message
  },
  props: {
    scrollBottom: { type: Boolean, default: false }
  },
  data () {
    return {
      message: '',
      rules: {
        max: value =>
          value.length <= this.maxMessageLength ||
          `Max ${this.maxMessageLength} symbols`
      }
    }
  },
  computed: {
    messages () {
      return this.$store.getters.messageHistory
    },
    maxMessageLength () {
      return this.$store.getters.maxMessageLength || 10500
    },
    messageLengthInvalid () {
      return this.message.length > this.maxMessageLength
    }
  },
  methods: {
    send () {
      if (!this.messageLengthInvalid) {
        this.$store.dispatch('sendMessage', { text: this.message })
        this.message = ''
      }
    }
  }
}
</script>
<style scoped>
.wrapper {
  height: 100%;
  position: relative;
  overflow: hidden;
}
.chat-form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  padding: 7.5px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}
.chat-form__input {
  width: calc(100% - 100px);
  display: inline-block;
}
.chat-form__button {
  display: inline-block;
  margin-left: 20px;
}
.chat {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 80px;
  padding: 7.5px;
  overflow-y: auto;
}
</style>
