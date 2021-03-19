<template>
  <v-container fluid class="container">
    <v-row dense justify="center">
      <v-col style="text-align: right">
        <v-btn icon @click="$emit('previous')">
          <v-icon color="lightgrey" center>mdi-chevron-left-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <v-card
      id="memoryCard"
      elevation="2"
      min-width="300"
      max-width="500">
      <div>
          <v-btn style="position: absolute; right: 5px; top: 0px;" icon @click="close">
            <v-icon center color="lightgrey" small>mdi-close-circle</v-icon>
          </v-btn>
        </div>
      <v-card-text>
        
          <v-row dense>
            <v-col class="col-auto" style="text-align: center">
              <v-btn fab outlined center color="black" @click="upvote($event)" @mouseover="mouseOver(true)" @mouseout="mouseOver(false)">
                <strong>{{weight}}</strong><br />
                <v-icon color="black" small>mdi-heart</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <p style="font-size:.8em; font-family: monospace; margin-bottom: 0">
                <span v-if="memory.author"> {{memory.author}}</span><span v-else><em>anonymous</em></span>,
                {{displayDate}}
              </p>
              <p>{{memory.comment}}</p>
              <template v-if="!status">
                <v-btn outlined color="rgba(0,0,0,.6)" small @click="report">
                  <v-icon color="rgba(0,0,0,.6)" x-small>mdi-flag</v-icon>
                  Report
                </v-btn>
              </template>
              <template v-else>
                <v-alert dismissible outlined color="rgba(0,0,0,.6)" type="info" dense>{{status}}</v-alert>  
              </template>
            </v-col>
          </v-row>
      </v-card-text>
    </v-card>
      </v-col>
      <v-col>
        <v-btn icon @click="$emit('next')">
          <v-icon color="lightgrey" center>mdi-chevron-right-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
    
</template>

<script>
import MemoryService from '@/services/memoryService'
export default {
  data () {
    return {
      weight: null,
      status: null,
    }
  },

  props: {
    memory: Object,
  },

/*asyncComputed: {
    async reactions() {
      //let reaction = (await caseService.getCases({country: this.currentCountry})).data
      return null
    }
  },*/

  created() {
    this.weight = this.memory.weight
  },

  computed: {
    displayDate: function() {
      if(!this.memory.date) return null
      if(this.memory.exactDate) {
        return this.memory.date
      } else {
        let parsedDate = new Date(this.memory.date)

        let rough = "Late"
        if(parsedDate.getDate() <= 20) rough = "Mid"
        if(parsedDate.getDate() <= 10) rough = "Early"
        let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parsedDate.getMonth()]
        
        return rough+" "+month
      }
    }
  },

  methods: {
    close: function() {
      this.$emit('close')
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

.container {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%)
}

#memoryCard {
  background: linear-gradient(116.6deg, #FA5E2D 36.3%, #E63700 69.74%);
}


.fade-in-enter-active {
  transition: opacity 300ms cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.fade-in-leave-active {
  transition: opacity 225ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-in-enter,
.fade-in-leave-to {
  opacity: 0;
}

</style>