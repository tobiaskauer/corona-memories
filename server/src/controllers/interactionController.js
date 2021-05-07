const {Interaction} = require('../models')

module.exports = {
    async sendInteraction (req, res) {
        try {
          await Interaction.create(req.body) //write to sql based on pre-defined model
          res.status(200)
        } catch(err) {
          res.status(400).send({
            error: 'there was a problem, diggi'
          })
          console.log(err)
        }
      },
}
