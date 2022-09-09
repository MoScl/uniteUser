const fs = require('fs');
const path = require('path');
/**
 * 获取真实客户端 ip
 * @param req
 * @returns {*|string}
 */
 exports.getClientIp =  function getClientIp(req) {
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

/**
 * 获取存储名字
 * @param {*} url 
 */
exports.getDBName = function(url) {
  const baseUrl = process.env.BASE_URL;
  if (url.includes(baseUrl)) {
    return url.slice(baseUrl.length+1).split('/')[0]
  } else {
    return null;
  }
}

/**
 * 初始化
 * @param {*} arr 
 */
exports.initCommonDB = function(arr) {
  arr.forEach(async v  => {
    const pathName = path.resolve(__dirname, `../service/common/db/${v}.json`)
    try {
      await fs.promises.stat(pathName);
    } catch {
      await fs.writeFileSync(pathName, '');
    }
  });
}
