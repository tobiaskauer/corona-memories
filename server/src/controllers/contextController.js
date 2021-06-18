const {Context} = require('../models')
const { Sequelize } = require('sequelize');



module.exports = {
    async getContexts (req, res) {    
        let options = {
          attributes: (req.body.attributes) ? req.body.attributes : null,
          where: {}
        }
    
        if(req.body.country) { //if a country is passed
          options.where.country = req.body.country
          options.limit = 200
        }
    
        if(req.body.country == "World") { //special country "world" --> ignore where clause
          options.limit = 200 
          delete options.where.country 
          options.order = Sequelize.literal('random()')
        }
        
        try {
          const context = await Context.findAll(options);
          console.log("foo")
          res.send(context)
        } catch (err) {
          console.log(err)
          res.status(500).send({
            error: 'an error has occured getting memories'
          })
        }
      },


      async countryContexts (req, res) {
        try {
          const countries = await Context.findAll({
            attributes: ['country',[Sequelize.fn('COUNT', Sequelize.col("country")), "count"]],
            group: ['country'],
            order: [[Sequelize.literal('count'), 'DESC']]
          });
    
          res.send(countries)
        } catch(err) {
          res.status(400).send({
            error: 'there was a problem, diggi'
          })    
          console.log(err)
        }
      },

      

}
