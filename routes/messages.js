var express = require('express');
var router = express.Router();

module.exports = (param)=>{
  
  const {io,mongoose} = param;

  mongoose.Promise = Promise;

  //Creating database Schema
  var Message = mongoose.model('Message',{
    name: String,
    message: String
  });
  

  /* GET users listing. */
  router.get('/', function(req, res, next) {
    Message.find({},(err,messages)=> {
      res.send(messages);
    });
    
  });

  router.post('/', async (req, res, next)=> {
    try {
      var message = new Message(req.body);

      var savedMessage = await message.save();
      
      console.log('saved');
        
      var censored = await Message.findOne({message:'badword'});
      
      if(censored)
        await Message.remove({_id: censored.id});
      else 
        io.emit('message',req.body);
        
      res.sendStatus(200);      
  
    } catch (error) {
      res.sendStatus(500);
      return console.err(error);
      
    }

  });

  return router;
}