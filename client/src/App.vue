<template>
  <div class="sorry">
    <template v-if="largeEnough">
      <router-view></router-view>
    </template>
    <template v-else>
      <v-app>
        <h1>corona<br /><span>memories</span></h1>
        <p>Please open this website on a larger screen.</p>
        <small>(Yes, we know it's 2021. Sorry.)</small>
      </v-app>
    </template>
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
        chosenPath: null,
        largeEnough: false,
    }
  },

  watch:  {
  },

  created() {
    let testPaths = ['embedded','separated','contextual']
    this.chosenPath = testPaths[Math.floor(Math.random() * 3)] //TODO Get from localStorage (to have people keep their chosen option
    //this.chosenPath = 'contextual' // CODE HARD WHILE BETAing
    //this.chosenPath = 'embedded' // CODE HARD WHILE BETAing
    //this.chosenPath = 'separated' // CODE HARD WHILE BETAing
    this.$store.commit('setSession',{hash: nanoid(), path: this.chosenPath})
    //this.chosenPath = 'data-discourse-question' // CODE HARD WHILE BETAing

    window.addEventListener("resize", this.resize); //detect resizing the window (to change svg dimensions)
    this.$store.dispatch('setCountries')
    this.$store.dispatch('setCurrentCountry',"World")
    this.$store.commit('setSession',{hash: nanoid(), path: this.chosenPath})
    window.addEventListener('beforeunload',  this.endSession)

  },

  mounted() {
    interactionService.sendInteraction({event: 'sessionStart'})
    this.$nextTick(() => { //when everything has loaded
      this.resize() //get true dimensions of containers
      if(window.innerWidth > 1000) {
        this.largeEnough = true
      } else {
        interactionService.sendInteraction({event: 'notLargeEnough'})
      }
      
    })  
  },

  methods: {
    resize: function() { //get dimensions and pass to vis-component
      let height = Math.min(...[800,window.innerHeight])
        this.$store.dispatch('setDimensions', {
          width: window.innerWidth,
          height: height,
          //left: (this.chosenPath == 'separated') ? 400 : 400 //make left col bigger if viewing list of comments 
          left: 400
        })
    },

    endSession: function() {
      interactionService.sendInteraction({event: 'sessionEnd'})
    } 
  }
}
</script>

<style scoped>
h1{
  margin: 10px 0 10px 0px;
  font-family: 'Roboto Slab', serif;
  font-weight: 400;
  font-size: 40px;
  color: #FA5E2D;
  line-height: 30px;
}

h1 span{
  font-weight: 900;
}

#sorry {
  width: 100%;
  background: #FFEBC6;
  min-height: 100%;
  height: 100%;
  padding-left: 50px;
  padding-top: 50px;
}
</style>