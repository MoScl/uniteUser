const { Server } = require('./server');

const server = new Server();

// 用户
server.get('/user/getById', require('./src/service/user/getById').getById);
server.post('/user/save', require('./src/service/user/save').save);
server.post('/user/updata', require('./src/service/user/updata').updata);
server.post('/user/list', require('./src/service/user/list').list);
server.post('/user/listPage', require('./src/service/user/listPage').listPage);
server.post('/user/delete',  require('./src/service/user/delete').del);
// server.post('/user/deleteBatch', );
server.post('/user/login', require('./src/service/login/login'));


server.listen(9605, () => {
  console.log('http://localhost:9605');
});

