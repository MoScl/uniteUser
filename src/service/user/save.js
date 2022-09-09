const fs = require('fs');
const _ = require('lodash')

async function save(event, req, res) {
  const table = require('./index.json');
  const data = _.pick(event, ['name', 'username', 'password']);
  if (!event) {
    return { code: 400, data: null, msg: '参数错误' }
  } else if (typeof event === 'object') {
    // 必填参数校验
    const required = ['name', 'username', 'password']
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

  for (let i = 0; i < table.length; i++) {
    const v = table[i];
    // 用户名是否重复
    if (v.username === event.username) {
      return { code: 400, data: null, msg: '用户名重复！'};
    }
    
  }

  // 添加用户
  table.push({ id: new Date().getTime() + table.length, ...data });
  
  // 保存数据
  try {
    await fs.writeFileSync('./src/service/user/index.json', JSON.stringify(table));
  }catch(err){
    return { code: 400, data: {}, msg: '保存失败'};
  }
  return { code: 200, data, msg: '保存成功'};
};

module.exports.save = save;
