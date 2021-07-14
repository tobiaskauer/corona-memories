<template>
<!--<transition name="survey">-->
<div class="wrapper" :style="'top: '+position+'px'">
  <v-row justify="end">
    <v-col cols="12" sm="4">
        <v-card style="font-family: 'Roboto Slab', serif; margin-right: 30px;" >
            
            <v-card-text style="padding-top: 0;">
                <div ref="visibleSecond" >
                    <p @click="activeStep = 'visibleThird'" style="cursor: pointer; padding: 15px; margin: 0;color: #FA5E2D; text-align: center">Help our research. <strong>Fill out the survey</strong></p>
                    <div style="position: absolute; right: 20px; top: 10px;">
                        <v-btn icon @click="close">
                            <v-icon center color="lightgrey" small>mdi-close-circle</v-icon>
                        </v-btn>
                    </div>
                </div>
                <hr style="margin-bottom: 10px;" />
                    <div ref="visibleThird">
                    <v-form>
                        <p><strong>What do you find most interesting in this visualization?</strong></p>
                        <v-checkbox
                        class="ma-0 pa-0"
                        v-for="option in options"
                        :key="option.key"
                        v-model="option.checked"
                        value="1"
                        dense
                        :label="option.response"
                        type="checkbox"
                        ></v-checkbox>
                        <v-textarea
                        name="input-7-1"
                        label="Does this help you better understand the pandemic?"
                        outlined
                        v-model="comment"
                        
                    ></v-textarea>
                    </v-form>
                    <template v-if="!status">
                        <v-btn
                            style="margin-bottom: 100px;"
                            block
                            color="primary"
                            @click="send" 
                            outlined>Submit
                        </v-btn>
                    </template>
                    <template v-else>
                        <v-alert text :type="status.type">
                            {{status.text}}
                        </v-alert>
                    </template>
                </div>
            </v-card-text>  
        </v-card>
    </v-col>
</v-row>  
</div>
<!--</transition>-->
</template>

<script>
import surveyService from '@/services/surveyService'

export default {
  data () {
    return {
        timeBeforeDisplay: 5000,
        mounted: false,
        activeStep: null,
        status: false,
        comment: "",
        options: [
            {response: "The case numbers and how they change over time.", key: "caseNumbers", checked: false},
            {response: "Exploring and reading the responses.", key: "responseRelation", checked: false},
         //   {response: "Just the responses.", key: "justReponses", checked: false},
            {response: "I do not find it interesting.", key: "nothing", checked: false},
        ],
    }
  },

  props: {
      display: String,
  },

 computed: {
    session: function() { return this.$store.getters.session.hash},
    position: function() {
        if(!this.mounted) return null

        if(status) return 0
        
        let scrollPosition = this.activeStep ? this.$refs[this.activeStep].scrollHeight : 0
        if(this.activeStep == 'visibleThird') scrollPosition = scrollPosition + this.$refs['visibleSecond'].scrollHeight + 40 //not only the element itself, but also the element above (and some buffer)
        return document.documentElement.clientHeight - scrollPosition
    }
 },

 mounted () {
     setTimeout(() => this.activeStep = "visibleSecond", this.timeBeforeDisplay);
     this.$nextTick(()=> {
         this.mounted = true
     })
 },

  methods: {
      close: function() {
          this.activeStep = 'visibleSecond'
          this.status = null          
      },
    async send() {
        let surveyData = {
            survey: 'reading',
            checkboxes: this.options.filter(checkbox => checkbox.checked).map(checkbox => checkbox.key).join(),
            //comment: (this.comment != "Why is this interesting to you (optional)") ? this.comment : ""
        }
        try {
        const response = await surveyService.sendSurvey(surveyData)
        if(response.status == 200) {
          this.status = {
              type: "success",
              text: "Thank you! Your response was recorded."
            } 
        }
      } catch (err) {
        console.log(err)
            this.status = {
              type: "error",
              text: "Sorry, there was a problem."
            }
      } 
      return null
    }
  }
}
</script>

<style scoped>
.wrapper {
  z-index: 1;
  position: fixed;
  bottom: -3px;
  width: 100%;
}

/*.survey-move {
    transform: ;
  transition: transform 1s;
}*/
</style>
