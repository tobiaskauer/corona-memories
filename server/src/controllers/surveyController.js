const {Survey} = require('../models')

module.exports = {
    async sendSurvey (req, res) {
        try {
          let response = await Survey.create(req.body) //write to sql based on pre-defined model
          console.log(res.send(response))
        } catch(err) {
          res.status(400).send({
            error: 'there was a problem, diggi'
          })
          console.log(err)
        }
      },
}
