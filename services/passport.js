// 使用 oauth 主體需要 passport.js
const passport = require('passport');
// 使用 google oauth
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');
// google api 的 key 
const key = require('../config/key');

// 取出table
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
      // console.log('accessToken: ', accessToken);
      // console.log('refreshToken: ', refreshToken);
      // console.log('profile: ', profile);

      // 先判斷有沒有存在這個googleId
      User.findOne({
        googleId: profile.id
      }).then(
        existUser => {
          if (existUser) {
            // 已經存在該使用者
            // 用GoogleStrategy回傳的方法done
            // 第二個參數是傳遞到passport.serializeUser 的第一個參數
            done(null, existUser);
          } else {
            // 是新的使用者
            // 塞檔案到mongodb 必須先new你的table 再將值寫入並存檔
            new User({ googleId: profile.id }).save().then(
              user => {
                // 第二個參數是傳遞到passport.serializeUser 的第一個參數
                done(null, user);
              },
              e => {
                console.log('err: ', e);
              }
            );
          }
        },
        e => {
          console.log(e);
        }
      );
    }
  )
);

// 序列化
passport.serializeUser((user, done) => {
  // 第一個就是user modal ，也就是執行passport.use後done方法儲存的user
  // user.id是mogondb自動生成的key值
  done(null, user.id)
});

// 反序列化，所以第一個參數id 就是 上面serializeUser的done的第二個參數
passport.deserializeUser((id, done)=>{
  User.findById(id).then((user)=>{
    done(null, user);
  });
});
