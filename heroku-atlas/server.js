// Load dependencies
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Animal = require(`./models/animal.js`);

// Create express app
const app = express();
app.set('view engine','ejs')

// app.use is for using middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended : true }));

// Connect to DB
mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on('error', function(error){
  console.log(`Connection Error: ${error.message}`)
});

db.once('open', function() {
  console.log('Connected to DB...');

});

app.get('/animals', function(req, res){
  Animal.find(function(err, animals) {
    console.log(animals);
    res.render('./pages/animals', {animals: animals})
  });
})

app.post('/animals', function(req, res){
  const animal = new Animal(req.body);
  animal.save(function(err) {
    if (err) return res.status(500).send(err);
    return res.send(`<p>Thanks for the ${req.body.title}.</p>`);
  });
})

// Add more middleware
app.use(function(req, res, next) {
  res.status(404);
  res.send('404: File Not Found');
});

// Set port preferrence with default
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
});