const fs = require('fs');
const _ = require('lodash');
const { getDBName } = require('../../utlis');

async function save(event, req, res) {
  if (!getDBName(req.url)) return new Error();
  const pathName = getDBName(req.url) + '.json';
  let table = require(`./db/${pathName}`);
  if (!event || !_.isObject(event)) return { code: 400, data: null, msg: '参数错误' };

  if(!_.isArray(table)) {
    table = [];
  }
  
  // 添加
  table.push({ id: new Date().getTime() + table.length, ...event });

  console.log(table);

  console.log(`./src/service/common/db/${pathName}`);
  
  // 保存数据
  try {
    await fs.writeFileSync(`./src/service/common/db/${pathName}`, JSON.stringify(table));
  }catch(err){
    return { code: 400, data: {}, msg: '保存失败'};
  }
  return { code: 200, data: event, msg: '保存成功'};
};

module.exports.save = save;
