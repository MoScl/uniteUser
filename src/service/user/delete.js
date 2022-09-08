
async function del(event, req, res) {
  const table = require('./index.json');
  if(!event?.id) return { code: 400, data:null, msg: '参数缺失' };
  const data = table.filter(v => v.id !== event.id);
  // 保存数据
  try {
    await fs.writeFileSync('./src/service/user/index.json', JSON.stringify(data));
  }catch(err){
    return { code: 400, data: {}, msg: '删除失败'};
  }
  return { code: 200, data: null, msg: '删除成功' }
};
  module.exports.del = del;