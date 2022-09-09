const { Server } = require('./server');
const { initCommonDB } = require('./src/utlis');

const server = new Server();

// 用户
server.get('/user/getById', require('./src/service/user/getById').getById);
server.post('/user/save', require('./src/service/user/save').save);
server.post('/user/updata', require('./src/service/user/updata').updata);
server.post('/user/list', require('./src/service/user/list').list);
server.post('/user/listPage', require('./src/service/user/listPage').listPage);
server.post('/user/delete',  require('./src/service/user/delete').del);
server.post('/user/deleteBatch',   require('./src/service/user/deleteBatch').deleteBatch);

// 登录
server.post('/user/login', require('./src/service/login/login'));

const common = ['/data', '/model'];

initCommonDB(common);

// 公共路由
common.forEach(v => {
  server.get(`${v}/getById`, require('./src/service/common/getById').getById);
  server.post(`${v}/save`, require('./src/service/common/save').save);
  server.post(`${v}/updata`, require('./src/service/common/updata').updata);
  server.post(`${v}/list`, require('./src/service/common/list').list);
  server.post(`${v}/listPage`, require('./src/service/common/listPage').listPage);
  server.post(`${v}/delete`,  require('./src/service/common/delete').del);
  server.post(`${v}/deleteBatch`,   require('./src/service/common/deleteBatch').deleteBatch);
})

server.listen(9605, () => {
  console.log('http://localhost:9605');
});
