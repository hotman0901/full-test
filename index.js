const express = require('express');
const mongoose = require('mongoose');
const key = require('./config/key');
require('./models/User');
require('./services/passport');

mongoose.connect(key.mongoURI);

const app = express();

const authRoutes = require('./routes/authRoutes');

// 也可以簡寫成這樣
// require('./routes/authRoutes')(app)
authRoutes(app);

app.get('/', (req, res) => {
  res.send({ bye: 'benny' });
});

const port = process.env.PORT || 5000;
app.listen(port);
