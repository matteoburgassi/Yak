/**
 * Created by matteo on 08/08/14.
 */
var Percolator = require('percolator').Percolator;
var CRUDCollection = require('percolator').CRUDCollection;
var mongoose = require('mongoose');
var fs = require('fs');
var multiparty = require('multiparty')
	http = require('http'),
	util = require('util');

mongoose.connect('mongodb://0.0.0.0/YakTest');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("db connection open once");
});

var jsonSchema = {
	description :
		"A document to store",
	type : "object",
	properties : {
		name : {
			title : "name",
			type : "string",
			required : true
		},
		description : {
			title : "description",
			type : "string",
			required : true
		},
		category:{
			title: "category",
			type: "string",
			required : true
		},
		authors : {
			title : "authors",
			type : "array",
			required : false
		},
		date:{
			title: "date",
			type: "date",
			required : false
		},
		images : {
			title : "images",
			type : "array",
			required : false
		}
	}
};
var documentSchema = mongoose.Schema({
	name: {type: String, unique: true},
	description: String,
	authors: [
		{
			name: String,
			email: String
		}
	],
	date: { type: Date, default: Date.now },
	category: String,
	images: [
		{
			title: String,
			caption: String,
			path: String
		}
	]
});

var Document = mongoose.model('document', documentSchema);

var documentsCollection = new CRUDCollection({

	schema : jsonSchema,

	create : function(req, res, obj, cb){
		try{
			var documentToSave = new Document(obj);
			documentToSave.save( function(err){
				if(err)
					console.warn("tried to create a doc with duplicate name");
				else
					cb();
			} );
		}catch (err){
			console.log(err.message);
			return;
		}

	},

	update : function(req, res, id, obj, cb){
		Document.findOneAndUpdate(
			{name: id},
			{
				description: obj.description,
				authors: obj.authors,
				date: obj.date,
				images: obj.images
			},
			function(){
				cb();
			}
		)
	},

	destroy : function(req, res, id, cb) {
		Document.remove({name: id}, function(err){
			console.log("called delete", id);
			if(err) return;
			cb();
		})
	},

	list : function(req, res, cb){
		Document.find({}, function(err, docs){
			console.log("list", err, docs);
			cb(null, docs);
		});
	},

	fetch : function(req, res, cb){
		console.log("fetch called", req.uri.child());
		Document.find({name: req.uri.child()}, function(err, doc){
			console.log(err, doc);
			cb(null, doc);
		});
	}

});

documentsCollection.extendedHandler = {
		DELETE : function(req, res){
			Document.remove({}, function(err){
				if(err)	console.log("an error occurred", err);
			});
			res.writeHead(204);
			res.end();
		}
	}

documentsCollection.imagesHandler = {
	DELETE : function(req, res) {
		Document.remove({name: id}, function(err){
			if(err)	console.log("an error occurred", err);
		});
		res.writeHead(
			res.status.noContent()
		);
		res.end();
	},
	POST : function(req, res) {
		console.log("called upload image");
		var form = new multiparty.Form();
		form.uploadDir = __dirname + "/../static/images";

		form.parse(req, function (err, fields, files) {
			if (err){
				return res.status.internalServerError(err);
			}
			return res.status.created(JSON.stringify(files));
		});

		return;

	}
}


var app = {
	port : 80,
	staticDir: __dirname + '/../static'
};

var server = new Percolator(app);

server.connectMiddleware(multiparty);

server.route('/documents', documentsCollection.handler);
server.route('/documents/:id', documentsCollection.wildcard);
server.route('/documents/images/upload/:id', documentsCollection.imagesHandler);
server.route('/documents/testUtil/destroy', documentsCollection.extendedHandler);

server.listen(function(){
	console.log(server.server.router.routes);
	console.log('Listening on port ', app.port);
});
