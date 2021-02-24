const express = require('express')
const axios = require('axios');
const {sequelize} = require('./models')
//const app = express()

/*sequelize.models.Case.bulkCreate([
  { date: date, cumulative: 100, country: "bums" },
  { date: date, cumulative: 2020, country: "bums" },
  { date: date, cumulative: 1947, country: "bums" },
]).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
  return sequelize.models.Case.findAll({
    where: {
      country: "bums"
    },
  });
}).then(cases => {
  console.log(cases) // ... in order to get the array of user objects
})*/






/*axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=all")
.then(response => {
  console.log(response.data)
  //parse(response.data)
})
.catch(error => {
  console.log(error)
});*/

let world = require('./temp/world.json') //no need do ann oy the api
parse(world)

let allArr = []



function parse(data) {
  countryArr = []
  Object.keys(data).forEach(key => {
    if(key == 'cases') { //only do cases for now....
      Object.keys(data[key]).forEach(date => {
        countryArr.push({date: date, cummulative: data[key][date]})
      })
    }
  })
  console.log(countryArr)

}
