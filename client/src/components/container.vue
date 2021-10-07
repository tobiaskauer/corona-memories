<template>
  <v-app :style= "[consent ? {position: 'static'} : {position: 'fixed'}]">
    <template v-if="cases && memories && countries && mounted">
      <v-overlay id="about" z-index="1000" v-if="showAbout">
        <v-card elevation="4" light style="width: 80%; min-width: 400px; height: 80%; margin: 5% auto; overflow-y: scroll">
          <v-system-bar color="primary" dark>
            <v-spacer></v-spacer>
            <v-btn icon @click="toggleAbout(false)">
          <v-icon color="lightgrey" small>mdi-close-circle</v-icon>
        </v-btn>
          </v-system-bar>
          <v-card-title><h2>About this research</h2></v-card-title>
          <v-card-text>
            <p>
              We are interested how people read and engage with different kinds of contextual information in data visualizations.<br>
              If you have comments or suggestions about this research please contact Tobias Kauer at T.Kauer@ed.ac.uk.<br>
              <ul>
                <li>CoViD data from <a href="https://coronavirus.jhu.edu">John Hopkins University</a> via <a href="https://disease.sh">https://disease.sh</a></li>
                <li>Policy responses from <a href="https://www.coronanet-project.org/">https://www.coronanet-project.org/</a></li>
              </ul>

            </p>
            <h3>Participant Information Sheet</h3>
            <p>
              <strong>Project Title</strong>: Corona Memories<br />
              <strong>Principal Investigator</strong>: Dr. Benjamin Bach<br />
              <strong>Researchers</strong>: Tobias Kauer, Dr. Marian Dörk<br>
            </p>

            <p>This study was certified according to the <a href="https://web.inf.ed.ac.uk/infweb/research/ethics-and-integrity/ethics-procedure">Informatics Research Ethics Process</a>, RT number 5766. Please take time to read the following information carefully. You should keep this page for your records.</p>
            <p><strong><em>Who are the researchers?</em></strong> The study is being conducted by <a href="https://aviz.fr/~bbach/homepage/index-homepage.html">Dr. Benjamin Bach</a> and <a href="https://tobiaskauer.org">Tobias Kauer</a> at the <a href="https://www.ed.ac.uk/">University of Edinburgh</a> and <a href="https://mariandoerk.de/">Dr. Marian Dörk</a>, <a href="https://uclab.fh-potsdam.de/">University of Applied Sciences Potsdam</a>.</p>
            <p><strong><em>What is the purpose of the study?</em></strong> This study aims to understand  how people read data visualizations and which stories they want to tell about the data in the visualization. 
            <p><strong><em>Why have I been asked to take part?</em></strong> You have visited the website <a href="https://coronamemories.tobiaskauer.org">https://coronamemories.tobiaskauer.org</a>.<p>

            <p><strong><em>Do I have to take part?</em></strong> Your participation and use of the website is entirely voluntary and you may stop using it at any time and for any reason. Your rights will not be affected. If you wish to withdraw, contact Tobias Kauer (<a href="mailto:T.Kauer@ed.ac.uk">T.Kauer@ed.ac.uk</a>) and state which comment you wish to remove. If you stop participating at any point, data collection will end, but data already collected will be retained in anonymous form. We will stop using your data in any publications or presentations submitted after you have withdrawn consent. However, we will keep copies of your original consent, and of your withdrawal request.</p>
            <p><strong><em>What will happen if I decide to take part? </em></strong>We will record your activity (timestamps and mouse events) on the website as well as collect your shared stories. If you decide to take part in the online survey, we will ask you about your experience viewing the visualization on the website mentioned above and may use your answers in future research publications. If you choose to submit a story to the website, we may use your submission in future research publications. </p>
            <p><strong><em>Are there any risks associated with taking part?</em></strong> There are no significant risks associated with participation. </p>
            <p><strong><em>Are there any benefits associated with taking part?</em></strong> You will support publicly funded research on creating interfaces for commenting on visualizations.</p>
            <p><strong><em>What will happen to the results of this study? </em></strong> The results of this study may be summarised in published scientific articles, reports and presentations. With your consent, short extracts of submitted stories and written feedback from the survey may be quoted in research papers to support key findings of  our research. Your data may be archived for a minimum of two years. None of the publications will provide any monetary benefit to the research team and we are happy to send you a copy of any publication that emerged out of our study.</p>
            <p><strong><em>Data protection and confidentiality.</em></strong> Your data will be processed in accordance with Data Protection Law. Your data will be referred to by a unique participant number rather than by name. Your data will only be viewed by the research team stated above. All electronic data will be stored on a password-protected encrypted computer, on the School of Informatics’ secure file servers, or on the University’s secure encrypted cloud storage services (DataShare, ownCloud, or Sharepoint).</p>
            <p><strong><em>What are my data protection rights?</em></strong> The University of Edinburgh is a Data Controller for the information you provide. You have the right to access information held about you. Your right of access can be exercised in accordance with the Data Protection Law. You also have other rights including rights of correction, erasure and objection. For more details, including the right to lodge a complaint with the Information Commissioner’s Office, please <a href="visit www.ico.org.uk">visit www.ico.org.uk</a>. Questions, comments and requests about your personal data can also be sent to the University Data Protection Officer at <a href="mailto:dpo@ed.ac.uk">dpo@ed.ac.uk</a>. </p>
            <p><strong><em>Who can I contact?</em></strong> If you have any further questions about the study, please contact the lead researcher, Tobias Kauer at <a href="mailto:T.Kauer@ed.ac.uk">T.Kauer@ed.ac.uk</a>. If you wish to make a complaint about the study, please contact inf-ethics@inf.ed.ac.uk. When you contact us, please provide the study title and detail the nature of your complaint.</p>
            <p><strong><em>Updated information.</em></strong> If the research project changes in any way, an updated Participant Information Sheet will be made available on <a href="https://web.inf.ed.ac.uk/infweb/research/study-updates">https://web.inf.ed.ac.uk/infweb/research/study-updates</a>.</p>
            <p><strong><em>Alternative formats</em></strong> To request this document in an alternative format, such as large print or on coloured paper, please contact Tobias Kauer at <a href="mailto:T.Kauer@ed.ac.uk">T.Kauer@ed.ac.uk</a>.</p>
            <p><strong><em>General information.</em></strong> For general information about how we use your data, go to: <a href="https://edin.ac/privacy-research">edin.ac/privacy-research</a></p>
          </v-card-text>
        </v-card>
      </v-overlay>

      
        <!--<div class="ear" @click="showAbout = true" style="cursor: pointer">
          <span>about</span>
        </div>-->

        <!--<div class="nav">
          <span id="burger">
            <svg height="32px" id="Layer_1" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg>
          </span>
          <div class="">
            <ul>
              <li>Version A</li>
              <li>Bersion B</li>
              <li>Version C</li>
            </ul>
          </div>
        </div>-->

        
          <mymenu @toggleAbout="toggleAbout($event)" v-if="consent" />
        
      
      
      <ul class="stepnavi">
        <li v-for="e,i in steps" :key="i">
          <span v-if="i == currentStepId-1">&#9679;</span>
          <span v-else>&#9675;</span>
          </li>
      </ul>

      <span class="imprintabout" @click="toggleAbout(true)">about & imprint</span>


      
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
        v-if="memories.length > 0"
          :progress="progress"
          :consent="consent"
          :display="testPath"
          @demoClick="highlightConsent" />
      </div>

        <div class="introWrapper w400" data-step="1" :style="{width: dimensions.left}">  
          <h1>corona<br /><span>memories</span></h1>
          <p class="larger">How do we remember the pandemic?</p>
          <p>Since it started <strong>about <counter /> days</strong> ago we are confronted with charts about new cases daily. But what are the human stories behind the numbers?</p>
          <p class="smaller">The research is conducted by Tobias Kauer (University of Edinburgh), Benjamin Bach (University of Edinburgh), and Marian Dörk (Potsdam University of Applied Sciences). It has been granted approval by the ethics committee. By clicking the button, you indicate that you are a speaker of English and at least 18 years old. You have read the <span style="text-decoration: underline; cursor: pointer" @click="toggleAbout(true)">information letter</span> and you voluntarily agree to participate, and understand you can stop your participation at any time. You agree that your anonymous data may be kept permanently in Edinburgh University archived and may be used by qualified researchers for teaching and research purposes.</p>
            <v-btn class="transition-swing" :elevation="clickedDemo ? 10 : 0" color="primary" outlined @click="enter('#progressTarget')">
              <v-icon small>mdi-check-circle</v-icon>
             I agree, show me
            </v-btn>
            <p v-if="clickedDemo && !consent">Please consent first.</p>
            <p style="margin-top: 15px">
              <a href="https://www.designinformatics.org/" target="_blank"><img class="logo" src="../assets/ed.png" style="width: 200px"/></a><br>
              <a href="https://uclab.fh-potsdam.de/" target="_blank"><img class="logo" src="../assets/fh.png" style="width: 40%; margin-top: 10px;"/></a>
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
          <p class="smaller">The research is conducted by Tobias Kauer (University of Edinburgh), Benjamin Bach (University of Edinburgh), and Marian Dörk (Potsdam University of Applied Sciences). It has been granted approval by the ethics committee. By clicking the button, you indicate that you are a speaker of English and at least 18 years old. You have read the <span style="text-decoration: underline; cursor: pointer" @click="toggleAbout(true)">information letter</span> and you voluntarily agree to participate, and understand you can stop your participation at any time. You agree that your anonymous data may be kept permanently in Edinburgh University archived and may be used by qualified researchers for teaching and research purposes.</p>
            <v-btn class="transition-swing" :elevation="clickedDemo ? 10 : 0" color="primary" outlined @click="enter('#progressTarget')">
              <v-icon small>mdi-check-circle</v-icon>
             I agree, show me
            </v-btn>
            <p style="margin-top: 15px">
              <a href="https://www.designinformatics.org/" target="_blank"><img class="logo" src="../assets/ed.png" style="width: 200px"/></a><br>
              <a href="https://uclab.fh-potsdam.de/" target="_blank"><img class="logo" src="../assets/fh.png" style="width: 40%; margin-top: 10px;"/></a>
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
          <p class="smaller">The research is conducted by Tobias Kauer (University of Edinburgh), Benjamin Bach (University of Edinburgh), and Marian Dörk (Potsdam University of Applied Sciences). It has been granted approval by the ethics committee. By clicking the button, you indicate that you are a speaker of English and at least 18 years old. You have read the <span style="text-decoration: underline; cursor: pointer" @click="showAbout = true">information letter</span> and you voluntarily agree to participate, and understand you can stop your participation at any time. You agree that your anonymous data may be kept permanently in Edinburgh University archived and may be used by qualified researchers for teaching and research purposes.</p>
            <v-btn class="transition-swing" :elevation="clickedDemo ? 10 : 0" color="primary" outlined @click="enter('#progressTarget')">
              <v-icon small>mdi-check-circle</v-icon>
             I agree, show me
            </v-btn>
            <p v-if="clickedDemo && !consent">Please consent first.</p>
            <p style="margin-top: 15px">
              <a href="https://www.designinformatics.org/" target="_blank"><img class="logo" src="../assets/ed.png" style="width: 200px"/></a><br>
              <a href="https://uclab.fh-potsdam.de/" target="_blank"><img class="logo" src="../assets/fh.png" style="width: 40%; margin-top: 10px;"/></a>
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
import mymenu from './menu'

export default {
  name: 'App',
  components: {
    Scrollama,
    memoryForm,
    counter,
    explore,
    memoryList,
    survey,
    vis,
    mymenu
  },

  props: {
    testPath: String
  },

  data () {
    return {
      mounted: false, //turns true after the first lifecycle has run (and allows to render everything in the DOM)
      consent: false, //only start recording after people consent
      currentStepId: 0, //what part of the page are we in?
      steps: Array(3).fill(0),
      progress: 0,
      showAbout: false,
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
  },



  methods: {
    enter: function(target) { //by clicking the "I agree"-button
      this.consent = true
      interactionService.sendInteraction({event: 'consent'})      
      this.$nextTick(() => { //wait until consent = true has taken effect and the DOM has rendered all objects
        this.$vuetify.goTo(target, {duration: 2000}); //then scroll to them
      });
    },

    highlightConsent: function() { //highlight consent button when clicking demo content
       this.clickedDemo = true
    },

    toggleAbout: function(state) {
      this.showAbout = state
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
  },

}
</script>

<style src="vue-scrollama/dist/vue-scrollama.css"></style>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;900&display=swap');

</style>
<style scoped>

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
  top: 15px; 
  right: -70px;
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
  z-index: -1000
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

  #about >>> .v-overlay__content {
    width: 100%;
    height: 100%;
  }

  #about h2, #about h3 {
  margin: 10px 0 10px 0px;
  font-family: 'Roboto Slab', serif;
  font-weight: 700;
  line-height: 30px;
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

.imprintabout {
  position: fixed;
  bottom: 10px;
  left: 20px;
  pointer-events: all;
  z-index: 100;
  cursor: pointer;
  font-size: 9pt;
  font-family: 'Roboto Slab', serif;
}
  </style>
