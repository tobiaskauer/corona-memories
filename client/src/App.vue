<template>
  <v-app>
    <v-container fluid>
      <v-select
        v-if="countries"
        :items="countries"
        v-model="currentCountry"
        label="Country"
        ></v-select>
    <memoryForm />
    <vis
      v-if="cases"
      :dimensions="dimensions"
      metric="relative"
      :cases="cases"
      :memories="memories"
      />
    </v-container>
  </v-app>
</template>

<script>
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

import caseService from '@/services/caseService'
import memoryService from '@/services/memoryService'

import memoryForm from './components/memoryForm'
import vis from './components/vis'

export default {
  name: 'App',
  components: {
    memoryForm,
    vis
  },

  data () {
    return {
      mounted: false,
      dimensions: {width: 1000, height: 1000, top: 50, right: 50, bottom: 50, left: 50},
      countries: null,
      currentCountry: "Germany"
    }
  },

  asyncComputed: {
    async cases() {
      return (await caseService.getCases({country: this.currentCountry})).data
    },
    async memories() {
      return (await memoryService.getMemories({country: this.currentCountry})).data
    }
  },

  created() {
    window.addEventListener("resize", this.resize);
  },

  async  mounted () {
    this.countries = (await caseService.getCountries()).data.map(e => e.country)

    //this.$store.dispatch('setCountry',"Germany")
    this.$nextTick(() => {
      this.resize()
      this.mounted = true;
    })
 },

  methods: {
    resize: function() {
      this.dimensions.width = window.innerWidth
      this.dimensions.height = window.innerHeight /2
    },



  }
}
</script>

<style>
/*@import url('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');*/

.wrapper {
  width: 100%;
  height: 100%;
  //background: radial-gradient(83.17% 83.17% at 18.37% 16.83%, #20CB86 0%, #15B5B5 100%);/* Rectangle 237 */
  //background: linear-gradient(121.09deg, #64033D 16.58%, #100530 82.74%);
}

#app {
  min-height: 100%;
  height: 100%
}
</style>
