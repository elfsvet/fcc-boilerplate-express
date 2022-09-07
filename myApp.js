let express = require('express');
let app = express();
var path = require('path');
var bodyParser = require('body-parser')


console.log('Hello World')
// mounting express static middleware with app use and absolute path
app.use('/public', express.static(path.join(__dirname, '/public')));

// middleware to console.log all the methods and path and the ip.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ::ffff:${req.ip}`);
  next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const getTheCurrentTimeToString = () => new Date().toString();

const midWare =  (req, res, next) => {
    req.time = getTheCurrentTimeToString();
    next();
};

const finalHandler = (req,res)=>{
  res.send({time: req.time})
}




app.get('/', (req, res) => {
  // res.send('Hello Express')
  let absolutePath = path.join(__dirname, '/views/index.html');
  res.sendFile(absolutePath);
});
// GET /JSON
app.get('/json',(req, res) => {
  let myMessage = 'Hello json';
  if (process.env.MESSAGE_STYLE === 'uppercase') {
    res.json({ message: myMessage.toUpperCase() });
  } else {
    res.json({ message: myMessage });
  }
});

app.route('/now').get(midWare,finalHandler);


app.route('/:word/echo').get((req,res) => {
  let word = req.params.word
  res.json({echo: word})
})

app.route('/name').get((req,res)=>{
  console.log(req.query)
  let first = req.query.first;
  let last = req.query.last;
  res.json({name: `${first} ${last}`})
}).post((req,res)=>
  {
  let first = req.body.first;
  let last = req.body.last;
  res.json({name: `${first} ${last}`})
  })



 module.exports = app;
