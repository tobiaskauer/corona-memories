<template>
  <div class="form">
    asd
    <input
      v-model="comment"
      class="form-control"
      type="text"
      placeholder="Default input">
    <button
      @click="sendComment">Send</button>
  </div>
</template>

<script>
import CommentSendService from '@/services/commentSendService'
export default {
  data () {
    return {
      comment: 'abc123'
    }
  },

  /*watch: {
    comment (value) {
      console.log(value)
    }
  }*/

  methods: {
    async sendComment () {
      const response = await CommentSendService.sendComment({
        comment: this.comment,
        morestuff: "foobar"
      })
      console.log(response)
    }
  }
}
</script>

<style scoped>
</style>
