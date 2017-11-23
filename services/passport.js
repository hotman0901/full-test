// 使用 oauth 主體需要 passport.js
const passport = require('passport');
// 使用 google oauth
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');
// google api 的 key
const key = require('../config/key');

const User = mongoose.model('users');

// passport （google）設定參數
passport.use(
  new GoogleStrategy(
    {
      clientID: key.googleClinetID,
      clientSecret: key.googleClinetSecret,
      // 這是在console developer設定的
      // http://localhost:5000/auth/google/callback
      // 已授權的重新導向 URI
      // 重新導向 URI 用於網路伺服器發出的要求。
      // 使用者透過 Google 進行驗證後，系統就會將他們重新導向至應用程式中的這個路徑。
      // 此路徑會附帶存取的授權碼。路徑中必須含有通訊協定，不得含有網址片段或相對路徑，而且不能是公開的 IP 位址。
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // 登入成功執行
      console.log('accessToken: ', accessToken);
      console.log('refreshToken: ', refreshToken);
      console.log('profile: ', profile);

      new User({ googleId: profile.id }).save();
    }
  )
);
