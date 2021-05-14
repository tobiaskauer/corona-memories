const {Interaction} = require('../models')

module.exports = {
    async sendInteraction (req, res) {
        try {
          console.log(req.body)
          let response = await Interaction.create(req.body) //write to sql based on pre-defined model
          res.send(response)
        } catch(err) {
          res.status(400).send({
            error: 'there was a problem, diggi'
          })
          console.log(err)
        }
      },
}
