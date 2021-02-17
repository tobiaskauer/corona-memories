const {Memory} = require('../models')

module.exports = {
  async sendMemory (req, res) {
    try {
      const memory = await Memory.create(req.body) //write to sql based on pre-defined model
      //res.send(memory.toJSON())
    } catch(err) {
      res.status(400).send({
        error: 'there was a problem, diggi'
      })
      console.log(err)
    }


    /*res.send({
      message: `Your memory "${req.body.text}" was saved`
    })*/
  }
}
