<template>
  <v-card
    class="memoryCard overflow-y-auto"
    elevation="2"
    v-if="memory"
    :width="width"
    :max-height="height"
  >
    <div>
      <v-btn style="position: absolute; right: 5px; top: 0px;" icon @click="close">
        <v-icon small color="black">mdi-close-circle</v-icon>
      </v-btn>
    </div>
    <v-card-text>
      <v-row dense>      
        <v-col>
          <p class="topBar">
            <v-btn
              x-small 
              fab
              outlined
              center
              @click="upvote($event)"
              @mouseover="mouseOver(true)"
              @mouseout="mouseOver(false)"
            >
              {{weight}}<br />
              <v-icon color="black" small>mdi-heart</v-icon>
            </v-btn>
            
            {{memory.dateString}}
          </p>

          <p ref="comment" class="comment">{{memory.comment}}</p>  
            

          
          <template v-if="!status">
            <v-btn outlined  x-small @click="report">
              <v-icon  x-small>mdi-flag</v-icon>
              Report
            </v-btn>
          </template>
          <template v-else>
            {{status}}
          </template>
          </v-col>
      </v-row>
    </v-card-text>
  </v-card>  
</template>

<script>
import MemoryService from '@/services/memoryService'
import InteractionService from '@/services/interactionService'

export default {
  data () {
    return {
        status: null,
        weight: null
    }
  },

  props: {
      memory: Object,
      width: Number,
      height: Number,
  },

  created() {
      this.weight = this.memory.weight
  },

  mounted() {
    this.$nextTick(() => { //wait until consent = true has taken effect and the DOM has rendered all objects
      console.log(this.commentHeight)
    })
  },

  computed: {
    localMemory: function() {
      if(!this.memory) return null
      return this.memory
    },
    commentHeight: function() {
      return this.$refs.comment.clientHeight
    }
  },

  methods: {
    close: function() {
      InteractionService.sendInteraction({session: this.$store.state.session, event: 'close', element: this.memory.id})
        this.$store.commit('setActiveMemories',this.memory.id)
    },

    mouseOver: function(enter) {
      if(enter) {
        this.weight = "+1"
      } else {
        this.weight = this.localMemory.weight
      }
      
    },

    async upvote(){
      InteractionService.sendInteraction({session: this.$store.state.session, event: 'upvote', element: this.memory.id})
      try {
        MemoryService.upvoteMemory({id: this.memory.id}).then(response => {
          if(response.status == 200) this.localMemory.weight = response.data.weight
        })
      } catch(err) {
        console.log(err)
      }
    },

    async report() {
      InteractionService.sendInteraction({session: this.$store.state.session, event: 'report', element: this.memory.id})
       try {
        MemoryService.flagMemory({id: this.memory.id, flagged: true}).then(response => {
          if(response.status == 200){
            
            this.status = "Thank you. We will not show this story until we reviewed it."
            
            setTimeout(() => {
              this.close()
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

  .memoryCard p.topBar {
    font-size:.8em;
    font-family: monospace;
    margin-bottom: 0
  }

  .memoryCArd p.comment {
      color: black;
    }

    ::-webkit-scrollbar {
    width: 0px;
}
    
</style>