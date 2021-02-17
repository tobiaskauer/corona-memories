const MemoryController = require('./controllers/memoryController')

module.exports = (app) => {
      app.post('/sendMemory',
        MemoryController.sendMemory
        //function(req, res){CommentController.foobar} // https://stackoverflow.com/questions/34853675/error-post-requires-callback-functions-but-got-a-object-undefined-not-work/56739792
      )
}
