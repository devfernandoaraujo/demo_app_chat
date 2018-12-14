var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var messagesRouter = require('./routes/messages');

var app = express();
//Mount socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

//MongoDb
var mongoose = require('mongoose');
var dbUrl = 'mongodb://user:User123@ds155160.mlab.com:55160/demo-chat-node';

//Database Conection
mongoose.connect(dbUrl,{useNewUrlParser:true},(err)=>{
  console.log('mongo db connection', err);
});

// view engine setup
// sets port 8080 to default or unless otherwise specified in the environment
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/messages', messagesRouter({io, mongoose}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection',(socket)=>{
  console.log('a user connected.');
});


http.listen(app.get('port'),()=>{
  console.log("Application running on port " + app.get('port'));
});

module.exports = app;
