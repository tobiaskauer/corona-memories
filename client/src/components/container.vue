<template>
  <v-app :style= "[consent ? {position: 'static'} : {position: 'fixed'}]">
    <template v-if="cases && memories && countries && mounted">
      <!--<a v-if="consent" :href="'https://docs.google.com/forms/d/e/1FAIpQLSfydTg7ZpZG21s9in4M-mM_8BxA5mZm73K2p5KDshaAcRipgA/viewform?entry.62570228='+session" target="_blank"><div class="ear">
        <span>{{ribbonText}}</span>
      </div></a>-->
      <ul class="stepnavi">
        <li v-for="e,i in steps" :key="i">
          <span v-if="i == currentStepId-1">&#9679;</span>
          <span v-else>&#9675;</span>
          </li>
      </ul>


      
        <survey v-if="consent" :display="testPath" />
      
    
    <Scrollama
      class="scrollama"
      :progress="true"
      :debug="false"
      @step-enter="stepEnterHandler"
      @step-progress="stepProgressHandler"
    >

      <!-- EMBEDDED -->
      <template v-if="testPath == 'embedded'">
        <div slot="graphic" class="visWrapper"> 
        <vis
          :progress="progress"
          :consent="consent"
          :display="testPath"
          @demoClick="highlightConsent" />
      </div>

        <div class="introWrapper w400" data-step="1" :style="{width: dimensions.left}">  
          <h1>corona<br /><span>memories</span></h1>
          <p class="larger">How do we remember the pandemic?</p>
          <p>Since it started <strong>about <counter /> days</strong> ago we are confronted with charts about new cases daily. But what are the human stories behind the numbers?</p>
          <p class="smaller">The research is conducted by Tobias Kauer (University of Edinburgh), Benjamin Bach (University of Edinburgh), and Marian Dörk (Potsdam University of Applied Sciences). It has been granted approval by the ethics committee. By clicking the button, you indicate that you are a speaker of English and at least 18 years old. You have read the <router-link to="/participantSheet">information letter</router-link> and you voluntarily agree to participate, and understand you can stop your participation at any time. You agree that your anonymous data may be kept permanently in Edinburgh University archived and may be used by qualified researchers for teaching and research purposes.</p>
            <v-btn class="transition-swing" :elevation="clickedDemo ? 10 : 0" color="primary" outlined @click="enter('#progressTarget')">
              <v-icon small>mdi-check-circle</v-icon>
             I agree, show me
            </v-btn>
            <p v-if="clickedDemo && !consent">Please consent first.</p>
            <p style="margin-top: 15px">
              <a href="https://www.designinformatics.org/" target="_blank"><img class="logo" src="../assets/ed.png" style="width: 200px"/></a><br>
              <a href="https://uclab.fh-potsdam.de/" target="_blank"><img class="logo" src="../assets/fh.png" style="width: 40%"/></a>
            </p>
        </div>

        <div class="animatorWrapper" :style= "[consent ? {height: '100vh'} : {height: 0}]"></div> 

        <div  id="progressTarget" class="explorationWrapper w400" :style= "[consent ? {height: '100vh'} : {height: 0}]"   data-step="2"> 
          <explore display="embedded" v-if="consent" @toggleForm="toggleForm" />
        </div>

        
        <div id="addTarget" class="formWrapper w400" :style= "[consent ? {height: '90vh'} : {height: 0}]" data-step="3">
          <memoryForm
            v-if="consent && newMemory.showForm"
            @close="toggleForm(false)"/>
        </div>
      </template>








   <!-- SEPARATED -->
      <template v-else-if="testPath == 'separated'">
        <div slot="graphic" class="visWrapper"> 
        <vis
          :progress="progress"
          :consent="consent"
          :display="testPath" />
      </div>

        <div class="introWrapper w600" data-step="1">  
          <h1>corona<br /><span>memories</span></h1>
          <p class="larger">How do we remember the pandemic?</p>
          <p>Since the start of the pandemic <strong>about <counter /> days</strong> ago we are confronted with charts about new cases daily. But what are the human stories behind the numbers?</p>
          <p class="smaller">The research is conducted by Tobias Kauer (University of Edinburgh), Benjamin Bach (University of Edinburgh), and Marian Dörk (Potsdam University of Applied Sciences). It has been granted approval by the ethics committee. By clicking the button, you indicate that you are a speaker of English and at least 18 years old. You have read the <router-link to="/participantSheet">information letter</router-link> and you voluntarily agree to participate, and understand you can stop your participation at any time. You agree that your anonymous data may be kept permanently in Edinburgh University archived and may be used by qualified researchers for teaching and research purposes.</p>
            <v-btn class="transition-swing" :elevation="clickedDemo ? 10 : 0" color="primary" outlined @click="enter('#progressTarget')">
              <v-icon small>mdi-check-circle</v-icon>
             I agree, show me
            </v-btn>
            <p style="margin-top: 15px">
              <a href="https://www.designinformatics.org/" target="_blank"><img class="logo" src="../assets/ed.png" style="width: 200px"/></a><br>
              <a href="https://uclab.fh-potsdam.de/" target="_blank"><img class="logo" src="../assets/fh.png" style="width: 40%"/></a>
            </p>
        </div>


         
        <div  id="progressTarget" class="explorationWrapper w600" :style= "[consent ? {'min-height': '100vh'} : {height: 0}]"   data-step="2"> 
          <explore @toggleForm="toggleForm" display="list" />
          <memoryList />
          <v-btn block style="width: 99%" color="primary" elevation="2"  @click="toggleForm">
            <v-icon style="margin-right: 5px">mdi-tooltip-plus-outline</v-icon>Add your story
          </v-btn>
        </div>
        
        
        <div id="addTarget" class="formWrapper" :style= "[consent ? {height: '90vh'} : {height: 0}]" data-step="3">
          <memoryForm
            v-if="newMemory.showForm"
            :display="testPath"
            @close="toggleForm(false)"/>
<!--            <v-btn class="transition-swing" :elevation="clickedDemo ? 10 : 0" color="primary" outlined @click="enter('#progressTarget')">
              <v-icon small>mdi-check-circle</v-icon>
             Explore other people's stories.
            </v-btn>-->
      </div>
      </template>


         <!-- CONTEXTUAL -->
      <template v-else-if="testPath == 'contextual'">
        <div slot="graphic" class="visWrapper"> 
        <vis
          :progress="progress"
          :consent="consent"
          :display="testPath"
          @demoClick="highlightConsent"  />
      </div>

        <div class="introWrapper w400" data-step="1">  
          <h1>corona<br /><span>memories</span></h1>
          <p class="larger">What are the measures & policy responses connected to data about the pandemic?</p>
          <p>Since the start of the pandemic <strong>about <counter /> days</strong> ago, we are confronted with charts about new cases or even deaths. What are the events behind the numbers?</p>
          <p class="smaller">The research is conducted by Tobias Kauer (University of Edinburgh), Benjamin Bach (University of Edinburgh), and Marian Dörk (Potsdam University of Applied Sciences). It has been granted approval by the ethics committee. By clicking the button, you indicate that you are a speaker of English and at least 18 years old. You have read the <router-link to="/participantSheet">information letter</router-link> and you voluntarily agree to participate, and understand you can stop your participation at any time. You agree that your anonymous data may be kept permanently in Edinburgh University archived and may be used by qualified researchers for teaching and research purposes.</p>
            <v-btn class="transition-swing" :elevation="clickedDemo ? 10 : 0" color="primary" outlined @click="enter('#progressTarget')">
              <v-icon small>mdi-check-circle</v-icon>
             I agree, show me
            </v-btn>
            <p v-if="clickedDemo && !consent">Please consent first.</p>
            <p style="margin-top: 15px">
              <a href="https://www.designinformatics.org/" target="_blank"><img class="logo" src="../assets/ed.png" style="width: 200px"/></a><br>
              <a href="https://uclab.fh-potsdam.de/" target="_blank"><img class="logo" src="../assets/fh.png" style="width: 40%"/></a>
            </p>
        </div>

        <div class="animatorWrapper" :style= "[consent ? {height: '100vh'} : {height: 0}]"></div> 

        <div  id="progressTarget" class="explorationWrapper w400" :style= "[consent ? {height: '100vh'} : {height: 0}]"   data-step="2"> 
          <explore v-if="consent" :display="testPath" @toggleForm="toggleForm" />
        </div>

        
        <div id="addTarget" class="formWrapper w400" :style= "[consent ? {height: '100vh'} : {height: 0}]" data-step="3">
          <memoryForm
            v-if="consent && newMemory.showForm"
            @close="toggleForm(false)"/>
        </div>
      </template>



    </Scrollama>

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
import 'intersection-observer' // for cross-browser support
import Scrollama from 'vue-scrollama'
import interactionService from '@/services/interactionService'

//get components
import memoryForm from './memoryForm'
import memoryList from './memoryList'
import explore from './explore'
import survey from './survey'
import counter from './counter'
import vis from './vis'

export default {
  name: 'App',
  components: {
    Scrollama,
    memoryForm,
    counter,
    explore,
    memoryList,
    survey,
    vis
  },

  data () {
    return {
      mounted: false, //turns true after the first lifecycle has run (and allows to render everything in the DOM)
      consent: false, //only start recording after people consent
      currentStepId: 0, //what part of the page are we in?
      steps: Array(3).fill(0),
      progress: 0,
      ribbonText: "Help our research",
      initialClickOnAddButton: false,
      clickedDemo: false,
    }
  },

  computed: {
    dimensions: function() {return this.$store.state.dimensions},
    cases:      function() {return this.$store.state.cases},
    newMemory:   function() {return this.$store.state.newMemory},
    context:   function() {return this.$store.state.context},
    memories:   function() {return this.$store.state.memories},
    testPath:   function() {return this.$store.state.session.path},
    session: function() { return this.$store.getters.session.hash},
    countries:  function() {
      return this.$store.state.countries.map(country => {
        return {
          text: country.name + " (" + country.n_memories + ")",
          value: country.name
        }
      })
    },

  },
 
  mounted () {
    this.mounted = true;    
      window.setInterval(() => {
        if (this.ribbonText == "Help our research") {
          this.ribbonText = "Do our survey"
        } else {
          this.ribbonText = "Help our research"
        }
  }, 10000)

  },



  methods: {
    enter: function(target) { //by clicking the "I agree"-button

    this.consent = true
    interactionService.sendInteraction({event: 'consent'})

      /*switch(this.testPath) {
        case "data-discourse-question":
          this.explore = true;
          break;
        case "data-question-discourse": 
          this.$store.commit("toggleForm",true)
        break;
    } */
      
      this.$nextTick(() => { //wait until consent = true has taken effect and the DOM has rendered all objects
        this.$vuetify.goTo(target, {duration: 2000}); //then scroll to them
      });
    },

    highlightConsent: function() { //highlight consent button when clicking demo content
       this.clickedDemo = true
    },

    stepEnterHandler({element, direction}) {//handle scrolling from step to step
      
      
      switch(element.className) {
        case "introWrapper": 
          this.progress = 0
          break
      }

      if(direction == 'up' && element.className.includes('explorationWrapper')) this.$store.commit("toggleNewMemoryDatepicker",false)
      if(direction == 'down' && element.className.includes('formWrapper') && this.initialClickOnAddButton) this.$store.commit("toggleNewMemoryDatepicker",true)

      this.currentStepId = element.dataset.step //store current step in data
    },

    stepProgressHandler({element, progress}) { //handle scrolling with progress
    //console.log(element.className, this.consent)
    
      if(element.className == "animatorWrapper" && this.consent) { //if visitor has consentent AND were scrolling over the animatorWrapper
      
        let showElementsNumber = Math.ceil(progress * this.memories.length) //compute number of memories to show (min: 0, max: all memories)
        this.progress = showElementsNumber
      }
      
    },

    toggleForm: function() { //using an own method instead of inline assignment to stay sane
      this.initialClickOnAddButton = true
      interactionService.sendInteraction({event: (this.newMemory.showForm) ? 'hide' : 'show', element: "memoryForm"})
      if(!this.newMemory.showForm) {
        this.$store.commit("toggleForm",true)
        this.$store.commit("toggleNewMemoryDatepicker",true)
       this.$nextTick(() => { //wait until consent = true has taken effect and the DOM has rendered all objects
          this.$vuetify.goTo("#addTarget", {duration: 2000}); //then scroll to them
        })
      } else {
        this.$store.commit("toggleForm",false)
        this.$vuetify.goTo("#progressTarget", {duration: 500}); //then scroll to them
      }
    },
  }
}
</script>

<style src="vue-scrollama/dist/vue-scrollama.css"></style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;900&display=swap');

.introWrapper, .explorationWrapper, .formWrapper {
  padding-top: 10px;
  padding: 40px 0px 0px 30px;
  z-index: 99;
  position: relative;
  
}

.introWrapper {
  height: 100vh;
}

.w400 {
  width: 400px;
}

.w600 {
  width: 600px;
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

button, .v-input, .introWrapper {
  pointer-events: all;
}

.ear {
  position: fixed;
  text-align: center;
  top: 40px; 
  right: -50px;
  z-index: 99;
  font-family: 'Roboto Slab', serif;
  height: 40px;
  line-height: 40px;
  transform: rotate(45deg);
  width: 210px;
  background: #FA5E2D;
  pointer-events: all;
  color: white !important;
  box-shadow: 10px 5px 5px rgba(0,0,0,.1);
}

h1{
  margin: 10px 0 10px 0px;
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
  z-index: -990
}


.hashtags, .visWrapper, .formWrapper {
  pointer-events: all;
}

.hashtags {
  line-height: 100%;
}

#app {
  width: 100%;
  background: #FFEBC6;
  min-height: 100%;
  height: 100%;
}

.logo {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
}

.stepnavi {
  position: fixed;
  top: 60px;
  left: 10px;
  margin: 0;
  padding: 0;
}
.stepnavi li {
  margin: 0;
  padding: 0;
  display: block;
  line-height: 15px;
  color: #FA5E2D;
  font-size: 20px;
}
  </style>
