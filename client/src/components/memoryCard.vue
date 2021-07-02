<template>
  <v-card
    class="memoryCard overflow-y-auto"
    elevation="2"
    v-if="memory"
    :width="width"
  >
    <div>
      <v-btn v-if="display != 'separated'" style="position: absolute; right: 5px; top: 0px;" icon @click="close">
        <v-icon small color="black">mdi-close-circle</v-icon>
      </v-btn>
    </div>
    <v-card-text>
      <v-row dense>      
        <!--<v-col sm v-if="display == 'contextual'">
          <v-btn
              x-small 
              fab
              outlined
              center
              @click="upvote($event)"
              @mouseover="mouseOver(true)"
              @mouseout="mouseOver(false)"
            >
              {{weight}} <br />
              <v-icon color="black" small>mdi-heart</v-icon>
            </v-btn>
        </v-col>-->
        <v-col cols="12">
          <p class="topBar">

            <em v-if="display != 'contextual'"> [anonymous], {{displayDate}}, {{memory.country}}</em>
            <em v-else>{{displayDate}}, {{memory.country}}</em>


            <template v-if="display == 'separated'">
              <div style="position: absolute; right: 5px; top: 5px;">
              <template v-if="!status">
            <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
            <v-btn  v-bind="attrs"
          v-on="on" plain x-small @click="report">
              <v-icon  x-small>mdi-flag</v-icon>
              {{reportText}}
            </v-btn>
                    </template>
                    <span>Click to report hurtful or other problematic submissions.</span>
            </v-tooltip>
          </template>
          <template v-else>
            {{status}}
          </template>
          </div>
            </template>
          </p>

          <p ref="comment" class="comment">{{memory.comment}}</p>  

          



            <template v-if="display != 'separated'">
              <template v-if="!status">
            <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
            <v-btn  v-bind="attrs"
          v-on="on" plain x-small @click="report">
              <v-icon  x-small>mdi-flag</v-icon>
              {{reportText}}
            </v-btn>
                    </template>
                    <span>Click to report hurtful or other problematic submissions.</span>
            </v-tooltip>
          </template>
          <template v-else>
            {{status}}
          </template>
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
        weight: null,
        reportText: "Report",
        reportClickCount: 0,
        liked: false,
 
    }
  },

  props: {
      memory: Object,
      width: Number,
      display: String,
  },

  created() {
      this.weight = this.memory.weight
  },

  mounted() {
   /* this.$nextTick(() => { //wait until consent = true has taken effect and the DOM has rendered all objects
    console.log(this.commentHeight)
      this.$emit("adjustHeight",this.commentHeight+1000)
    })*/
  },

  computed: {
    localMemory: function() {
      if(!this.memory) return null
      return this.memory
    },
    displayDate: function() {
      if(this.display == 'contextual') return this.memory.dateString
      return (this.memory.exactDate) ? this.memory.dateString : this.getRoughDate(this.memory.date)
    }
    /*commentHeight: function() {
      return this.$refs.comment.clientHeight
    }*/
  },

  methods: {
    close: function() {
      InteractionService.sendInteraction({event: 'close', element: this.memory.id})
        this.$store.commit('setActiveMemories',this.memory.id)
    },

    mouseOver: function(enter) {
      if(enter && !this.liked) {
        this.weight = "+1"
      } else {
        this.weight = this.localMemory.weight
      }
    },

    getRoughDate: function(dateString) {
      
      let parsedDate = new Date(dateString)

      let rough = "Late "
      if(parsedDate.getDate() <= 20) rough = "Mid "
      if(parsedDate.getDate() <= 10) rough = "Early "
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parsedDate.getMonth()]
      let year = " "+parsedDate.getFullYear()
      return rough+month+year
    },

    /*async upvote(){
      if(!this.liked) {
        InteractionService.sendInteraction({event: 'upvote', element: this.memory.id})
        try {
          MemoryService.upvoteMemory({id: this.memory.id}).then(response => {
            if(response.status == 200) {
              this.localMemory.weight = response.data.weight
              this.weight = response.data.weight
              this.liked = true
            } 
         })
       } catch(err) {
          console.log(err)
       }
      }
    },*/




    async report() {
      if (this.reportClickCount == 0) {
        this.reportText = "Click again to report this story to the website admin."
        this.reportClickCount++
      } else {
        InteractionService.sendInteraction({event: 'report', element: this.memory.id})
       try {
        MemoryService.flagMemory({id: this.memory.id, flagged: true}).then(response => {
          if(response.status == 200){
            
            this.status = "Thank you. We will not show this story again until we reviewed it."
            
            setTimeout(() => {
              this.close()
          }, 5000)
          } 
        })
      } catch(err) {
        console.log(err)
      }
      }
    }
  }
}
</script>

<style scoped>
  .memoryCard {
    background: linear-gradient(116.6deg, rgba(250, 94, 45, 0.9)  36.3%, rgba(230, 55, 0, 0.9) 69.74%);

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