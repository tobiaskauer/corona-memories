<template>
  <v-app>
    <div class="formWrapper" v-if="newMemory.showForm">
      <memoryForm 
        :date="newMemory.date"
        :country="currentCountry"
        @close="toggleForm(false)"
        />
    </div>
    <div class="memoryWrapper" v-if="displayMemory.display">
      <memoryDisplay 
        :memory="displayMemory.memory"  
        @close="showMemory(false)"
      />
    </div>
    <div class="visWrapper">
      <vis
        v-if="cases"
        :dimensions="dimensions"
        metric="relative"
        :cases="cases"
        :country="currentCountry"
        :memories="memories"
        :showLine="newMemory.showLine"
        :overlay="overlay"
        :active="displayMemory.memory"
        @showForm="toggleForm($event)"
        @showMemory="showMemory"

        />
    </div>
    <v-container fluid>
      <v-row>
        <v-col md="3" xs="12">
          <div class="introWrapper">
            <h1>Corona Memories</h1>
            <p>It did not happen over night, but everything is different now. What are your memories, experiences and feelings after living in a pandemic for <counter /> days?</p>
          </div>
          <v-select
            v-if="countries"
            :items="countries"
            v-model="currentCountry"
            label="Your country"
            >
          </v-select>
          <v-btn
            color="primary"
            elevation="2"
            outlined
            @click="showLine(true)"
            >I have a memory</v-btn>
        </v-col>
      </v-row>
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
import memoryDisplay from './components/memoryDisplay'
import counter from './components/counter'
import vis from './components/vis'

export default {
  name: 'App',
  components: {
    memoryForm,
    memoryDisplay,
    counter,
    vis
  },

  data () {
    return {
      mounted: false,
      dimensions: {width: 0, height: 0, top: 50, right: 100, bottom: 50, left: 50},
      countries: null,
      currentCountry: "Germany",
      overlay: false,

      displayMemory: {
        display: false,
        current: null
      },
      newMemory: {
        showLine: false,
        showForm: false,
        date: ""
        //date: "2020-02-23" //to quicker test form
      }
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

  async mounted () {
    this.countries = (await caseService.getCountries()).data.map(e => e.country)
    this.$nextTick(() => {
      this.resize()
      this.mounted = true;
    })
 },

  methods: {
    resize: function() {
      this.dimensions.width = window.innerWidth
      this.dimensions.height = window.innerHeight
    },

    showMemory: function(memory) {
      if(memory) {
        Vue.set(this.memories[this.memories.findIndex(e => e.id == memory.id)],'active',true)
        Vue.set(this.displayMemory,'memory',memory)
        Vue.set(this.displayMemory,'display',true)
        this.overlay = true
      } else {
        Vue.set(this.displayMemory,'display',false)
        Vue.set(this.memories[this.memories.findIndex(e => e.active)],'active',false)
        this.overlay = false
      }
      
      
    },

    showLine: function(show) {
      Vue.set(this.newMemory,'showLine',show)
    },

    toggleForm: function(event) { //using an own method instead of inline assignment to stay sane
      if(event) {
        Vue.set(this.newMemory,'date',event)
        Vue.set(this.newMemory,'showLine',false)
        Vue.set(this.newMemory,'showForm',true)
        this.overlay = true
      } else {
        Vue.set(this.newMemory,'showForm',false)
        this.overlay = false
      }
    }
  }
}
</script>

<style>
.introWrapper {
  font-family: 'Roboto Serif';
}

.visWrapper {
  position: fixed;
  width: 100%;
  height: 100%;
}

#app {
  min-height: 100%;
  height: 100%
}
</style>
