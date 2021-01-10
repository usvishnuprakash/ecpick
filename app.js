var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var userRouter=require('./routes/user')
var adminRouter=require('./routes/admin')
const Handlebars = require('handlebars');
var expressHbs=require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
var fileUpload=require('express-fileupload');
const { Db } = require('mongodb');
var db=require('./configure/connection')
var session=require('express-session')



var app = express();

// view engine setup
app.set('views', path.resolve(__dirname, 'views'));

app.set('view engine', 'hbs');
app.engine(
  "hbs",
  expressHbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: ".hbs",
    defaultLayout: "layout",
   
    layoutsDir:path.resolve(__dirname, 'views/layout/'),
    partialsDir:path.resolve(__dirname, 'views/partials/'),
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({secret:"key",cookie:{maxAge:60000}}))

app.use('/',adminRouter);
app.use('/', userRouter);

db.connect((err)=>{
  if(err) console.log('database is not connnected'+err)
  else console.log('database is connected')
})


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

module.exports = app;
