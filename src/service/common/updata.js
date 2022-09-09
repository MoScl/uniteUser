const fs = require('fs');
const _ = require('lodash')
const { getDBName } = require('../../utlis');

async function updata(event, req, res) {
  if (!getDBName(req.url)) return new Error();
  const pathName = getDBName(req.url) + '.json';
  const table = require(`./db/${pathName}`);

  if (!event || !_.isObject(event)) {
    return { code: 400, data: null, msg: '参数错误' };
  } else if (!event.id) {
    return { code: 400, data: null, msg: 'id参数错误' };
  }

  let updataList = [];
  let state = true;

  // 更新用户
   _.cloneDeep(table).forEach(v => {
    if (v.id === event.id) {
      state = false;
    }
    updataList.push(v.id === event.id ? event : v)
   });
  
   if (state) return { code: 400, data: {}, msg: 'id不存在'};
  
  // 保存数据
  try {
    await fs.writeFileSync(`./src/service/common/db/${pathName}`, JSON.stringify(updataList));
  }catch(err){
    return { code: 400, data: {}, msg: '修改失败'};
  }
  return { code: 200, data: event, msg: '修改成功'};
};

module.exports.updata = updata;
