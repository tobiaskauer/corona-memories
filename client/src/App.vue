<template>
  <v-app>
    <template v-if="cases && memories && countries && mounted">
    <h1>corona<br /><span>memories</span></h1>
    <Scrollama
      class="scrollama"
      :progress="true"
      @step-enter="stepEnterHandler"
      @step-progress="stepProgressHandler"
    >
      <div slot="graphic" class="visWrapper">
        <vis
          :cases="cases"
          :memories="memories"
          :options="visOptions"
          :country="currentCountry"
          :datePicker="newMemory.datepicker"
          @toggleForm="toggleForm($event)"
          @showMemory="showMemory" />
      </div>

        <div class="introWrapper" data-step="1">  
          <p class="larger"> Numbers do not tell stories. <strong>People do.</strong></p>
          <p>Since the start of the pandemic <counter /> days ago, we are confronted with charts about new cases or even deaths. What are the human stories behind the numbers?</p>
          <p class="smaller">The research is conducted by Tobias Kauer (University of Edinburgh), Benjamin Bach (University of Edinburgh), and Marian Dörk (Potsdam University of Applied Sciences). It has been granted approval by the ethics committee. By clicking the button, you indicate that you are a speaker of English and at least 18 years old. You read the information letter and you voluntarily agree to  participate, and understand you can stop your participation at any time. You agree that your anonymous data may be kept permanently in Edinburgh University archived and may be used by qualified researchers for teaching and research purposes.</p>
            <v-btn color="primary" outlined @click="giveConsent">
              <v-icon small>mdi-check-circle</v-icon>
             I agree, show me
            </v-btn>
        </div>

        <div class="animatorWrapper" data-step="2"></div>

        <div v-if="consent" id="target" class="explorationWrapper" data-step="3">
          <p><strong>What's the day the pandemic changed your life?</strong></p>
          <v-btn color="primary" outlined elevation="2" @click="toggleDatepicker">
            <template v-if="!newMemory.datepicker">
              <v-icon small>mdi-tooltip-plus-outline</v-icon>Add a story to the curve
            </template>
            <template v-else>
              <v-icon small>mdi-close-circle-outline</v-icon>Stop adding
            </template>
          </v-btn>
          <p v-if="newMemory.datepicker">click on the line to choose a date</p>
          <hr style="color: #FA5E2D; margin: 20px 0; height: 1px;" />
          <v-select
            :items="countries"
            v-model="currentCountry"
            label="Your country"
            outlined />
        </div>

      <div class="formWrapper" v-if="newMemory.showForm">
        <memoryForm
          :date="newMemory.date"
          :country="currentCountry"
          @close="toggleForm(false)"/>
      </div>
      <div class="memoryWrapper" v-if="displayMemory.display">
        <memoryDisplay
          :memory="displayMemory.memory"
          @close="showMemory(false)"/>
      </div>
    </Scrollama>
    </template>
    <template v-else>
      <v-card class="d-flex justify-center mb-6" color="rgb(255, 0, 0, 0.0)" elevation="0" style="margin-top: 100px;">
        <v-progress-circular
        :size="300"
        indeterminate
        color="primary"
        >Loading ...<br />try refresing?</v-progress-circular>
      </v-card>
      </template>
  </v-app>
</template>

<script>
//get packages
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)
import 'intersection-observer' // for cross-browser support
import Scrollama from 'vue-scrollama'

//get services for API connectivity
import caseService from '@/services/caseService'
import memoryService from '@/services/memoryService'

//get components
import memoryForm from './components/memoryForm'
import memoryDisplay from './components/memoryDisplay'
import counter from './components/counter'
import vis from './components/vis'

export default {
  name: 'App',
  components: {
    Scrollama,
    memoryForm,
    memoryDisplay,
    counter,
    vis
  },

  data () {
    return {
      mounted: false,
      consent: true, //only start recording after people consent
      countries: null, 
      currentCountry: "World",      

      visOptions: {
        dimensions: {width: 0, height: 0, top: 20, right: 50, bottom: 50, left: 50},
        progess: 0,
        overlay: false,
        displayMemory: false
      },

      displayMemory: {
        display: false,
      },
      newMemory: {
        datepicker: false, //show circle (formerly line) that adds new dot
        showForm: false, //show form after clicking the dot
        date: "" //is set when hovering line and passed to memory form
        //date: "2020-02-23" //to quicker test form
      }
    }
  },

  asyncComputed: {
    async cases() {
      return (await caseService.getCases({country: this.currentCountry, metric: "relative_cases"})).data
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
      Vue.set(this.visOptions.dimensions,'width',window.innerWidth)
      Vue.set(this.visOptions.dimensions,'height',window.innerHeight)
    },

    giveConsent: function() {
      this.consent = true
      this.$nextTick(() => {
        this.$vuetify.goTo("#target", {duration: 2000});
      });
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

    stepEnterHandler({element, direction}) {
      direction //maybe we need this later
      switch(element.className) {
        case "introWrapper": 
           Vue.set(this.visOptions,'progress',0)
          break
      }
      //this.currStepId = element.dataset.stepId
    },

    stepProgressHandler({element, progress}) {
      if(element.className == "animatorWrapper" && this.consent) {
        let showElementsNumber = Math.ceil(progress * this.memories.length)
        Vue.set(this.visOptions,'progress',showElementsNumber)
      }
    },

    toggleDatepicker: function() {
      let bool = !this.newMemory.datepicker
      Vue.set(this.newMemory,'datepicker',bool)
    },

    toggleForm: function(date) { //using an own method instead of inline assignment to stay sane
      console.log(date)
      if(date) {
        Vue.set(this.newMemory,'date',date)
        Vue.set(this.newMemory,'datepicker',false)
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

<style src="vue-scrollama/dist/vue-scrollama.css"></style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;900&display=swap');

.introWrapper, .explorationWrapper, .animatorWrapper  {
  //border: 1px dotted black;
  height: 100vh;
  padding-top: 150px;
}

.scrollama {
  width: 40%;
  padding: 0 0px 50px 30px;
  min-width: 200px;
  max-width: 400px;
  font-family: 'Roboto Slab', serif;
  pointer-events: none;
}

button, .v-input {
  pointer-events: all;
}

h1{
  margin: 50px 0 0 30px;
  height: 100px;
  position: fixed;
  font-family: 'Roboto Slab', serif;
  font-weight: 400;
  font-size: 40px;
  color: #FA5E2D;
  line-height: 30px;
}

h1 span{
  font-weight: 900;
}

p {
  font-family: 'Roboto Slab', serif;
  font-weight: 400;
}

p.larger {
  font-size: 1.2em;
}

p.smaller {
  color: rgba(0,0,0,.5);
  font-size: 9px;
  line-height: 10px;
}

.visWrapper {
  position: fixed;
  width: 100%;
  left: 0;
  height: 100%;
  pointer-events: all;
}


#app {
  background: #FFEBC6;
  min-height: 100%;
  height: 100%;
}
</style>
