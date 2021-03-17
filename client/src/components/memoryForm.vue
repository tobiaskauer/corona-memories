<template>
  <v-overlay>
    <v-card
      elevation="2"
      max-width="500"
      min-width="400"
      light
      class="mx-auto">
      <v-card-text v-if="status">
        <v-alert
          border="left"
          colored-border
          color="primary"
          elevation="2">
          {{status}}
        </v-alert>
        <v-btn block color="primary" outlined @click="close()">Cool!</v-btn>
      </v-card-text>
      <v-card-text v-else>
        <!-- story form -->
        <v-expansion-panels accordion focusable v-model="panel">
          <v-expansion-panel>
            <v-expansion-panel-header>(1) Add your story to the curve</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form style="padding: 10px 0">
                <v-textarea class="ma-0p pa-0" dense outlined v-model="comment"  label="Your Story" />
              </v-form>
              <p v-if="hashtags && showHashtags > 0" class="hashtags">
                Adding these (or other) tags to your story helps others to find it <br/>
                <v-chip
                  v-for="(hashtag, i) in hashtags.filter((e,i) => i<showHashtags).sort((a,b) => a.tag.localeCompare(b.tag))"
                  small
                  color="primary"
                  :outlined="!comment.includes(hashtag.tag)"
                  :style="{margin: '2px'}"
                  :key="'hashtag-'+i"
                 @click="addTag(hashtag.tag)">{{hashtag.tag}} </v-chip>
            <a @click="showHashtags = 20">show more</a></p>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <!-- metadata form -->
          <v-expansion-panel>
            <v-expansion-panel-header>(2) Tell us some more</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form  style="padding: 10px 0">
                <v-text-field v-model="name" dense outlined label="Name (optional)" />
                <v-select
                  :items="countries"
                  v-model="currentCountry"
                  dense
                  label="Your country"
                   outlined />
                <template v-if="!exactDate">
                <v-text-field
                  v-model="roughDate"
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
                        v-model="stringDate"
                        label="Pick a date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="stringDate"
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
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>        
          <v-btn style="margin: 10px 0" block color="primary" outlined @click="sendMemory">Send</v-btn>
          <v-btn :style="{left: '50%', transform:'translateX(-50%)'}" x-small @click="close()">cancel</v-btn>
      </v-card-text>
    <!--<v-date-picker v-model="picker"></v-date-picker>-->
    </v-card>
  </v-overlay>
</template>

<script>
import MemoryService from '@/services/memoryService'
export default {
  data () {
    return {
      comment: '',
      name: '',
      status: false,
      currentCountry: null,
      exactDate: false,
      stringDate: null,
      datepicker: false,
      panel: 0,
      showHashtags: 0,
    }
  },

  props: {
    country: String,
    countries: Array,
    hashtags: Array,
    date: String,
  },

  mounted() {
    this.stringDate = this.date
    this.currentCountry = this.country
  },

  computed: {
    roughDate: function(){
      if(!this.stringDate) return null
      let parsedDate = new Date(this.stringDate)

      let rough = "Late"
      if(parsedDate.getDate() <= 20) rough = "Mid"
      if(parsedDate.getDate() <= 10) rough = "Early"
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parsedDate.getMonth()]
        
      return rough+" "+month

    }
  },

  methods: {
    addTag: function(tag) {
      this.comment = this.comment + " " + tag

    },
    
    async sendMemory () {
      this.loading = true

      let payload = {
        comment: this.comment,
        date: new Date(this.date),
        name: this.name,
        country: this.country,
        id: null,
        exact: this.exactDate
      }      
      try {
        const response = await MemoryService.sendMemory(payload)
        
        if(response) this.loading=false
        if(response.status == 200) {
          this.status = "Your memory has been recorded"
        }

      } catch (err) {
        this.status = err.response.data.error
      }
    },

    close: function() {
      this.status = false
      this.$emit('close')
    }
  },

  watch: {
    comment: function(newComment) {
      if(newComment.length > 2 && this.showHashtags < 10) this.showHashtags = 10
    }
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
