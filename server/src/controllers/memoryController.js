const { Sequelize, where } = require('sequelize');
const {Memory} = require('../models')


module.exports = {
  async sendMemory (req, res) {
    try {
      const memory = await Memory.create(req.body) //write to sql based on pre-defined model
      res.send(memory.toJSON())
      console.log(memory)
    } catch(err) {
      res.status(400).send({
        error: 'there was a problem, diggi'
      })
      console.log(err)
    }
  },

  async upvoteMemory (req, res) {
    try {
      Memory.update({ weight: Sequelize.literal('weight + 1') }, { where: { id: req.body.id } }); //update
      const memory = await Memory.findByPk(req.body.id, {attributes: ['weight']}) //get new weight
      res.send(memory) //return to client
    } catch(err) {
      res.status(400).send({
        error: 'there was a problem, diggi'
      })    
      console.log(err)
    }
  },


  async flagMemory (req, res) {
    try {
      const memory = await Memory.update({ flagged: req.body.flagged }, { where: { id: req.body.id } }); //update
      
      res.send(memory) //return to client
    } catch(err) {
      res.status(400).send({
        error: 'there was a problem, diggi'
      })    
      console.log(err)
    }
  },

  async countryMemories (req, res) {
    try {
      
      const countries = await Memory.findAll({
        attributes: ['country',[Sequelize.fn('COUNT', Sequelize.col("country")), "count"]],
        group: ['country'],
        //order: [[Sequelize.literal('count'), 'DESC']] //will get sorted in frontend
      });

      res.send(countries)
    } catch(err) {
      res.status(400).send({
        error: 'there was a problem, diggi'
      })    
      console.log(err)
    }
  },


  async getMemories (req, res) {    
    let options = {
      attributes: (req.body.attributes) ? req.body.attributes : null,
      where: {}
    }

    if(req.body.country) { //if a country is passed
      options.where.country = req.body.country
    }

    if (req.body.flagged) { //view: don't return flagged memories; review: only return flagged memories
      options.where.flagged = req.body.flagged
    }

    if (req.body.order) {
      options.order = req.body.order
    }

    if(req.body.country == "World") { //special country "world" --> ignore where clause
      options.limit = 500 
      delete options.where.country 
      options.order = Sequelize.literal('random()')
    }
    
    try {
      const memories = await Memory.findAll(options);
      res.send(memories)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured getting memories'
      })
    }
  },
}
