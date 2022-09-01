const table = require('./index.json');

function getById(event, req, res) {
  if(!event?.id) return { code: 400, data:null, msg: '参数缺失' };
  let data;
  table.forEach(v => {
    if (v.id === event.id) {
      data = v;
    }
  });
  
  return data ? { code: 200, data, msg: 'success' } : { code: 404, data: {}, msg: '暂无用户' };
};
module.exports = getById;