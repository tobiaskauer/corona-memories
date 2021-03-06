const axios = require('axios');
const {sequelize} = require('./models')



let changeNames = {
  "Iran": "Iran, Islamic Rep.",
  "Russia": "Russian Federation",
  "UAE": "United Arab Emirates",
  "USA": "United States",
  "UK": "United Kingdom",
  "Venezuela": "Venezuela, RB",
  "Slovakia": "Slovak Republic",
  "S. Korea": "South Korea",
  "Egypt": "Egypt, Arab Rep.",
  "Czechia": "Czech Republic",

  "cases": "absolute_cases",
  "deaths": "absolute_deaths",
  "recovered": "absolute_recovered",
}

let api = true //false will run from local backup without hogging api resources

if(api) {
  axios.get("https://disease.sh/v3/covid-19/historical?lastdays=all")
  .then(response => {
    let populations = require('./temp/worldbank-population.json')
    let countries = combine(response.data)
    countries = computeNewAndRelative(countries,populations)
    let all = createArr(countries,populations)
    writeToSQL(all)
  })
  .catch(error => {
    console.log(error)
  });
} else {
  let populations = require('./temp/worldbank-population.json')
  let provinces = require('./temp/countries.json')
  let countries = combine(provinces)
  showMissingCountries(countries,populations) //maybe add that for later
  countries = computeNewAndRelative(countries,populations)
  let all = createArr(countries,populations)
  //all = all.filter((d,i) => i<10000) //to test without performance issues
  //writeToSQL(all)
}


function writeToSQL(data) {
  sequelize.models.Case.count() //count current rows in db
  .then((c) => {

    if(c < data.length) { //if new scrape result has more
      sequelize.models.Case.destroy({ truncate : true, cascade: false }) //truncate old table
      sequelize.models.Case.bulkCreate(data) 
        .then(() => {
          console.log(`deleted ${c} cases, wrote ${data.length} new ones`)
        }) //write new table
      
    } else {
      console.log(`did not touch ${c} cases, because we only had ${data.length} new ones`)
    }
  })

}



function showMissingCountries(countries,populations) {
  //console.log(Object.keys(countries))
  //console.log(Object.keys(populations))

  Object.keys(countries).forEach(country => {
    if(Object.keys(populations).indexOf(country) == -1) console.log(country)
  })
}


function combine(provinces) {
  obj = {
    World: {timeline: {}}
  }
  /*let uniqueRegions = [...new Set(regions.map(r=>r.location))]
  uniqueRegions.forEach(region => {
    obj[region] = {timeline: {}}
  })*/


  Object.keys(provinces).forEach(province => {
    let row = provinces[province]
    let neww = row.timeline
    row.country = changeNames[row.country] ? changeNames[row.country] : row.country
    
    //let region = regions.find(x => x.country == row.country)
    //row.region = (region) ? region.location : ''

    if(!obj[row.country]) { //check if its the first one
      obj[row.country] = row  //if so, add
      Object.keys(row.timeline).forEach(metric => {
        if(!obj.World.timeline[metric]) obj.World.timeline[metric] = {} //add to world
        Object.keys(neww[metric]).forEach(date => {

          obj.World.timeline[metric][date] = //add to world
            (obj.World.timeline[metric][date] === undefined)
            ? neww[metric][date]
            : obj.World.timeline[metric][date] + neww[metric][date]
        })
      })
      
    } else { //if there is already one, combine the two
      let existing = obj[row.country].timeline
      Object.keys(neww).forEach(metric => {
        if(!obj.World.timeline[metric]) obj.World.timeline[metric] = {} //add to world
        Object.keys(neww[metric]).forEach(date => {
          existing[metric][date] = existing[metric][date] + neww[metric][date]

          obj.World.timeline[metric][date] = //add to world
            (obj.World.timeline[metric][date] === undefined)
            ? neww[metric][date]
            : obj.World.timeline[metric][date] + neww[metric][date]
        })
      })
      if(!obj[row.country].provinces) { //create array of included provinces
        obj[row.country].provinces = [row.province]
      } else {
        obj[row.country].provinces.push(row.province)
      }
      delete obj[row.country].province
    }
  })
  return obj
}
 
function computeNewAndRelative(countries, populations) { //compute new cases for each day
  Object.keys(countries).forEach(country => { //for every country
    let countryPop = !populations[country] ? 0 : populations[country].Population
    Object.keys(countries[country].timeline).forEach(metric => { //for every metric ("e.g. cases, deaths")
      let metricArr = Object.entries(countries[country].timeline[metric]) //create array so we can do i-1 for yesterdays value
      let newArr = [] //an array that get filles with number of new cases each day as we go (so we can compute the 7 day case numbers)
      Object.keys(countries[country].timeline[metric]).forEach((date,i) => { //go through all dates in timeline
        
        //compute new Cases
        let today = countries[country].timeline[metric][date] //get todays value
        let yesterday = (i>0) ? metricArr[i-1][1] : 0 //get yesterdays value
        let newMetric = "new_"+metric; //name for new timeline 
        if (!countries[country].timeline[newMetric]) countries[country].timeline[newMetric] = {} //if first value, create timeline object
        countries[country].timeline[newMetric][date] = today - yesterday //add value to timeline
        newArr.push(today - yesterday)

        //compute sum of Cases in last seven days relative to population
        let sevenDaySum = 0 //sum before we start counting
        let goXDaysBack = 7 //number of days to go back
        while (goXDaysBack > 0) { //while there are still days left to count
          if(i >= goXDaysBack) { //and we are not at the beginning of time
            sevenDaySum = sevenDaySum + newArr[i-goXDaysBack] //add value to sum
          }
          goXDaysBack-- //and count back one day less
        }
        let relativeMetric = "relative_"+metric; //name for new timeline 
        if (!countries[country].timeline[relativeMetric]) countries[country].timeline[relativeMetric] = {} //if first value, create timeline object
        countries[country].timeline[relativeMetric][date] =  Math.floor(sevenDaySum / countryPop * 100000)
      })
    })
  })
  return countries
}

function createArr (countries,populations) {
  let arr = []
  Object.keys(countries).forEach(country => { //for every country
    let countryPop = !populations[country] ? 0 : populations[country].Population
    Object.keys(countries[country].timeline).forEach((e,i) => { //for every metric ("e.g. cases, deaths")
      if(i == 0) {//only go through ONE metric, but loop them again in the timeline
        Object.keys(countries[country].timeline[e]).forEach(date => {
          obj = {
            country: country,
            date: new Date(date)
          }
          Object.keys(countries[country].timeline).forEach(metric => {
            newMetric = changeNames[metric] ? changeNames[metric] : metric

            obj[newMetric] = countries[country].timeline[metric][date]
          })
          if(countryPop > 0) arr.push(obj)
        })
      }
      /*Object.keys(countries[country].timeline[metric]).forEach(date => { //go through all dates in timeline
        
      })*/
    })
  })
  return arr
}