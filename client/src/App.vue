<template>
  <v-app>
    <template v-if="cases && memories && countries && mounted">
    
    <Scrollama
      class="scrollama"
      :progress="true"
      :once="true"
      @step-enter="stepEnterHandler"
      @step-progress="stepProgressHandler"
    >

      <!-- display intro-text and consent form -->
      <div slot="graphic" ref="vis" class="visWrapper"> 
        <vis
          :cases="cases"
          :memories="memories"
          :options="visOptions"
          :datePicker="newMemory.datepicker"
          :hashtag="activeHashtag"
          @toggleForm="toggleForm($event)"
          @showMemory="showMemory" />
      </div>

        <div class="introWrapper" data-step="1">  
          <h1>corona<br /><span>memories</span></h1>
          <p class="larger"> Numbers do not tell stories. <strong>People do.</strong></p>
          <p>Since the start of the pandemic <strong>about <counter /> days</strong> ago, we are confronted with charts about new cases or even deaths. What are the human stories behind the numbers?</p>
          <p class="smaller">The research is conducted by Tobias Kauer (University of Edinburgh), Benjamin Bach (University of Edinburgh), and Marian Dörk (Potsdam University of Applied Sciences). It has been granted approval by the ethics committee. By clicking the button, you indicate that you are a speaker of English and at least 18 years old. You have read the <a href="#">information letter</a> and you voluntarily agree to participate, and understand you can stop your participation at any time. You agree that your anonymous data may be kept permanently in Edinburgh University archived and may be used by qualified researchers for teaching and research purposes.</p>
            <v-btn color="primary" outlined @click="giveConsent">
              <v-icon small>mdi-check-circle</v-icon>
             I agree, show me
            </v-btn>
        </div>

        <!-- wrapper that controls progress of appearing memory bubbles -->
        <div class="animatorWrapper" data-step="2"></div> 

        <!-- display exploration controls and trigger submission form -->
        <div v-if="consent" id="target" class="explorationWrapper" data-step="3"> 
          <p><strong>Click the bubbles to read people’s stories.</strong><br />Select countries and/or hashtags to filter.</p>
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
              @click="filterMemories(hashtag.tag)">{{hashtag.tag}} </v-chip>
          </p>
        </div>
    </Scrollama>

    <!-- call to action button -->
    <div class="callToActionWrapper" v-if="consent && currentStepId > 1">
      <v-btn color="primary" outlined elevation="2" @click="toggleDatepicker">
        <template v-if="!newMemory.datepicker">
          <v-icon small>mdi-tooltip-plus-outline</v-icon>Add your story
        </template>
        <template v-else>
          <v-icon small>mdi-close-circle-outline</v-icon>Stop adding
        </template>
      </v-btn>
    </div>

    <!-- submission form (default: hidden) -->
    <div class="formWrapper" v-if="newMemory.showForm">
      <memoryForm
        :date="newMemory.date"
        :country="currentCountry"
        :countries="countries"
        :hashtags="hashtags"
        @close="toggleForm(false)"/>
    </div>

    <!-- display single memory (default: hidden) -->
    <div class="memoryWrapper" v-if="displayMemory.display">
      <memoryDisplay
        :memory="displayMemory.memory"
        @close="showMemory(false)"
        @previous="changeMemory('previous')"
        @next="changeMemory('next')"/>
    </div>
  </template>

  <!-- loading screen if not everything has loaded yet -->
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
import * as d3 from 'd3'


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
      mounted: false, //turns true after the first lifecycle has run (and allows to render everything in the DOM)
      consent: true, //only start recording after people consent
      currentStepId: 0, //what part of the page are we in?
      countries: null, //to be filled in mounted()
      currentCountry: "Germany", //to be changed via select, triggers reactivity for asyncComputed memories and cases
      hashtags: null, //ranked list of present hashtags to be filled by watching memories
      activeHashtag: null, //String of active hashtag (to filter memories)

      visOptions: { //all settings that need to be passed to vis-component
        dimensions: {width: 0, height: 0, top: 100, right: 100, bottom: 0, left: 100},
        progess: 0, //count up to length of memories while scrolling
        overlay: false, //manual SVG overlay (to display single circle on top), istead of a vuetify one
      },

      displayMemory: { //all settings that need to be passed to displayMemory-component
        display: false, //initially, do not show a single memory 
        memory: null,
      },
      newMemory: { //all settings that need to be passed to the form that adds a new memory (or the step before: picking a date)
        datepicker: false, //show circle (formerly line) that adds new dot
        showForm: false, //show form after clicking the dot
        date: "" //is set when hovering line and passed to memory form
        //date: "2020-02-23" //to quicker test form
      }
    }
  },

  asyncComputed: {
    async cases() {
      return (await caseService.getCases({country: this.currentCountry, metric: "relative_cases"})).data //get cases from API (make this async to keep reactivity when changing country)
    },
    async memories() {
      return (await memoryService.getMemories({country: this.currentCountry})).data //same as above
    }
  },

  watch:  {
    memories: function(memories) {
      let tags = memories//find all hashtags
        .map(memory => memory.comment.match(/#[a-z]+/gi))
        .flat()
        .filter(tag => tag) 
      let counted = tags.reduce((a, b) => (a[b] = (a[b] || 0) + 1, a), {}) //count occurence of single hashtags
      let ranked = Object.keys(counted)
        .map(tag => {return {tag: tag, occurences: counted[tag]}}) //turn into array
        .sort((a,b) => b.occurences - a.occurences) //sort that array
      
      let scaleSize = d3.scaleLinear().domain(d3.extent(ranked,r=>r.occurences)).range([5,15]) //create scale for font sze of hashtags
      ranked.forEach(hashtag => hashtag.size = scaleSize(hashtag.occurences)) //assign font size to each hashtag
      this.hashtags = ranked;
    }
  },

  created() {
    window.addEventListener("resize", this.resize); //detect resizing the window (to change svg dimensions)

  },

  async mounted () {
    this.countries = (await caseService.getCountries()).data.map(e => e.country) //get countries once when mounting (no need to to this reactive)
    this.$nextTick(() => { //when everything has loaded
      this.resize() //get true dimensions of containers
      this.mounted = true; //alllow to render DOM
    })    
  },

  methods: {
    resize: function() { //get dimensions and pass to vis-component
      Vue.set(this.visOptions.dimensions,'width',window.innerWidth) 
      Vue.set(this.visOptions.dimensions,'height',window.innerHeight)
    },

    giveConsent: function() { //by clicking the "I agree"-button
      this.consent = true
      this.$nextTick(() => { //wait until consent = true has taken effect and the DOM has rendered all objects
        this.$vuetify.goTo("#target", {duration: 2000}); //then scroll to them
      });
    },

    showMemory: function(memory) {
      
      if(memory) { //is true when a memory is passed
        Vue.set(this.memories[this.memories.findIndex(stack => stack.id == memory.id)],'active',true) //set memory active
        Vue.set(this.displayMemory,'memory',memory)
        Vue.set(this.displayMemory,'display',true)
        Vue.set(this.visOptions,'overlay',true)
      } else { //when no memory is passed
        Vue.set(this.displayMemory,'display',false) //hide display component
        Vue.set(this.memories[this.memories.findIndex(e => e.active)],'active',false) //find active memory, turn it back off
        Vue.set(this.visOptions,'overlay',false) //don't show the svg overlay 
      }
    },

    changeMemory: function(direction) {
      let currentMemoryIndex = this.memories.findIndex(e => e.active)
      let futureMemoryIndex  //future index (when using buttons on didplay)
        if(direction == "next") futureMemoryIndex = currentMemoryIndex +1 
        if(direction == "previous") futureMemoryIndex = currentMemoryIndex -1 
        if(futureMemoryIndex && this.memories[futureMemoryIndex]) { //if memory with does exist
          Vue.set(this.displayMemory,'memory',this.memories[futureMemoryIndex])
          Vue.set(this.memories[currentMemoryIndex],'active',false) //deactivate previously active memory 
          Vue.set(this.memories[futureMemoryIndex],'active',true) //activate now active memory 
        }
    },

    stepEnterHandler({element, direction}) {//handle scrolling from step to step
      direction //maybe we need this later
      switch(element.className) {
        case "introWrapper": 
           Vue.set(this.visOptions,'progress',0) //math.ceil is needed elsewhere to show all memories, so let's reset counter to 0 when we scroll back to the intro
          break
      }
      this.currentStepId = element.dataset.step //store current step in data
    },

    stepProgressHandler({element, progress}) { //handle scrolling with progress
      if(element.className == "animatorWrapper" && this.consent) { //if visitor has consentent AND were scrolling over the animatorWrapper
        let showElementsNumber = Math.ceil(progress * this.memories.length) //compute number of memories to show (min: 0, max: all memories)
        Vue.set(this.visOptions,'progress',showElementsNumber) //write to reactive data
      }
    },

    toggleDatepicker: function() {
      let bool = !this.newMemory.datepicker
      Vue.set(this.newMemory,'datepicker',bool)
    },

    filterMemories: function(hashtag) {
      if(this.activeHashtag != hashtag) {
        this.activeHashtag = hashtag
      } else {
        this.activeHashtag = null
      }
    }, 

    toggleForm: function(date) { //using an own method instead of inline assignment to stay sane
      
      if(date) {
        Vue.set(this.newMemory,'date',date)
        Vue.set(this.newMemory,'datepicker',false)
        Vue.set(this.newMemory,'showForm',true)
        this.overlay = true
      } else {
        Vue.set(this.newMemory,'showForm',false)
        this.overlay = false
      }
    },
  }
}
</script>

<style src="vue-scrollama/dist/vue-scrollama.css"></style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;900&display=swap');

.introWrapper, .explorationWrapper, .animatorWrapper  {
  //border: 1px dotted black;
  height: 100vh;
  padding-top: 10px;
  padding: 20px 0px 50px 30px;
}

.scrollama {
  width: 40%;
  
  min-width: 200px;
  max-width: 400px;
  font-family: 'Roboto Slab', serif;
  pointer-events: none;
}

button, .v-input {
  pointer-events: all;
}

h1{
  margin: 30px 0 10px 0px;
  //height: 100px;
  //position: fixed;
  font-family: 'Roboto Slab', serif;
  font-weight: 400;
  font-size: 40px;
  color: #FA5E2D;
  line-height: 30px;
}

.callToActionWrapper {
  position: fixed;
  top: 10px;
  right: 10px;
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
  font-family: sans-serif;
  color: rgba(100,100,100);
  font-size: 9px;
  line-height: 10px;
}

.visWrapper {
  position: absolute;
  width: 100%;
  left: 0;
  height: 100%;
  pointer-events: all;
}

.hashtags {
  pointer-events: all;
  line-height: 100%;
}


#app {
  background: #FFEBC6;
  min-height: 100%;
  height: 100%;
}
</style>
