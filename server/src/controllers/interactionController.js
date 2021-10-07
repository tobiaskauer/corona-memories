const { Interaction } = require('../models')

module.exports = {
  async sendInteraction(req, res) {
    try {
      let response = await Interaction.create(req.body) //write to sql based on pre-defined model
      res.send(response)
    } catch (err) {
      res.status(400).send({
        error: 'there was a problem, diggi'
      })
      console.log(err)
    }
  },

  async getInteractions(req, res) {
    try {
      const interactions = await Interaction.findAll();

      res.send(interactions)
    } catch(err) {
      res.status(400).send({
        error: 'there was a problem, diggi'
      })    
      console.log(err)
    }

  }
}
