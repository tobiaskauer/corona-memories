import Vue from 'vue'
import Vuex from 'vuex'
import caseService from '@/services/caseService'
import memoryService from '@/services/memoryService'
import * as d3 from 'd3'

Vue.use(Vuex)

let parseDate = d3.utcParse("%Y-%m-%d")

export default new Vuex.Store({
  state: {
    session: "", 
    countries: [], //list of country Strings
    currentCountry: "", //String of current country

    currentMetric: "relative_cases", //String of current metric ("new_", "relative_", "absolute_" cases and deaths)
    cases: [], //array of objects with daily cases for currentCountry

    memories: [], //array of objects with all memorie of currentCountry
    activeMemories: [], //array of memory ids (int)

    hashtags: [], //ranked array of objects with hashtags and number of occurences
    activeHashtag: "", //currently active Hashtag string (for greying inactive bubbles)
    
    dimensions: {width: 0, height: 0, top: 100, right: 40, bottom: 50, left: 400},
    scales: {}, //x, y, and radius

    newMemory: {
      exactDate: true
    }
  },

  getters: {
    activeMemories: state => {    
      return state.memories.filter(memory => state.activeMemories.includes(memory.id))
    },

    beeswarm: state => { 
      let fakeMemories = state.cases.map(day => { //generate some fixed invisible bubbles along the line chart (to space away real memories from line)
        return {
          fx: day.x,
          fy: day.y,
          isMemory: false,
          radius: 4
        }
      })

      let radius = d3.scaleLinear().domain(d3.extent(state.memories, d=>d.weight)).range([2,6])

      let memories = state.memories.map(memory => {
        let caseIndex = state.cases.findIndex(c => c.dateString == memory.dateString) //find cases that day
        memory.value = (caseIndex !== -1) ? state.cases[caseIndex].value : 0 //get value from there, otherwise assign 0
        memory.isMemory = true //to compare with fake memories when building a beeswarm
        memory.x = state.scales.x(memory.date) //get x position (based on date)
        memory.y = state.scales.y(memory.value) //get y position (based on case numbers that day)
        memory.radius = radius(memory.weight) //get radius based on weight
        memory.scale = 1

        //create organic shapes based on memory radis
        let wobbly = (v) => v + ((Math.random() * memory.radius/2) - memory.radius/4 )
        let top = wobbly(memory.radius)
        let right = wobbly(memory.radius)
        let bottom = wobbly(memory.radius)
        let left = wobbly(memory.radius)
        memory.d = `
          M 0 ${-top}
          C ${right/2} ${-top} ${right} ${-right/2} ${right} ${0}
          C ${right} ${bottom/2} ${bottom/2} ${bottom} ${0} ${bottom}
          C ${-left/2} ${bottom} ${-left} ${left/2} ${-left} ${0}
          C ${-left} ${-top/2} ${-top/2} ${-top} ${0} ${-top}
        `.replace(/(\r\n|\n|\r)/gm, "")
        
        return memory
      })

      if(memories.length > 0) { //wait until we have real memories before we return a swarm with fake ones
        let circles = memories.concat(fakeMemories)
        let force = d3.forceSimulation(circles)
          .force('forceX', d3.forceX(circle => circle.x).strength(.1))
          .force('forceY', d3.forceY(circle => circle.y).strength(.1))
          .force('collide', d3.forceCollide(circle => circle.radius + circle.radius/4))
  
        for(let i = 0; i <= 20; i++) {
            force.tick()
        }
        return circles
      } else {
        return []
      } 
    }
  },

  mutations: {
    setSession(state, payload)          {state.session = payload},
    setCases(state, payload)          {state.cases = payload},
    setCurrentCountry(state, payload) {state.currentCountry = payload},
    setCountries(state,payload)       {state.countries = payload},
    setActiveHashtag(state,payload)    {state.activeHashtag = payload},
    setActiveMemories(state,payload) {
      let index = state.activeMemories.findIndex(id => id == payload)
      if(index === -1) { //add if it does noes exist
        state.activeMemories.push(payload)
      } else {
        state.activeMemories.splice(index,1) //delete if it already exists (clicked on close/clicked on bubble)
      }
    },

    setMemories(state, payload) {
      state.memories = payload.map(memory => {
        let hashtags = memory.comment.match(/#[a-z]+/gi) //return array of all hashtags in comment
        memory.hashtag = hashtags ? hashtags[0] : null //TODO: use whole array, not just first string
        memory.date = parseDate(memory.dateString) //parse String to Date
        return memory
      })
    },

    setDimensions(state,payload) {
      if(payload.width) state.dimensions.width = payload.width
      if(payload.height) state.dimensions.height = payload.height
      if(payload.left) state.dimensions.left = payload.left
    },

    setScales(state) {
      let dimensions = state.dimensions 
      let yDomain = [0,d3.max([50,d3.max(state.cases, d=>d.value)])] //minimum of 50 cases to have a somewhat consistent layout
      let xDomain = d3.extent(state.cases, d=>d.date)

      let x = d3.scaleTime().domain(xDomain).range([dimensions.left,dimensions.width-dimensions.right])
      let y = d3.scaleLinear().domain(yDomain).range([dimensions.height-dimensions.bottom-dimensions.top,dimensions.top])
      
      state.scales = {x: x, y: y}
    },

    toggleNewMemoryExactDate(state) {
      state.newMemory.exactDate = !state.newMemory.exactDate
    },

    setHashtags(state,payload) {
      let tags = payload.map(memory => memory.comment.match(/#[a-z]+/gi)).flat().filter(tag => tag) //find all comments with hashtags
      let counted = tags.reduce((a, b) => (a[b] = (a[b] || 0) + 1, a), {}) //count occurence of single hashtags
      let ranked = Object.keys(counted)
        .map(tag => {return {tag: tag, occurences: counted[tag]}}) //turn into array
        .sort((a,b) => b.occurences - a.occurences) //sort that array
      let scaleSize = d3.scaleLinear().domain(d3.extent(ranked,r=>r.occurences)).range([5,15]) //create scale for font sze of hashtags
      ranked.forEach(hashtag => hashtag.size = scaleSize(hashtag.occurences)) //assign font size to each hashtag
      
      state.hashtags = ranked
    },

  },

  actions: {
    async setCases (context) {
      let cases = (await caseService.getCases({
        country: context.state.currentCountry,
        metric: context.state.currentMetric}
      )).data.map(c =>{
        return {
          dateString: c.d,
          date: parseDate(c.d),
          value: c.v,
        } 
      })
      context.commit('setCases',cases) //write case numbers to state
      context.commit('setScales') //also compute new scales with these case numbers
    },

    async setMemories (context) {
      let memories = (await memoryService.getMemories({
        attributes: [['date', 'dateString'], 'exactDate', 'comment', 'weight', 'id'],
        country: context.state.currentCountry,
        flagged: false //don't include memories flagged for review
        })).data
        context.commit('setMemories',memories) //write memories to state
        context.commit('setHashtags',memories)  //also compute new hashtags from these memories
    },

    async setCountries (context) {
      //let countries = (await caseService.getCountries()).data.map(e => e.country) //get countries once when mounting (no need to to this reactive)
      let countries = ['World','Germany','France','Italy','United States','United Kingdom','Switzerland']
      context.commit('setCountries',countries)
    },

    setCurrentCountry(context,country) {
      context.commit('setCurrentCountry',country)
      context.dispatch('setCases')
      context.dispatch('setMemories')
    },

    setDimensions(context,payload) {
      context.commit('setDimensions',payload)
      context.commit('setScales')
    }
  }
})
