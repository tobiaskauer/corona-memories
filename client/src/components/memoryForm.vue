<template>
    <v-card
      elevation="2"
      min-width="400"
      max-width="560"
      id="top"
      light
      style="margin: 0px;"
      class="mx-left">

      
      <v-card-text v-if="returnID" style="padding-top: 0px">
        <v-card-title class="ma-0" style="padding-left: 0">
          Your story has been recorded.
          <v-spacer></v-spacer>
           <v-btn icon @click="close">
          <v-icon center color="lightgrey" small>mdi-close-circle</v-icon>
        </v-btn>
        </v-card-title>  
        <p>
          <strong>It will be visible soon.</strong> In the meantime, if you have a minute and want to help our research, please consider filling out our <a :href="'https://docs.google.com/forms/d/e/1FAIpQLSfydTg7ZpZG21s9in4M-mM_8BxA5mZm73K2p5KDshaAcRipgA/viewform?entry.62570228='+returnID" target="_blank">survey</a>.
        </p> 
        <v-btn small outlined color="primary" block :href="'https://docs.google.com/forms/d/e/1FAIpQLSfydTg7ZpZG21s9in4M-mM_8BxA5mZm73K2p5KDshaAcRipgA/viewform?entry.62570228='+session" target="_blank">Fill out Survey</v-btn>
        <v-btn small outlined color="primary" block @click="blankify" style="margin-top: 10px;">Add another story first</v-btn>
        
        <!--<v-alert
          border="left"
          colored-border
          color="primary"
          elevation="2">
           <a target="_blank" >this form</a>. Thank you!
        </v-alert>-->
      </v-card-text>
      <v-card-text v-else style="padding-top: 0px">
        <v-card-title class="ma-0" style="padding-left: 0">
          Add your story to the chart
          <v-spacer></v-spacer>
          <v-btn icon @click="close">
            <v-icon center color="lightgrey" small>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-form style="padding: 10px 0" v-model="isFormValid">
          <v-textarea
            class="ma-0 pa-0"
            dense
            outlined
            :rules="rules.notEmpty"
            v-model="comment"
            label="Your Story" />
            <p v-if="hashtags && showHashtags > 0" class="hashtags">
                Add these (or other) hashtags<br/>
                <v-chip
                  v-for="(hashtag, i) in hashtags.filter((e,i) => i<showHashtags).sort((a,b) => a.tag.localeCompare(b.tag))"
                  small
                  color="primary"
                  :outlined="!comment.includes(hashtag.tag)"
                  :style="{margin: '2px'}"
                  :key="'hashtag-'+i"
                 @click="addTag(hashtag.tag)">{{hashtag.tag}} </v-chip>
            <a v-if="hashtags.length >= showHashtags" @click="showHashtags = showHashtags + 5">show more</a></p>
          <v-autocomplete
                  :items="countries"
                  v-model="currentCountry"
                  dense
                  label="Your country"
                   outlined />
                <template v-if="!this.exactDate">
                <v-text-field
                  v-model="roughDate"
                  label="Date"
                  outlined
                  class="ma-0"
                  dense
                  hint="Move your mouse over the line to pick a date"
                  readonly
                ></v-text-field>
                </template>
                <template  v-else>
                  <v-menu
                    v-model="datepicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                      class="ma-0"
                        v-model="date"
                        :rules="rules.notEmpty"
                        label="Pick a date"
                        append-icon="mdi-calendar"
                        outlined
                        readonly
                        
                        dense
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      @input="datepicker = false"
                    ></v-date-picker>
                  </v-menu>
                </template>
                
               
               <v-checkbox
                class="ma-0"
                  v-model="exactDate"
                  label="Use exact date"
                ></v-checkbox> 
      </v-form>
      <v-btn
        :disabled="!isFormValid"
        style="margin: 10px 0"
        block
        color="primary"
        outlined
        @click="sendMemory">Send</v-btn>
      </v-card-text>
    </v-card>
    
      
  
</template>

<script>
import MemoryService from '@/services/memoryService'
import interactionService from '@/services/interactionService'
import * as d3 from 'd3'

export default {
  data () {
    return {
      panel: null,
      comment: '',
      name: '',
      parseDate: d3.utcParse("%Y-%m-%d"),
      formatDate: d3.timeFormat("%Y-%m-%d"),
      datepicker: false,
      showHashtags: 0,
      showDatehelp: false,
      roughDate: null,
      initial: 0, //hacky counter for list view
      returnID: null,
      isFormValid: false,
      rules: {
        notEmpty: [
          v => !!v || 'Please enter a memory!'
        ]
      }
    }
  },

  props: {
    country: String,
    display: String,
  },

  computed: {
    session: function() { return this.$store.getters.session.hash},
    hashtags:   function() {
      let hashtags = this.$store.state.hashtags
      if(hashtags.length < 5) hashtags = hashtags.concat(["lockdown", "stayhome", "socialdistancing", "quarantine", "covid"].map(tag => {return {occurences: 0, size: 10, tag: "#"+tag}}))
      
      return hashtags
    },
    countries:  function() {
      return this.$store.state.countries.map(country => {
        return {
          text: (country.name == "World") ? "(Select your country)" : country.name,
          value: country.name,
          disabled: (country.name == "World") ? true : false
        }
      })
    },

    currentCountry: {
      get() {
        return this.$store.state.currentCountry
      },
      set(country) {
        this.$store.dispatch('setCurrentCountry',country)
        interactionService.sendInteraction({event: 'select-country', element: country})

      }
    },

    exactDate: {
      set: function() {this.$store.commit('toggleNewMemoryExactDate')},
      get: function() {
        if(this.display == 'separated') {
          return true
        } else {
          return this.$store.state.newMemory.exactDate
        }  
      }
    },

    date: {
      set: function(newDate) {
        this.$store.commit('setNewMemoryDate',this.parseDate(newDate))
        },
      get: function() {
        return this.formatDate(this.$store.state.newMemory.date)
        }
    },

    /*roughDate: {
      get: function() {
      console.log(this.time)
      return this.getRoughDate(this.time)
    }
    },*/
    

    displayDate: {
      set: function(newDate) {console.log(newDate)/*,this.date = this.formatDate(newDate)*/},
      get: function() {
        console.log(this.date)
        return (this.exactDate) ? this.formatDate(this.date) : this.getRoughDate(this.date)
        }
    },


  },

  

  mounted() {
    
  },

  methods: {
    addTag: function(tag) {
      this.comment = this.comment + " " + tag

    },

    getRoughDate: function(dateString) {
      
      let parsedDate = new Date(dateString)

      let rough = "Late"
      if(parsedDate.getDate() <= 20) rough = "Mid"
      if(parsedDate.getDate() <= 10) rough = "Early"
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parsedDate.getMonth()]
  
      return rough+" "+month + " " + parsedDate.getFullYear()
    },
    
    async sendMemory() {
      interactionService.sendInteraction({event: 'sendMemory'})
      this.loading = true

      

      let payload = {
        comment: this.comment,  
        date: new Date(this.date),
        hash: this.$store.state.session.hash,
        country: this.currentCountry,
        exactDate: this.exactDate
      }      
      
      
      try {
        const response = await MemoryService.sendMemory(payload)
        if(response.status == 200) {
          this.$store.commit("toggleNewMemoryDatepicker", false)
          this.$store.dispatch("setMemories")

          this.returnID = response.data.id
          this.$vuetify.goTo("#top", {duration: 500}); 
          
        }

      } catch (err) {
        console.log(err)
        this.status = err.response.data.error
      }
    },

    close: function() {
      this.$store.commit("toggleNewMemoryDatepicker", false)
      this.returnID = null
      this.$emit('close')
    },

    blankify: function() {
      this.returnID = null
      this.comment = "" 
      this.$store.commit("toggleNewMemoryDatepicker", true)
    }
  },

  watch: {
    comment: function(newComment) {
      if(newComment.length > 2 && this.showHashtags < 10) this.showHashtags = 10
      console.log()
      let commentHashtags = newComment.match(/#[a-z]+/gi)
      if(commentHashtags) {
        console.log(commentHashtags)
      }
      
    },
    date: {
      immediate: true,
      deep: true,
      handler() {
        this.roughDate = this.getRoughDate(this.date)
        //this.displayDate = this.date.string
        //this.exactDate = this.date.exact
      }
    },

    /*displayDate: function() {
      this.$emit("pickDate",{
        string: this.displayDate,
        exact: this.exactDate
      })
    },

    exactDate: function() {
      this.$emit("pickDate",{
        string: this.displayDate,
        exact: this.exactDate
      })
    },*/
  }
}
</script>

<style scoped>
.font {
  font-family: 'Roboto Slab', serif !important;
}


  .v-expansion-panel--active>.v-expansion-panel-header {
    min-height: 16px
  }


.white {
  color: white !important;
}
</style>
