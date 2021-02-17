<template>
  <div class="form">
    asd
    <input
      v-model="memory"
      class="form-control"
      type="text"
      placeholder="Default input">
      <div v-html="error" />
    <button
      @click="sendMemory">Send</button>
  </div>
</template>

<script>
import MemoryService from '@/services/memoryService'
export default {
  data () {
    return {
      memory: 'abc123',
      error: null
    }
  },

  methods: {
    async sendMemory () {
      try {
        await MemoryService.sendMemory({
          text: this.memory,
          country: "Germany",
          morestuff: "foobar"
        })
      } catch (err) {
        this.error = err.response.data.error
      }
    }
  }
}
</script>

<style scoped>
</style>
