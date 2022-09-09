const fs = require('fs');
const _ = require('lodash');

async function deleteBatch(event, req, res) {
  const table = require('./index.json');
  if(!event?.ids || !_.isArray(event.ids)) return { code: 400, data:null, msg: '参数错误' };
  const data = table.filter(v => !event.ids.includes(v.id));
  console.log(data.length, table.length);
  if (data.length !== (table.length - event.ids.length)) return { code: 400, data: {}, msg: 'ids数据有误'};
  // 保存数据
  try {
    await fs.writeFileSync('./src/service/user/index.json', JSON.stringify(data));
  }catch(err){
    return { code: 400, data: {}, msg: '删除失败'};
  }
  return { code: 200, data: null, msg: '删除成功' }
};
  module.exports.deleteBatch = deleteBatch;