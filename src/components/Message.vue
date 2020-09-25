<template>
  <li>
    <h3>{{ sender }}</h3>
    <span>{{ time }}</span>
    <p>{{ text }}</p>
  </li>
</template>
<script>
export default {
  name: 'message',
  props: {
    sender: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: String, required: true }
  },
  computed: {
    time () {
      const date = new Date(this.date)
      return `${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`
    }
  }
}
</script>
<style scoped>
li {
  list-style: none;
  padding-bottom: 7.5px;
}
p {
  word-wrap: break-word;
  -ms-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
  margin: 0;
}
h3 {
  display: inline;
  margin-right: 7.5px;
  word-wrap: break-word;
}
</style>
