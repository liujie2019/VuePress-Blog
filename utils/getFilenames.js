const { readdirSync, lstatSync, writeFileSync } = require('fs');
const path = require('path');

async function getFilenames(docsPath, outputPath, options = {}) {
  if (!docsPath || !outputPath) {
    throw new Error('文档存储路径和文档输出路径都不能为空!');
  }

  // 可选配置
  const config = {};
  const blacklsit = ['.vuepress', 'README.md'];
  const outputFilename = 'filenames.json';
  Object.assign(
    config,
    {blacklsit, outputFilename},
    options
  );

  // 初始化输出
  let filenames = Object.create(null);

  // 处理路径地址
  !docsPath.endsWith('/') && (docsPath += '/');
  !outputPath.endsWith('/') && (outputPath += '/');

  // readdirSync(docsPath)获取当前路径下的所有目录和文件
  // 获取目标文件夹
  const targetDirs = await readdirSync(docsPath).filter(dir => !config.blacklsit.includes(dir));

  // 执行操作
  filenames = await path2Filenames(filenames, docsPath, targetDirs); // 生成文件名
  console.log(filenames);
//   return;
  const result = await writeFilenames(filenames, outputPath, config.outputFilename); // 写入对应的目录

  if (result) {
    // 提示
    console.log(`\n
      🎉🎉🎉  获取完成  🎉🎉🎉\n
      文档地址: ${docsPath}\n
      选中的文档目录: ${targetDirs}\n
      输出文件地址：${outputPath}${config.outputFilename}\n
      🎉🎉🎉  获取完成  🎉🎉🎉
    `);
  }
}

/**
 * 根据路径生成文件名
 * @param {*} filenames
 * @param {*} path
 * @param {*} dirs
 */
async function path2Filenames(filenames, docsPath, targetDirs) {
  // docsPath
  for (const dir of targetDirs) {
    const completePath = docsPath + dir;
    const files = await readdirSync(completePath);

    for (const file of files) {
      const nextPath = `${completePath}/${file}`;
      const isDirectory = await lstatSync(nextPath).isDirectory();
      if (isDirectory) {
        !filenames[dir] && (filenames[dir] = {});
        const children = await readdirSync(nextPath);
        filenames[dir][file] = formatFilenames(children);
      } else {
        const children = await readdirSync(completePath);
        filenames[dir] = formatFilenames(children);
      }
    }
  }
  return filenames;
}

/**
 * 格式化文件名
 * @param {*} filenames
 */
function formatFilenames(filenames) {
    filenames = filenames.filter(filename => filename !== 'assets');
    return filenames
        .map(file => {
        if (file === 'README.md') {
            return '';
        } else {
            return file.replace('.md', '');
        }
        }).sort();
}
/**
 * 写入
 * @param {*} filenames
 * @param {*} path
 * @param {*} name
 */
async function writeFilenames(filenames, outputPath, outputFilename) {
  const result = await writeFileSync(path.resolve(outputPath, outputFilename), JSON.stringify(filenames));
  return !result;
}

// process.cwd()获取当前执行脚本的路径
getFilenames(path.resolve(process.cwd(), 'docs'), path.resolve(process.cwd(), 'conf'));
