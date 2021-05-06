<template>
  <div class="app">
    <router-view></router-view>
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
    window.addEventListener("resize", this.resize); //detect resizing the window (to change svg dimensions)
    this.$store.dispatch('setCountries')
    this.$store.dispatch('setCurrentCountry',"World")

    this.$store.commit('setSession',nanoid())
  },

  mounted() {
    interactionService.sendInteraction({session: this.$store.state.session, event: 'sessionStart'})
    this.$nextTick(() => { //when everything has loaded
      this.resize() //get true dimensions of containers
    })  
  },

  methods: {
    resize: function() { //get dimensions and pass to vis-component
        this.$store.dispatch('setDimensions', {
          width: window.innerWidth,
          height: window.innerHeight
        })
    },
  }
}
</script>

<style scoped>
</style>