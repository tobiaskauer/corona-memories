<template>
  <v-container fluid class="container">
    <v-row dense align="center" justify="center">
      <v-col style="text-align: right">
        <v-btn icon @click="$emit('previous')">
          <v-icon color="white" center>mdi-arrow-left-circle</v-icon>
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
            <v-icon center color="white" small>mdi-close-circle</v-icon>
          </v-btn>
        </div>
      <v-card-text>
        
          <v-row dense align="center">
            <v-col class="col-auto" style="margin-right: 20px;">
              <v-btn fab outlined center color="white" @click="upvote">
                <strong>{{weight}}</strong><br />
                <v-icon small>mdi-heart</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <p style="font-size:.8em; font-family: monospace; margin-bottom: 0">
                <span v-if="memory.author"> {{memory.author}}</span><span v-else><em>{{anonymous}}</em></span>,
                {{memory.date}}
              </p>
              <p>{{memory.comment}}</p>
            </v-col>
          </v-row>
      </v-card-text>
    </v-card>
      </v-col>
      <v-col>
        <v-btn icon @click="$emit('next')">
          <v-icon color="white" center>mdi-arrow-right-circle</v-icon>
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
      weight: null
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

  methods: {
    close: function() {
      this.$emit('close')
    },

    async upvote(){
      try {
        MemoryService.upvoteMemory({id: this.memory.id}).then(response => {
          this.weight = response.data.weight
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