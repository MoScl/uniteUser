
function list(event, req, res) {
  const data = require('./index.json') || [];
  return data ? { code: 200, data, msg: 'success' } : { code: 400, data: [], msg: '数据库错误' };
};

module.exports.list = list;