const express = require('express');
const bodyParser = require('body-parser'); // 引入body-parser模块
const multipart = require('connect-multiparty');//引入connect-multiparty模块
const { BLACK_IP_LIST, FORBIDDEN_CODE } = require('./src/constant');
const MyError = require('./src/exception');

// 请求大小限制
const requestLimit = '5120kb';

// 临时 IP 黑名单
const tempBlackIpList = [];

process.env.BASE_URL = '/api'

class Server {
  constructor() {
    this.server = express();
    this.baseUrl = process.env.BASE_URL;
    // 解析json数据格式
    this.server.use(bodyParser.urlencoded({ extended: false, limit: requestLimit }));
    this.server.use(bodyParser.json({ limit: requestLimit }));
    // 解析form表单提交的数据application/x-www-form-urlencoded
    this.server.use(bodyParser.urlencoded({extended: true}));
    this.server.use(multipart({}));//解析form-data提交数据
    this.server.set('x-powered-by', false);
    this.server.all('*', (req, res, next) => {
      // google需要配置，否则报错cors error
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      // 允许的地址 http://127.0.0.1:9000 这样的格式
      res.setHeader('Access-Control-Allow-Origin', req.get('Origin'));
      // 允许跨域请求的方法
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      // 允许跨域请求 header 携带哪些东西
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since',
      );
      next();
    });
    this.server.use(function(req, res, next) {
      console.log(req.method, req.url);
      if (!req.headers.token) {
        res.send({
          code: 401,
          message: '未登录',
          data: null,
        })
      } else {
        next();
      }
    });
  }

  get(path, handlerFunction) {
    const handler = (req, res) => {
      handlerRequest(req, res, handlerFunction)
    };
    this.server.get(this.baseUrl + path, handler);
  }
  post(path, handlerFunction) {
    const handler = (req, res) => {
      handlerRequest(req, res, handlerFunction)
    };
    this.server.post(this.baseUrl + path, handler);
  }

  listen(port, ...args) {
    this.server.listen(port, ...args);
    console.log(`server start at ${port}, env = ${process.env.NODE_ENV}`);
  }
}

/**
 * 处理 request
 * @param {*} req 
 * @param {*} res 
 * @param {*} handlerFunction 
 * @returns 
 */
async function handlerRequest(req, res, handlerFunction) {
  // 黑名单过滤
  const requestClientIp = getClientIp(req);
  if (
    !requestClientIp ||
    BLACK_IP_LIST.includes(requestClientIp) ||
    tempBlackIpList.includes(requestClientIp)
  ) {
    console.error(`ip ${requestClientIp} is in blackList, banned!`);
    return FORBIDDEN_CODE;
  }
  const event = req.method === 'GET' ? req.query : req.body;
  if (event?.pageSize === 100) {
    tempBlackIpList.push(requestClientIp);
    console.log('tempBlackIpList = ' + JSON.stringify(tempBlackIpList));
  }
  let result;
  try {
    const startTime = new Date().getTime();
    let params;
    if (event?.file) {
      let eventCopy = { ...event };
      eventCopy.file = undefined;
      params = JSON.stringify(eventCopy);
    } else {
      params = JSON.stringify(event);
    }
    // console.log(`req start method = ${req.method} path = ${req.path}, clientIp = ${requestClientIp}, params = ${params}`);

    result = await handlerFunction(event, req, res);
    console.log(`req end method = ${req.method} path = ${req.path}, clientIp = ${requestClientIp}, params = ${params}, costTime = ${new Date().getTime() - startTime}`);
  } catch (e) {
    // 全局异常处理
    if (e instanceof MyError) {
      result = {
        code: e.code,
        message: e.message,
        data: null,
      };
    } else {
      result = {
        code: 500,
        data: null,
        message: 'server error',
      };
    }
    console.error(
      `req error method = ${req.method} path = ${req.path}, clientIp = ${requestClientIp}, params = ${JSON.stringify(
        event,
      )}`,
      e,
    );
  }

  res.send(result);
};

/**
 * 获取真实客户端 ip
 * @param req
 * @returns {*|string}
 */
function getClientIp(req) {
  if (!req) {
    return '';
  }
  return (
    req.headers['x-forwarded-for'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    req.ip
  );
}

module.exports.Server = Server;
