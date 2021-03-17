const { Sequelize } = require('sequelize');
const {Memory} = require('../models')


module.exports = {
  async sendMemory (req, res) {
    try {
      const memory = await Memory.create(req.body) //write to sql based on pre-defined model
      res.send(memory.toJSON())
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

  async getMemories (req, res) {
    let attributes = ['date', 'author', 'exactDate', 'comment', 'weight', 'id']
    let options = null
    if(req.body.country == "World") {
      options = {
        attributes: attributes,
        order: Sequelize.literal('random()'), limit: 500
      }
    } else {
      options = {
        attributes: attributes,
        where: {country: req.body.country},
      }
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
