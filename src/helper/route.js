const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const mime = require('../helper/mime');
const compress = require('../helper/compress');
const range = require('../helper/range');
const isFresh = require('./cache');

const tplPath = path.join(__dirname, '../templates/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());

module.exports = async function(req, res, filePath, conf) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            const contentType = mime(filePath);
            res.setHeader('Content-Type', contentType);
            if (isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }
            /**
             * pipe: 读取流，返回一些读取一些，有利于高并发下的响应速度
             */
            let rs;
            const {code, start, end} = range(stats.size, req, res);
            if (code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath)
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, {start: start, end: end})
            }

            if (filePath.match(conf.compress)) {
                rs = compress(rs, req, res);
            }
            rs.pipe(res);
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            console.log('files:', files);
            console.log('dir:', path.relative(conf.root, filePath));
            const dir = path.relative(conf.root, filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files: files.map(file => {
                    return {
                        file: file,
                        type: mime(file),
                    }
                }),
            };
            res.end(template(data));
        }
    } catch (error) {
        console.error(error);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(`${filePath} is not a directory or file\n${error.toString()}`);
    }
};