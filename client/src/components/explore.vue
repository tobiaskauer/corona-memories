<template>
    <div>
          <p><strong>Click the bubbles to read people’s stories.</strong><br />Select countries or hashtags to filter.</p>
          <v-select
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
          <v-btn color="primary" elevation="2" @click="$emit('toggleForm')">
            <v-icon style="margin-right: 5px">mdi-tooltip-plus-outline</v-icon>Add your story
          </v-btn>
          <v-btn color="primary" outlined small elevation="2" @click="randomMemory" style="margin-top: 10px">
            <v-icon small style="margin-right: 5px">mdi-message-text</v-icon>Show random memory
          </v-btn><br />
          <v-btn v-if="$store.state.activeMemories.length > 0" plain x-small @click="hideMemories" >Hide all</v-btn>
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

  data () {
    return {
    }
  },

  computed: {
      memories:   function() {return this.$store.state.memories},
    countries:  function() {
      return this.$store.state.countries.map(country => {
        return {
          text: country.name + " (" + country.n_memories + ")",
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
      let id = this.memories.map(memory => memory.id)[Math.floor(Math.random()*this.memories.length)]
      this.$store.commit('setActiveMemories',id)
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
