const {Context} = require('../models')
const { Sequelize } = require('sequelize');



module.exports = {
    async getContexts (req, res) {    
        let options = {
          attributes: (req.body.attributes) ? req.body.attributes : null,
          where: {},
          limit: (req.body.limit) ? req.body.limit : null,
        }
    
        if(req.body.country) { //if a country is passed
          options.where.country = req.body.country
        }
    
        if(req.body.country == "World") { //special country "world" --> ignore where clause
          options.limit = 200 
          delete options.where.country 
          options.order = Sequelize.literal('random()')
        }
        
        try {
          const context = await Context.findAll(options);
          
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
            order: [[Sequelize.col("country"), 'DESC']]
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
