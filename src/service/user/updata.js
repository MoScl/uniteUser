const fs = require('fs');
const _ = require('lodash')

async function updata(event, req, res) {
  const table = require('./index.json');
  const data = _.pick(event, ['id','name', 'username', 'password']);
  if (!event) {
    return { code: 400, data: null, msg: '参数错误' }
  } else if (typeof event === 'object') {
    // 必填参数校验
    const required = ['id','name', 'username', 'password']
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
  const updataList = []

  // 更新用户
   _.cloneDeep(table).forEach(v => (updataList.push(v.id === data.id ? data : v)));
  
  // 保存数据
  try {
    await fs.writeFileSync('./src/service/user/index.json', JSON.stringify(updataList));
  }catch(err){
    return { code: 400, data: {}, msg: '保存失败'};
  }
  return { code: 200, data, msg: '修改成功'};
};

module.exports.updata = updata;
