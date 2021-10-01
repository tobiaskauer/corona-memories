<template>
<div class="nav" v-if="displayMenu">
  <v-menu
            bottom
            left
            max-width="550px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
               
                light
                text
                v-bind="attrs"
                v-on="on"
              >
                
                <v-icon>mdi-menu</v-icon> change view
              </v-btn>
            </template>

            <v-list>
              <v-list-item two-line>
                <v-list-item-content >
                  <v-list-item-subtitle><em>How do people engage with context in data visualizations?</em></v-list-item-subtitle>
                   <v-list-item-subtitle>You are viewing one of three visualizations. Click below to change your view:</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            
            <a :href="$router.resolve({name: 'embedded'}).href">
              <v-list-item two-line :class="[(session.path == 'embedded') ? 'currentNav' : '']" @click="changeView('embedded')">
                <v-list-item-icon>
                 <img src="../assets/embedded-stories.png" />
                </v-list-item-icon>
                <v-list-item-content>
                  <!--<v-list-item-title>Embedded <strong>stories</strong></v-list-item-title>-->
                  <v-list-item-subtitle>People's memories about the pandemic</v-list-item-subtitle>
                  <v-list-item-subtitle>embedded in a visualization.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </a>
            <v-divider></v-divider>
            
            <a :href="$router.resolve({name: 'contextual'}).href">
              <v-list-item two-line :class="[(session.path == 'contextual') ? 'currentNav' : '']" @click="changeView('contextual')">
                <v-list-item-icon>
                 <img src="../assets/embedded-policies.png" />
                </v-list-item-icon>
                <v-list-item-content>
                  <!--<v-list-item-title>Embedded <strong>policies</strong></v-list-item-title>-->
                  <v-list-item-subtitle>Country's policy responses to the pandemic</v-list-item-subtitle>
                  <v-list-item-subtitle>embedded in a visualization.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              </a>
              <v-divider></v-divider>
            
            <a :href="$router.resolve({name: 'separated'}).href">
              <v-list-item two-line  :class="[(session.path == 'separated') ? 'currentNav' : '']"  @click="changeView('separated')">
                <v-list-item-icon>
                 <img src="../assets/separate-stories.png" />
                </v-list-item-icon>
                <v-list-item-content>
                  <!--<v-list-item-title><strong>Separate</strong> stories</v-list-item-title>-->
                  <v-list-item-subtitle>People's memories about the pandemic</v-list-item-subtitle>
                  <v-list-item-subtitle>as a list.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item two-line @click="$emit('toggleAbout',true)">
                <v-list-item-content style="text-align: right">
                  <v-list-item-title>About</v-list-item-title>
                  <v-list-item-subtitle>Created by Tobias Kauer, Benjamin Bach, and Marian Dörk</v-list-item-subtitle>
                   <v-list-item-subtitle>(University of Edinburgh, University of Applied Sciences Potsdam)</v-list-item-subtitle>
                   <v-list-item-subtitle>Click <span style="tet-decoration: underline">here</span> to learn more about this study</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </a>
            </v-list>
          </v-menu>
</div>
</template>

<script>
import interactionService from '@/services/interactionService'


export default {
  data () {
    return {
        displayMenu: false,
    }
  },

 computed: {
     session: function() { return this.$store.getters.session},
 },

 mounted () {     
       setTimeout(() => {
         this.displayMenu = true
       }, 50);
     
 },

  methods: {
    changeView: function(view) { 
      interactionService.sendInteraction({event: 'changeView', element: view})
      this.$store.commit("setSession",{hash: this.session.hash, path: view})
      this.$store.dispatch('setCountries')
      this.$store.dispatch('setMemories')
    },
  }
}
</script>

<style scoped>
.nav {
  position: fixed;
  text-align: center;
  top: 15px; 
  right: 10px;
  z-index: 99;
  
  
  
  pointer-events: all;
}

.currentNav {
  background: #FA5E2D;
}

.v-list-item__subtitle{
font-family: 'Roboto Slab', serif;
font-size: 1em;
}

.v-menu__content a {
  text-decoration: none !important;
}

.currentNav .v-list-item__title {
  color: white;
}

.v-btn {
  text-transform: none;
  font-weight: 400;
  letter-spacing: 0;
  font-family: 'Roboto Slab', serif;
}
</style>
