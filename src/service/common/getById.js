const { getDBName } = require('../../utlis');

function getById(event, req, res) {
  if (!getDBName(req.url)) return new Error();
  const pathName = getDBName(req.url) + '.json';
  let table = require(`./db/${pathName}`);

  if(!event?.id) return { code: 400, data:null, msg: '参数缺失' };
  let data;
  table.forEach(v => {
    if (v.id == event.id) {
      data = v;
    }
  });
  
  return data ? { code: 200, data, msg: 'success' } : { code: 404, data: {}, msg: '暂无此条数据' };
};
module.exports.getById = getById;