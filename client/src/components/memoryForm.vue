<template>
  <div class="form">
    asd
    <input
      v-model="memory"
      class="form-control"
      type="text"
      placeholder="Default input">
    <button
      @click="sendMemory">Send</button>
  </div>
</template>

<script>
import MemorySendService from '@/services/memorySendService'
export default {
  data () {
    return {
      memory: 'abc123'
    }
  },

  /*watch: {
    comment (value) {
      console.log(value)
    }
  }*/

  methods: {
    async sendMemory () {
      const response = await MemorySendService.sendMemory({
        text: this.memory,
        morestuff: "foobar"
      })
      console.log(response)
    }
  }
}
</script>

<style scoped>
</style>
