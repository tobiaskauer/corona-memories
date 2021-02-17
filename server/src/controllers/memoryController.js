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

  async getMemories (req, res) {
    try {
      const memories = await Memory.findAll({
        attributes: ['date', 'comment', 'weight', 'id'],
        where: {
          country: req.body.country
        },

      });
      res.send(memories)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured getting memories'
      })
    }
  },

}
