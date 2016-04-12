//setup
var express = require('express');
var app = express();											// create our app w/ express
var mongoose = require('mongoose');	
var MongoClient = require('mongodb').MongoClient;						// mongoose for mongodb
var morgan = require('morgan');									// log requests to the console (express4)
var bodyParser = require('body-parser');						// pull information from HTML POST (express4)
var methodOverride = require('method-override');				// simulate DELETE and PUT (express4)

//configuration
//mongoose.connect('mongodb://10.0.6.10:27017/dolcebistro');		// connect to mongoDB database
/*var db = mongoose.createConnection(
  'mongodb://delbussoweb:adv827903@olympia.modulusmongo.net:27017/ume4quZi'
);*/
//mongoose.connect('mongodb://delbussoweb:adv827903@olympia.modulusmongo.net:27017/ume4quZi');

app.use(express.static(__dirname + '/public'))					// set the static files location /public/img will be /img for user
app.use(morgan('dev'));											// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));			// parse application/x-www-form-urlencod
app.use(bodyParser.json());										// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));	// parse application/vnd.api+json as json
app.use(methodOverride());

// Model
var Customer = mongoose.model('customers', {
	name: String,
	nickname: String,
	orders: [Order]
});

var Product = mongoose.model('products', {
	name: String,
	quantity: Number,
	price: Number
});

var Order = mongoose.model('orders',{
	date: Date,
	status: Number,
	products: [Product]
});

// routes
// api

// create customer and send back all customers after creation
app.post('/api/customers', function(req, res){
	Customer.create({
		name: req.body.name,
		nickname: req.body.nickname,
		done: false
	}, function(err, customer){
		if(err)
			res.send(err);

		//get and return all the customers after you create another
		Customer.find({},'name nickname', function(err, customers){
			if(err)
				res.send(err);
			res.json(customers);
		});
	});
});

app.delete('/api/customers/:customer_id', function(req, res){
	Customer.find({name:req.params.customer_id},function(err,customer){
		if(err)
			res.send(err);
		res.json(customer);
	});
});

MongoClient.connect('mongodb://delbussoweb:adv827903@olympia.modulusmongo.net:27017/ume4quZi', function(err, db){
//MongoClient.connect('mongodb://merdere:27017/dolcebistro', function(err, db){

	app.get('/api/products/', function(req, res){
		db.collection('products').find().sort({"name":1}).toArray(function(err, docs){
			if(err)
				res.send(err);
			res.json(docs);
		});
	});

	app.get('/api/customers/', function(req, res){
		db.collection('customers').find().sort({"name":1}).toArray(function(err, docs){
			if(err)
				res.send(err);
			res.json(docs);
		});
	});

	app.get('/api/get_orders/:name', function(req, res){
		db.collection('customers').find({"name":req.params.name.toUpperCase()}).project({"orders":1,"credits":1}).toArray(function(err, orders){
			if(err)
				res.send(err);

			res.json(orders);
		});
	});

	app.get('/api/getOpenOrders/', function(req, res){
		var order = {}
		db.collection('customers').find({"orders.status":1}).project({"orders":1}).toArray(function(err, orders){
			if(err)
				res.send(err);

			var openTotal = 0;
			for(var i=0;i<orders.length;i++){
				order = orders[i];
				console.log(order.status);
				var products = order.products;
				//console.log(order.status);
				/*for(p=0;p<products.length;p++){
					console.log(products[p]);
					openTotal += (products[p].price * products[p].quantity);
				}*/
			}
			res.json(orders);
		})
	})


	app.post('/api/checkout/', function(req, res){
		var customers = db.collection('customers');
		customers.find({"name":req.body.customer}).toArray(function(err, docs){
			if(docs.length > 0){
				customers.update(
						{"name": req.body.customer},
						{
							$push:{
								orders:{
									date: new Date(),
									status: parseInt(req.body.status),
									products: req.body.products,
									total: req.body.orderTotal
								}
							}
						}
					);
				res.send("success");
			}
			else{
				customers.insert({
					"name": req.body.customer,
					orders:{
						date: new Date(),
						status: req.body.status,
						products: req.body.products,
						total: req.body.orderTotal
					}
				});

				res.send("success");
			}

			if(err)
				res.send(err);
		});
	});
});


/*app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});*/

// listen (start app with node server.js)
app.listen(8080);
console.log("App listening on port 8080");