//const {Interaction} = require('../models')

module.exports = {
    async debug (req, res) {
        try {
          console.log(req.body)
          res.send("API alive")
        } catch(err) {
          res.status(400).send({
            error: 'there was a problem, diggi'
          })
          console.log(err)
        }
      },
}
