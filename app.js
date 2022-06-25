const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

const productRoutes =  require('./routes/product');

const app = express();

app.use(cors())

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api',productRoutes)

const port = process.env.PORT || 8080;


mongoose
  .connect(process.env.DATABASE,{ useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(result => {
    app.listen(port);
  })
  .catch(err => console.log(err));