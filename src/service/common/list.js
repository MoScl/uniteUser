const { getDBName } = require('../../utlis');

function list(event, req, res) {
  if (!getDBName(req.url)) return new Error();
  const pathName = getDBName(req.url) + '.json';
  let data = require(`./db/${pathName}`);
  return data ? { code: 200, data, msg: 'success' } : { code: 400, data: [], msg: '数据库错误' };
};

module.exports.list = list;