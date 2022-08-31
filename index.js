const express = require('express');
const user = require('./user');
const app = express();
const router = express.Router()
const config = {
  baseUrl: '/api'
};
const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders (res, path, stat) {
    res.set('x-timestamp', Date.now())
  },
  baseUrl: '/api'
}


app.use(express.static('public', options))
app.use(user);


app.listen(9605, () => {
  console.log('http://localhost:9605');
});

