const elasticsearch = require('elasticsearch');

let mongoose = require('mongoose');

var conn = mongoose.connect('mongodb://localhost/partner');
let Activity = require('./models/Activity')

const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
  });

function createIndex(rs){
	for(item of rs){
		let id = item._id.toString();
		delete item._id;
		item.id = id;
		esClient.index({
		  index: 'activity',
		  type: 'post',
		  id: id,
		  body: item,
		}, function (err, res) {
		  console.log('err:'+err);
		  console.log('res:'+res);
		});
	}
}
function searchAll(){
	esClient.search({
	  index: 'activity',
	  size: 50,
	  body: {
	    // query: {
	    //   match: {
	    //     atitle: '乒乓'
	    //   }
	    // }
	  }
	}).then(function (res) {
		console.log(res);
		var hits = res.hits;
		console.log(res.hits.hits);
	});
}

//https://www.elastic.co/guide/cn/elasticsearch/guide/current/query-dsl-intro.html
function search(){
	esClient.search({
	  index: 'activity',
	  body: {
	  	query:{
	  		"bool":{
	  			"must": {"match": { "atitle":  "乒乓" },},
	  			"filter":{ 
	  				//match_all:{}	//查所有
	  				"range":{"lng":{"lt":116.1800}},		//gt是>,lt是<
	  				"range":{"lat":{"gt":39.75}},
	  			}
		  	},
		  }
	  }
	}).then(function (res) {
		console.log(res);
		var hits = res.hits;
		console.log(res.hits.hits);
	});
}


//删除索引
//----------清空全部索引内容----------------------
// esClient.deleteByQuery({		//彻底清空索引
// 	index:'activity',
// 	body: {
// 		query:{
// 			match_all:{}		//全部删除
// 		}
// 		// query:{
// 		// 	match: {
// 		//        atitle: ''
// 		//     }	
// 		// }
// 	},
// }).then(function (res) {
// 	console.log(res);
// 	console.log('---------------------');
// 	searchAll();	//彻底清空后依然能够查询到被删除的索引
// });
//--------删除一条-----------
// esClient.delete({
//    index: 'activity',
//    type: 'post',
//    id:1,
//  }, (error, response)=>{
//    //------删除id='1'的索引行
//    console.log(error);
//    console.log(response);
//  });


//创建索引
// Activity.find({},{"_id":1,"nicheng":1,"adate":1,"creditnum":1,"atitle":1,"address":1,"lat":1,"lng":1,"price":1},function(err, rs){
// 	createIndex(rs);
// }).lean();

//查询索引
// searchAll();
search();

