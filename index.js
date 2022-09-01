const { Server } = require('./server');

const server = new Server();

// 用户
server.get('/user/getById', require('./src/service/user/getById'));
server.post('/user/save', require('./src/service/user/save'));
server.post('/user/updata', require('./src/service/user/updata'));
// server.post('/user/list', );
// server.post('/user/listPage', );
// server.post('/user/delete', );
// server.post('/user/deleteBatch', );


server.listen(9605, () => {
  console.log('http://localhost:9605');
});

