const {Case} = require('../models')

module.exports = {
  async getCases (req, res) {
    try {
      const cases = await Case.findAll({
        where: {
          country: req.body.country
        },
        attributes: [
          ['date','d'],
          ['relative','r'],
          ['new','n'],
          ['cumulative','c'],
        ]
      });
      res.send(cases)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to show the songs'
      })
    }
  },

  async getCountries (req, res) {
    try {
      const cases = await Case.findAll({
        attributes: ['country'],
        group: ['country']
      });
      res.send(cases)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured showing the countries'
      })
    }
  },
}
