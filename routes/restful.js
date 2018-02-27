const router = require('koa-router')()
let Service = require('../service/service');

router.all('/restful/:name?/:method?', async (ctx, next) => {
  	let name    = ctx.params.name || 'empty';      
    let method  = ctx.params.method || 'empty';
    // ctx.body = name+':'+method+':'+par
    try{
	    let service = new Service[name+'Service']();
	    await service[method](ctx);
	}catch(err){
		if(err.toString().indexOf('Service')>-1||err.toString().indexOf('service')>-1){
			service = new Service['emptyService'];
			service.empty(ctx);
		}else{
			console.log(err);
			ctx.body='页面错误<br/>'+err;
		}
	}
})

module.exports = router