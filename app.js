const express = require('express');
const app = express()

app.post('/user', (req, res) => {
  console.log(req.body);
});

app.listen(8081)