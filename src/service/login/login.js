const fs = require('fs');
const _ = require('lodash')

async function login(event, req, res) {
  const table = require('../user/index.json');
  const data = _.pick(event, ['username', 'password']);
  if (!event) {
    return { code: 400, data: null, msg: '参数错误' }
  } else if (typeof event === 'object') {
    // 必填参数校验
    const required = ['username', 'password'];
    let msg = '';
    required.forEach(v => {
      if (!data[v]) {
        msg = `${v} 参数必填`;
        return;
      }
    })
    if (msg) return { code: 400, data: {}, msg };
  } else {
    return { code: 400, data: null, msg: '参数错误' }
  }

  let user = null;
  
  for (let i = 0; i < table.length; i++) {
    const v = table[i];
    // 用户名是否重复
    if (v.username === event.username) {
      if (v.password !== event.password) {
        return { code: 400, data: {}, msg: '用户名或密码错误'};
      }
      user = v
    }
  }

  if (!user) {
    return { code: 401, data: {}, msg: '暂无用户'};
  }
  // 数据
  try {
    return { code: 200, data: user, msg: '登录成功'};
  }catch(err){
    return { code: 400, data: {}, msg: '登录失败'};
  }
};

module.exports = login;
