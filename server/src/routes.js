const MemoryController = require('./controllers/memoryController')
const CaseController = require('./controllers/caseController')
const InteractionController = require('./controllers/interactionController')
const ContextController = require('./controllers/contextController')
const DebugController = require('./controllers/debugController')



module.exports = (app) => {
  app.get('/debug',DebugController.debug)

  app.post('/sendMemory',MemoryController.sendMemory)
  app.post('/getMemories',MemoryController.getMemories)
  app.post('/upvoteMemory',MemoryController.upvoteMemory)
  app.post('/flagMemory',MemoryController.flagMemory)
  app.post('/countryMemories',MemoryController.countryMemories)

  app.post('/getCases',CaseController.getCases)
  app.post('/getCountries',CaseController.getCountries)

  app.post('/sendInteraction',InteractionController.sendInteraction)

  app.post('/getContexts',ContextController.getContexts)
  app.post('/countryContexts',ContextController.countryContexts)
}
