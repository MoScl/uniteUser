const fs = require('fs');
const { getDBName } = require('../../utlis');

async function del(event, req, res) {
  if (!getDBName(req.url)) return new Error();
  const pathName = getDBName(req.url) + '.json';
  let table = require(`./db/${pathName}`);

  if(!event?.id) return { code: 400, data:null, msg: '参数缺失' };
  const data = table.filter(v => v.id !== event.id);

  if (data.length !== table.length -1) return { code: 400, data: {}, msg: '暂无此条数据'};
  // 保存数据
  try {
    await fs.writeFileSync(`./src/service/common/db/${pathName}`, JSON.stringify(data));
  }catch(err){
    return { code: 400, data: {}, msg: '删除失败'};
  }
  return { code: 200, data: null, msg: '删除成功' }
};
  module.exports.del = del;