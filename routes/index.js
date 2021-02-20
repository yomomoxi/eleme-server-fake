var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')
const models = require('../db/models')
//const UserModel = models.getModel('user')
const _filter = {'pwd': 0, '__v': 0} // 查询时过滤掉
const sms_util = require('../util/sms_util')
const users = {}
const ajax = require('../api/ajax')
var svgCaptcha = require('svg-captcha')

/*
密码登陆
 */
router.post('/login_pwd', function (req, res) {
  const name = req.body.name
  const pwd = md5(req.body.pwd)
  const captcha = req.body.captcha.toLowerCase()
  console.log('/login_pwd', name, pwd, captcha, req.session)
  console.log(req.sessionID)
  // 可以对用户名/密码格式进行检查, 如果非法, 返回提示信息
  if(captcha!==req.session.captcha) {
    console.log(captcha)
    console.log(req.session.captcha)
    return res.send({code: -1, msg: '验证码不正确'})
  }
  // 删除保存的验证码
  //delete req.session.captcha
   return res.send({code: 1, msg: '登录成功'})

})

/*
一次性图形验证码
 */
router.get('/captcha', function (req, res) {
  var captcha = svgCaptcha.create({
    ignoreChars: '0o1l',
    noise: 2,
    color: true
  });
  
  req.session.captcha = captcha.text.toLowerCase();
  console.log(req.session.captcha)
  console.log('/captcha',  req.session)
  console.log(req.sessionID)
  /*res.type('svg');
  res.status(200).send(captcha.data);*/
  res.type('svg');
  res.send(captcha.data)
  // req.session.save();
});



/*
根据sesion中的userid, 查询对应的user
 */
router.get('/userinfo', function (req, res) {
  // 取出userid
  //const userid = req.session.userid
  res.send({code: 1, msg: '正确',data:{id:2,name:"james",phone:"13999999999"}})
})


router.get('/logout', function (req, res) {
  // 清除浏览器保存的userid的cookie
  delete req.session.userid
  // 返回数据
  res.send({code: 0})
})


module.exports = router;