<template>
  <div class="app">
    <router-view foo="bar"></router-view>
  </div>
</template>

<script>
import interactionService from '@/services/interactionService'
import { nanoid } from 'nanoid'

export default {
  name: 'App',
  components: {

  },

  data () {
    return {
      
    }
  },

  watch:  {
  },

  created() {
    let testPaths = ['data-discourse-question','data-question-discourse']
    let chosenPath = testPaths[Math.floor(Math.random() * 2)] //TODO Get from localStorage (to have people keep their chosen option
    chosenPath = "data-question-discourse"
    chosenPath = 'data-discourse-question' // CODE HARD WHILE BETAing

    window.addEventListener("resize", this.resize); //detect resizing the window (to change svg dimensions)
    this.$store.dispatch('setCountries')
    this.$store.dispatch('setCurrentCountry',"World")
    this.$store.commit('setSession',{hash: nanoid(), path: chosenPath})
    window.addEventListener('beforeunload',  this.endSession)

  },

  mounted() {
    interactionService.sendInteraction({event: 'sessionStart'})
    this.$nextTick(() => { //when everything has loaded
      this.resize() //get true dimensions of containers
    })  
  },

  methods: {
    resize: function() { //get dimensions and pass to vis-component
      let height = Math.min(...[800,window.innerHeight])
        this.$store.dispatch('setDimensions', {
          width: window.innerWidth,
          height: height
        })
    },

    endSession: function() {
      interactionService.sendInteraction({event: 'sessionEnd'})
    } 
  }
}
</script>

<style scoped>
</style>