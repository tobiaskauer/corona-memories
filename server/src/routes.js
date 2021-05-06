const MemoryController = require('./controllers/memoryController')
const CaseController = require('./controllers/caseController')
const InteractionController = require('./controllers/interactionController')


module.exports = (app) => {
  app.post('/sendMemory',MemoryController.sendMemory)
  app.post('/getMemories',MemoryController.getMemories)
  app.post('/upvoteMemory',MemoryController.upvoteMemory)
  app.post('/flagMemory',MemoryController.flagMemory)

  app.post('/getCases',CaseController.getCases)
  app.post('/getCountries',CaseController.getCountries)

  app.post('/sendInteraction',InteractionController.sendInteraction)
}
