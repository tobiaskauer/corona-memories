<template>
  <v-app>
    <template v-if="cases && memories && countries && mounted">
      <!-- toggle sidebar -->
      <div class="drawerToggle">
        <v-btn style="background-color: white" dark large icon @click="showSidebar = !showSidebar">
          <v-icon small color="#FA5E2D" style="margin-left: 20px">
            <template v-if="showSidebar">
              mdi-chevron-left
            </template>
            <template v-else>
              mdi-chevron-right
            </template>
          </v-icon>
        </v-btn>
      </div>
    
    <Scrollama
      class="scrollama"
      :progress="true"
      @step-enter="stepEnterHandler"
      @step-progress="stepProgressHandler"
    >

      <!-- display intro-text and consent form -->
      <div slot="graphic" class="visWrapper"> 
        <vis
          :cases="cases"
          :memories="memories"
          :options="visOptions"
          :hashtag="activeHashtag"
          :newMemory="newMemory"
          @pickDate="pickDate($event)"
          @showMemory="showMemory" />
          <!--@toggleForm="toggleForm($event)"-->
      </div>

        <div class="introWrapper" :class="{hidden: !showSidebar}" data-step="1">  
          <h1>corona<br /><span>memories</span></h1>
          <p class="larger"> Numbers alone can not stories do not tell stories. You can.</p>
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
        <div v-if="consent" id="progressTarget" class="explorationWrapper"  :class="{hidden: !showSidebar}" data-step="3"> 
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

        <!-- submission form (default: hidden) -->
        <div v-if="consent" id="addTarget" class="formWrapper" data-step="4">
          <memoryForm
            v-if="newMemory.showForm"
            :date="newMemory.date"
            :country="currentCountry"
            :countries="countries"
            :hashtags="hashtags"
            @pickDate="pickDate($event)"
            @close="toggleForm(false)"/>
      </div>
    </Scrollama>

    <!-- call to action button -->
    <div class="callToActionWrapper" v-if="consent && currentStepId > 1">
      <v-btn color="primary" outlined elevation="2" @click="toggleForm">
        <template v-if="!newMemory.showForm">
          <v-icon small>mdi-tooltip-plus-outline</v-icon>Add your story
        </template>
        <template v-else>
          <v-icon small>mdi-close-circle-outline</v-icon>Stop adding
        </template>
      </v-btn>
    </div>

    <!-- display single memory (default: hidden) -->
    <div class="memoryWrapper" v-if="displayMemory.display">
      <memoryDisplay
        :memory="displayMemory.memory"
        @close="showMemory(false)"
        @previous="changeMemory('previous')"
        @next="changeMemory('next')"
        @delete="hideMemory"/>
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
import memoryForm from './memoryForm'
import memoryDisplay from './memoryDisplay'
import counter from './counter'
import vis from './vis'

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

      //initial settings and display iotions
      showSidebar: true,
      mounted: false, //turns true after the first lifecycle has run (and allows to render everything in the DOM)
      consent: true, //only start recording after people consent
      currentStepId: 0, //what part of the page are we in?
      countries: null, //to be filled in mounted()
      currentCountry: "Germany", //to be changed via select, triggers reactivity for asyncComputed memories and cases
      hashtags: null, //ranked list of present hashtags to be filled by watching memories
      activeHashtag: null, //String of active hashtag (to filter memories)

      parseDate: d3.utcParse("%Y-%m-%d"),

      //settings for visualization
      visOptions: { //all settings that need to be passed to vis-component
        dimensions: {width: 0, height: 0, top: 100, right: 40, bottom: 50, left: 400},
        progess: 0, //count up to length of memories while scrolling
        overlay: false, //manual SVG overlay (to display single circle on top), istead of a vuetify one
      },

      //settings for displaying memories
      displayMemory: { //all settings that need to be passed to displayMemory-component
        display: false, //initially, do not show a single memory 
        memory: null,
      },

      //settings for adding a memory
      newMemory: { //all settings that need to be passed to the form that adds a new memory (or the step before: picking a date)
        showForm: false, //show form after clicking the dot
        date: {
          string: "",
          exact: true, //switch between exact and rough dates
        }
      }
    }
  },

  asyncComputed: {
    async cases() {
      return (await caseService.getCases({
        country: this.currentCountry,
        metric: "relative_cases"}
      )).data //get cases from API (make this async to keep reactivity when changing country)
    },
    async memories() {
      return (await memoryService.getMemories({
        attributes: [['date', 'dateString'], 'exactDate', 'comment', 'weight', 'id'],
        country: this.currentCountry,
        flagged: false
        })).data
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
    },

    showSidebar: function(showSidebar) {
      if(showSidebar) {
        Vue.set(this.visOptions.dimensions,'left', 400)
      } else {
        Vue.set(this.visOptions.dimensions,'left', 30)
      }
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
        this.$vuetify.goTo("#progressTarget", {duration: 2000}); //then scroll to them
      });
    },

    showMemory: function(memoryId) {
      if(memoryId) { //is true when a memory is passed
        let memoryIndex = this.memories.findIndex(stack => stack.id == memoryId)
        Vue.set(this.memories[memoryIndex],'active',true) //set memory active
        Vue.set(this.displayMemory,'memory',this.memories[memoryIndex])
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

    hideMemory: function(payload) {
      this.showMemory(false)
      Vue.delete(this.memories,this.memories.findIndex(e=>e.id == payload.id))
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


    filterMemories: function(hashtag) {
      if(this.activeHashtag != hashtag) {
        this.activeHashtag = hashtag
      } else {
        this.activeHashtag = null
      }
    }, 

    toggleForm: function() { //using an own method instead of inline assignment to stay sane
      if(!this.newMemory.showForm) {
        Vue.set(this.newMemory,"showForm", true)
       this.$nextTick(() => { //wait until consent = true has taken effect and the DOM has rendered all objects
          this.$vuetify.goTo("#addTarget", {duration: 2000}); //then scroll to them
        })
      } else {
        Vue.set(this.newMemory,"showForm", false)
        this.$vuetify.goTo("#progressTarget", {duration: 500}); //then scroll to them
      }
      /*if(date) {
        Vue.set(this.newMemory,'date',date)
        Vue.set(this.newMemory,'datepicker',true)
        Vue.set(this.newMemory,'showForm',true)
        this.overlay = true
      } else {
        Vue.set(this.newMemory,'showForm',false)
        Vue.set(this.newMemory,'datapicker',false)
        this.overlay = false
      }*/
    },

    pickDate: function(event) {
      Vue.set(this.newMemory.date,'string',event.string)
      Vue.set(this.newMemory.date,'exact',event.exact)
    }
  }
}
</script>

<style src="vue-scrollama/dist/vue-scrollama.css"></style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;900&display=swap');

.introWrapper, .explorationWrapper, .animatorWrapper, .formWrapper {
  //border: 1px dotted black;
  height: 100vh;
  padding-top: 10px;
  padding: 40px 0px 50px 20px;
  width: 400px;
}

.hidden {
   margin-left: -400px !important;
  padding-right: 400px !important;
}

.drawerToggle {
  position: fixed;
  z-index: 999;
  left: -25px;
}

.scrollama {
  font-family: 'Roboto Slab', serif;
  pointer-events: none;
  
}

button, .v-input {
  pointer-events: all;
}

h1{
  margin: 10px 0 10px 0px;
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
}
.formWrapper {
  margin-bottom: 100vh;
}
.hashtags, .visWrapper, .formWrapper {
  pointer-events: all;
}

.hashtags {
  line-height: 100%;
}

#app {
  background: #FFEBC6;
  min-height: 100%;
  height: 100%;
}
</style>
