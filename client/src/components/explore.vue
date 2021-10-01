<template>
    <div>
          <div v-if="display == 'list'">
            <v-btn block color="primary" elevation="2"  @click="$emit('toggleForm')">
            <v-icon style="margin-right: 5px">mdi-tooltip-plus-outline</v-icon>Add your story
          </v-btn>
          <p style="margin-top: 20px;"><strong>Select countries or hashtags to filter memories.</strong></p>
          </div>

          <p v-else-if="display == 'embedded'"><strong>Click the bubbles to read people’s stories.</strong><br />Select countries or hashtags to filter.</p>
          <p v-else>Select a country to see measures and responses.</p>
          
          <v-autocomplete
            :items="countries"
            v-model="currentCountry"
            label="Your country"
            outlined />
          <p v-if="hashtags" class="hashtags">
            <v-chip
              v-for="(hashtag, i) in hashtags.filter((e,i) => i<10).sort((a,b) => a.tag.localeCompare(b.tag))"
              small
              color="primary"
              :outlined="(activeHashtag != hashtag.tag)"
              :style="{fontSize: hashtag.size+'px', margin: '2px'}"
              :key="'hashtag-'+i"
              @click="activeHashtag = hashtag.tag">{{hashtag.tag}} </v-chip>
          </p>
          
          <div v-if="display == 'embedded'">
          <v-btn  color="primary" elevation="2"  @click="$emit('toggleForm')">
            <v-icon style="margin-right: 5px">mdi-tooltip-plus-outline</v-icon>Add your story
          </v-btn>
          <v-btn color="primary" outlined small elevation="2" @click="randomMemory" style="margin-top: 10px">
            <v-icon small style="margin-right: 5px">mdi-message-text</v-icon>Show random memory
          </v-btn><br />
          <v-btn v-if="$store.state.activeMemories.length > 0" plain x-small @click="hideMemories" >Hide all</v-btn>
          </div>

          <div v-else-if="display == 'contextual'">
          <v-btn color="primary" outlined small elevation="2" @click="randomMemory" style="margin-top: 10px">
            <v-icon small style="margin-right: 5px">mdi-message-text</v-icon>Show random
          </v-btn><br />
          <v-btn v-if="$store.state.activeMemories.length > 1" plain x-small @click="hideMemories" >Hide all</v-btn>
          </div>


        </div>
</template>

<script>
//get packages
//import Vue from 'vue'
import interactionService from '@/services/interactionService'



export default {
  name: 'App',
  components: {

  },

  props: {
    display: String,
  },

  data () {
    return {
    }
  },

  computed: {
    memories:   function() {return this.$store.state.memories},
    activeMemories: function() {return this.$store.getters.activeMemories},
    countries:  function() {
      return this.$store.state.countries.map(country => {
        let label = country.n_memories > 500 ? "500+" : country.n_memories
        
        return {
          text: country.name + " (" + label + ")",
          value: country.name
        }
      })
    },

    hashtags:   function() {return this.$store.state.hashtags},
    currentCountry: {
      get() {
        return this.$store.state.currentCountry
      },
      set(country) {
        this.$store.dispatch('setCurrentCountry',country)
        interactionService.sendInteraction({event: 'select-country', element: country})

      }
    },

    activeHashtag: {
      get() {
        return this.$store.state.activeHashtag
      },
      set(hashtag) {
        if(hashtag == this.activeHashtag) { //compare new and old hashtag
          interactionService.sendInteraction({event: 'unselect-hashtag', element: hashtag})
          this.$store.commit('setActiveHashtag',null) //deactivate hashtag when clicking an active one
        } else {
          interactionService.sendInteraction({event: 'select-hashtag', element: hashtag})
          this.$store.commit('setActiveHashtag',hashtag) //deactivate hashtag when clicking an active one
        }
      }
    },
  },
 
  mounted () {

  },

  methods: {
    randomMemory: function() {
      interactionService.sendInteraction({event: 'randomMemory'})
      let inactiveMemories = this.memories.map(memory => memory.id).filter(id => !this.activeMemories.map(memory => memory.id).includes(id))
      let id = inactiveMemories[Math.floor(Math.random()*inactiveMemories.length)]
      if(id != null) this.$store.commit('setActiveMemories',id)
    },

    hideMemories: function() {
      interactionService.sendInteraction({event: 'hideMemories'})
      this.$store.commit('setActiveMemories',null)
    },
  }
}
</script>



<style scoped>
p {
  font-family: 'Roboto Slab', serif;
  font-weight: 400;
}

.hashtags, .visWrapper, .formWrapper, button, .v-input, .introWrapper {
  pointer-events: all;
}

.hashtags {
  line-height: 100%;
}

  </style>
