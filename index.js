var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var app = express();

// Connect to MongoDB 
const url = `mongodb://localhost:27017/assignment`;

const connectionParams={
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

// Using bodyparser to parse json data
app.use(bodyparser.json());

const user = require('./routes/userRoute');

// User Routes
app.use('/api/user', user);

// Creating server
const port = 3001;
app.listen(port, () => {
    console.log("Server running at port: " + port);
});