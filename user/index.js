const express = require('express');

const options = {
  baseUrL: '/user'
};
const router = express.Router([options]);

router.use((req, res, next) => {
  console.log(req.method, req.url);
  next()
})

router.get('/getById', (req, res, next) => {
  res.send({ name: '小明' });
});

router.post('/list', (req, res, next) => {
  res.send([1,2])
});

module.exports = router