/**
 * 引入第三方包，每个包的具体作用太多不详细介绍，请自行在https://www.npmjs.com 上面搜
 */
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const fsPromise= require('fs').promises
const fs = require('fs')
const path = require('path')

/**
 * 上传文件
 */
async function uploadFile(file) {
  // Uploads a local file to the bucket
  await storage.bucket(`coivd19-bucket-1312as`).upload(file.filePath, {
    destination: `${file.filePath.replace('dist/','')}`,
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000',
    },
  });

  console.log(`${file.filePath} uploaded to ${"coivd19-bucket-1312as"}.`);
}

/**
 * 寻找需要上传文件的路径
 */
async function findAllFilePath(nowPath) {
  const filePaths = fs.readdirSync(nowPath)
  let ret = []
  if(filePaths.length > 0){
    await Promise.all(filePaths.map(async filePath=>{
      if(filePath.indexOf('.') !== -1) {
        ret.push({
          filePath:path.join(nowPath,filePath).replace(/\\/g,'/'),
          fileName:filePath
        })
      }
      else {
        const subFilePaths = await findAllFilePath(path.join(nowPath,filePath).replace(/\\/g,'/'))
        ret = Array.prototype.concat(ret,subFilePaths)
      }
    }))
  }
  return ret
}

/**
 * 入口函数，从这里调用上述两个函数
 */
async function uploadAllFile() {
  const files = await findAllFilePath('./dist')
  await Promise.all(files.map(async file=>{
    return uploadFile(file)
  }))

}


// 默认执行入口函数
uploadAllFile();