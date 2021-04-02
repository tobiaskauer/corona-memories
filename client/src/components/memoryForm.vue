<template>
    <v-card
      elevation="2"
      max-width="500"
      min-width="400"
      id="top"
      light
      class="mx-auto">

      
      <v-card-text v-if="returnID" style="padding-top: 0px">
        <v-card-title class="ma-0" style="padding-left: 0">
          Your story has been recorded.
          <v-spacer></v-spacer>
           <v-btn icon @click="close">
          <v-icon center color="lightgrey" small>mdi-close-circle</v-icon>
        </v-btn>
        </v-card-title>  
        <p>
          If you have a minute and want to help our research, please consider filling out our <a :href="'https://docs.google.com/forms/d/e/1FAIpQLSfydTg7ZpZG21s9in4M-mM_8BxA5mZm73K2p5KDshaAcRipgA/viewform?entry.62570228='+returnID" target="_blank">survey</a>.
        </p> 
        <v-btn small outlined color="primary" block :href="'https://docs.google.com/forms/d/e/1FAIpQLSfydTg7ZpZG21s9in4M-mM_8BxA5mZm73K2p5KDshaAcRipgA/viewform?entry.62570228='+returnID" target="_blank">Fill out Survey</v-btn>
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
            <a @click="showHashtags = 20">show more</a></p>
          <v-select
                  :items="countries"
                  v-model="currentCountry"
                  dense
                  label="Your country"
                   outlined />
                <template v-if="!this.exactDate">
                <v-text-field
                  :v-model="getRoughDate(displayDate)"
                  label="Date"
                  outlined
                  class="ma-0"
                  dense
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
                        v-model="displayDate"
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
                      v-model="displayDate"
                      @input="datepicker = false"
                    ></v-date-picker>
                  </v-menu>
                </template>
                
               
               <!--<v-checkbox
                class="ma-0"
                  v-model="exactDate"
                  label="Use exact date"
                ></v-checkbox> -->
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
export default {
  data () {
    return {
      panel: null,
      comment: '',
      name: '',
      currentCountry: null,
      datepicker: false,
      showHashtags: 0,
      returnID: null,
      displayDate: null,
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
    countries: Array,
    hashtags: Array,
    date: Object, //{date: {dateString: "01-01-2011", exact: false}}
  },

  computed: {
    exactDate: {
      set: function() {this.$store.commit('toggleNewMemoryExactDate')},
      get: function() {return this.$store.state.newMemory.exactDate}
    }
  },

  mounted() {
    this.currentCountry = this.country
  },

  methods: {
    addTag: function(tag) {
      this.comment = this.comment + " " + tag

    },

    getRoughDate: function(dateString) {
      console.log(dateString)
      let parsedDate = new Date(dateString)

      let rough = "Late"
      if(parsedDate.getDate() <= 20) rough = "Mid"
      if(parsedDate.getDate() <= 10) rough = " Early"
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parsedDate.getMonth()]
        
      return rough+" "+month
    },
    
    async sendMemory () {
      this.loading = true

      let payload = {
        comment: this.comment,  
        date: new Date(this.displayDate),
        country: this.currentCountry,
        exact: this.date.exact
      }      
      try {
        const response = await MemoryService.sendMemory(payload)
        if(response.status == 200) {
          this.returnID = response.data.id
          this.$vuetify.goTo("#top", {duration: 500}); 
        }

      } catch (err) {
        this.status = err.response.data.error
      }
    },

    close: function() {
      this.returnID = null
      this.$emit('close')
    },

    blankify: function() {
      this.returnID = null
      this.comment = "" 
    }
  },

  watch: {
    comment: function(newComment) {
      if(newComment.length > 2 && this.showHashtags < 10) this.showHashtags = 10
    },
    date: {
      immediate: true,
      deep: true,
      handler() {
        this.displayDate = this.date.string
        this.exactDate = this.date.exact
      }
    },

    displayDate: function() {
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
    },
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
