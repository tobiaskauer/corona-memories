<template>
    
        <v-card
        class="memoryCard"
      elevation="2"
       v-if="memory"
      :width="dimensions.width"
      :max-height="dimensions.height">
      <div>
          <v-btn style="position: absolute; right: 5px; top: 0px;" icon @click="close">
            <v-icon small color="black">mdi-close-circle</v-icon>
          </v-btn>
        </div>
      <v-card-text style="overflow: scroll">
          <v-row dense>
            
            <v-col class="overflow-y-auto"  style="max-height: 100px;">
              <p style="font-size:.8em; font-family: monospace; margin-bottom: 0">
                <!--<span v-if="memory.author"> {{memory.author}}</span><span v-else><em>anonymous</em></span>,-->
            <v-btn x-small outlined center color="black" @click="upvote($event)" @mouseover="mouseOver(true)" @mouseout="mouseOver(false)">
                {{weight}}<br />
                <v-icon color="black" small>mdi-heart</v-icon>
              </v-btn>
                {{memory.dateString}}
              </p>
            <p color="black">{{memory.comment}}</p>
                
              
              <template v-if="!status">
                <v-btn outlined  small @click="report">
                  <v-icon  x-small>mdi-flag</v-icon>
                  Report
                </v-btn>
              </template>
              <template v-else>
                <v-alert dismissible outlined dense>{{status}}</v-alert>  
              </template>
            </v-col>
          </v-row>
      </v-card-text>
    </v-card>
    
</template>

<script>
import MemoryService from '@/services/memoryService'
export default {
  data () {
    return {
        status: null,
        weight: null
    }
  },

  props: {
      memory: Object,
      dimensions: Object,
  },

  created() {
      this.weight = this.memory.weight
  },

  computed: {

  },

  methods: {
    close: function() {
        this.$store.commit('setActiveMemories',this.memory.id)
    },

    mouseOver: function(enter) {
      if(enter) {
        this.weight = "+1"
      } else {
        this.weight = this.memory.weight
      }
      
    },

    async upvote(){
      try {
        MemoryService.upvoteMemory({id: this.memory.id}).then(response => {
          if(response.status == 200) this.weight = response.data.weight
        })
      } catch(err) {
        console.log(err)
      }
    },

    async report() {
       try {
        MemoryService.flagMemory({id: this.memory.id, flagged: true}).then(response => {
          if(response.status == 200){
            
            this.status = "Thank you. We will not show this story until we reviewed it."
            
            setTimeout(() => {
              this.$emit('delete',{id: this.memory.id})
          }, 2000)
          } 
        })
      } catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
    .memoryCard {
        background: linear-gradient(116.6deg, #FA5E2D 36.3%, #E63700 69.74%);
        
    }
    
</style>