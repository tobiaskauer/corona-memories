<template>
  <v-overlay opacity="0">
    <v-card
      elevation="2"
      class="memoryCard"
      min-width="300"
      max-width="500">
      <!--<v-card-title>Share a memory</v-card-title>-->
      
      <v-card-text>
        <span>{{memory.date}}</span>
          <p>{{memory.comment}}</p> 
          <br />   
          <v-btn x-small  @click="close">close</v-btn>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
//import MemoryService from '@/services/memoryService'
export default {
  data () {
    return {
    
    }
  },

  props: {
    memory: Object,
  },

asyncComputed: {
    async reactions() {
      //let reaction = (await caseService.getCases({country: this.currentCountry})).data
      return null
    }
  },

  methods: {
    close: function() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.memoryCard {
  
  background: linear-gradient(116.6deg, #FA5E2D 36.3%, #E63700 69.74%);
}

</style>