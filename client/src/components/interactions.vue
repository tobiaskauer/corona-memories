<template>
  <v-app>
    <v-container>
      <h1>Review Interactions</h1>
      <p>There are {{interactions.length}} interactions from {{uniqueArray.length}} unique sessions after launch on Oct 7th 2021:</p>
      
      <v-data-table
        :headers="headers"
        :items="interactions"
        :items-per-page="25"
        class="elevation-2"
      >
      </v-data-table>
    </v-container>
  </v-app>
</template>

<script>
import Vue from "vue";
import interactionService from "@/services/interactionService";
import AsyncComputed from "vue-async-computed";
Vue.use(AsyncComputed);

export default {
  data() {
    return {
      headers: [
        { text: "id", value: "id" },
        { text: "hash", value: "hash" },
        { text: "path", value: "path" },
        { text: "event", value: "event" },
        { text: "element", value: "element" },
        { text: "createdAt", value: "createdAt" },
      ],
      interactions: [],
      launchDate: new Date("10-07-2021"),
      uniqueArray: []
    };
  },

  asyncComputed: {
    async asyncInteractions() {
      return (await interactionService.getInteractions()).data;
    },
  },

  methods: {
    getDate(timestampedString) {
      let timestamp = new Date(timestampedString);

      let string =
        timestamp.getFullYear() +
        "/" +
        timestamp.getMonth() +
        "/" +
        timestamp.getDay();
      return string;
    },
  },

  watch: {
    asyncInteractions: function (interactions) {
      interactions = interactions.filter((interaction) => { 
        let interactionDate = new Date(interaction.createdAt)
        return interactionDate >= this.launchDate
      });

      let unique = {};
      interactions.forEach(interaction => {
        if(!unique[interaction.hash]) {
          unique[interaction.hash] = 1
        } else {
          unique[interaction.hash]++
        }
      })

      this.uniqueArray = Object.keys(unique).map(hash => {
        return {
          hash: hash,
          count: unique[hash]
        }
      })

      this.interactions = interactions;
      
    },
  },
};
</script>

<style scoped>
</style>
