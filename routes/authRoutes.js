const passport = require('passport');
// 登入
// auth 'google' 是去找上面的設定
// 利用module.export 將方法傳出去
module.exports = (app) => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      // 取得個人的profile 與 email
      scope: ['profile', 'email']
    })
  );

  // 當登入後 callback redirect用，必須使用get取得，且使用GoogleStrategy
  app.get('/auth/google/callback', passport.authenticate('google'));

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  })
};
