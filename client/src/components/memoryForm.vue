<template>
  <v-overlay >
    <v-card
      :loading="loading"
      elevation="2"
      opacity="0"
      light
      class="mx-auto my-12">
      
        <div class="d-flex justify-end"><v-btn icon @click="close()"><v-icon center>mdi-close-circle</v-icon></v-btn></div>
      

      <v-card-title color="primary">Add your story to the curve</v-card-title>
      <v-card-text v-if="status">
        <v-alert
          border="left"
          colored-border
          color="primary"
          elevation="2">
          {{status}}
        </v-alert>
        <v-btn block color="primary" outlined @click="close()">Cool!</v-btn>
      </v-card-text>
      <v-card-text v-else>
       <!-- <p>What did you lorem ipsum sed dolor sit amet?</p>-->
        <v-form>
          <v-text-field
            v-model="name"
            label="Name (optional)"
          ></v-text-field>
          <v-text-field
            v-model="date"
            label="Date"
            readonly
          ></v-text-field>
          <v-textarea
            v-model="memory" 
            label="Your Memory"
          ></v-textarea>
          <v-btn block color="primary" outlined @click="sendMemory">Send</v-btn>
        </v-form>
      </v-card-text>
    <!--<v-date-picker v-model="picker"></v-date-picker>-->
    </v-card>
  </v-overlay>
</template>

<script>
import MemoryService from '@/services/memoryService'
export default {
  data () {
    return {
      memory: 'abc123',
      status: false,
      loading: false,
      name: '',
    }
  },

  props: {
    country: String,
    date: String,
  },

  methods: {
    async sendMemory () {
      this.loading = true

      let payload = {
        comment: this.memory,
        date: new Date(this.date),
        name: this.name,
        country: this.country,
        id: null,
      }      
      try {
        const response = await MemoryService.sendMemory(payload)
        
        if(response) this.loading=false
        if(response.status == 200) {
          this.status = "Your memory has been recorded"
        }

      } catch (err) {
        this.status = err.response.data.error
      }
    },

    close: function() {
      this.status = false
      this.$emit('close')
      console.log(this.status)
    }
  }
}
</script>

<style scoped>
</style>
