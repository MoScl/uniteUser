const table = require('./index.json');
const fs = require('fs');

async function save(event, req, res) {
  let result;
  table.forEach(v => {
    // 用户名是否重复
    if (v.username === event.username) {
      result = { code: 400, data: null, msg: '用户名重复！'};
    }
    if (result) return;

  });

  // 添加用户
  table.push({ id: new Date().getTime(), name: event.name, username: event.username, password: event.password });
  await fs.open('./index.json', 'wx', (err, fd) => {
    console.log(err, fd);
    if (err) {
      if (err.code === 'EEXIST') {
        console.error('myfile already exists');
        return;
      }
  
      throw err;
    }
  });
  return result;
};
module.exports = save;