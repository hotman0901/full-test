const express = require('express');
const mongoose = require('mongoose');

// cookies引入，並給passport使用
const cookieSession = require('cookie-session');
const passport = require('passport');

const key = require('./config/key');

// 自動引入或執行
// mongoose table
require('./models/User');

// 透過passport做google登入
require('./services/passport');

// mongoose登入
mongoose.connect(key.mongoURI);

const app = express();

// maxAge是存放時間 必須是使用毫秒(30days)
// key是自己設定的亂數只是用來加密之類
app.use(
  cookieSession({
    maxAge: 30*24*60*60*1000,
    keys: [key.cookieKey]
  })
)

// 因為這裡有將資料載入，所以之前做的資料都會存在req
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/authRoutes');

// 也可以簡寫成這樣
// require('./routes/authRoutes')(app)
// router 定義
authRoutes(app);


// 也是為了讓在heroku可以連線
app.get('/', (req, res) => {
  res.send({ bye: 'benny13123' });
});

// 切記PORT要大寫
const port = process.env.PORT || 5000;
app.listen(port);
