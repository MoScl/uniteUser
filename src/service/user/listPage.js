
function listPage(event, req, res) {
  const table = require('./index.json') || [];
  if (!event) {
    return { code: 400, data: null, msg: '参数错误' }
  } else if (typeof event === 'object') {
    // 必填参数校验
    const required = ['currentPage', 'pageSize']
    let msg = '';
    required.forEach(v => {
      if (!event[v]) {
        msg = `${v} 参数必填`;
        return;
      }
    })
    if (msg) return { code: 400, data: {}, msg };
  } else {
    return { code: 400, data: null, msg: '参数错误' }
  }
  const data = {
    currentPage: event.currentPage,
    pageSize: event.pageSize,
    total: table.length,
    list: table.splice((event.currentPage - 1) * event.pageSize, event.currentPage * event.pageSize)
  }
  return data ? { code: 200, data, msg: 'success' } : { code: 400, data, msg: '数据库错误' };
};

module.exports.listPage = listPage;