const Koa = require('koa');
const path = require('path');
const content = require('./util/content');
const mimes = require('./util/mimes');
const Router = require('koa-router');
const sendfile = require('koa-sendfile');
const crypto = require('crypto');
const fs = require('fs');
// const cors = require('koa2-cors');

const app = new Koa();
const router = new Router();

// 静态资源目录对于相对入口文件app.js的路径
const staticPath = './static';

// 解析资源类型
function parseMime(url) {
	let extName = path.extname(url);
	extName = extName ? extName.slice(1) : 'unknown';
	return mimes[extName];
}

app.use(async (ctx, next) => {
	ctx.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS, DELETE'
	});

	await next();
});

app.use(async (ctx, next) => {
	if (ctx.path === '/getImage') {
		await next();
		return;
	}

	// 静态资源目录在本地的绝对路径
	const fullStaticPath = path.join(__dirname, staticPath);

	// 获取静态资源内容，有可能是文件内容，目录，或404
	const _content = await content(ctx, fullStaticPath);

	// 解析请求内容的类型
	const _mime = parseMime(ctx.url);

	// 如果有对应的文件类型，就配置上下文的类型
	if (_mime) {
		ctx.type = _mime;
	}

	// 输出静态资源内容
	if (_mime && _mime.indexOf('image/') >= 0) {
		// 如果是图片，则用node原生res，输出二进制数据
		ctx.res.writeHead(200);
		ctx.res.write(_content, 'binary');
		ctx.res.end();
	} else {
		// 其他则输出文本
		ctx.body = _content;
	}
});

router.get('/getImage', async (ctx, next) => {
	const query = ctx.request.query;
	const fullStaticPath = path.join(__dirname, staticPath) + '\\image\\' + query.name;
    
    console.log(ctx.request.fresh);
    await sendfile(ctx, fullStaticPath);
    console.log(ctx.body);
	await next();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
	console.log('[demo] static-server is starting at port 3000');
});
