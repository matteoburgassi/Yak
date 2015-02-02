console.log("starting server");
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
if(process.env.OPENSHIFT_MONGODB_DB_URL){
	mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL + "nodejsprod");
	console.log("connect to mongodb");
} else {
	mongoose.connect('mongodb://0.0.0.0/YakTest');
}

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
        year:{
            title: "year",
            type: "integer",
            required: true
        },
		images : {
			title : "images",
			type : "array",
			required : false
		}
	}
};

var cvSchema = {
    description: "a curriculum to store",
    type: "object",
    properties:{
        photo:{
            title: "photo",
            type: "array",
            required: false
        },
        name:{
            title : "name",
            type : "string",
            required : true
        },
        secondName:{
            title : "secondName",
            type : "string",
            required : true
        },
        email:{
            title : "email",
            type : "string",
            required : true
        },
        address:{
            title : "address",
            type : "string",
            required : true
        },
        phone: {
            title : "phone",
            type : "array",
            required : false
        },
        school:{
            title: "school",
            type: "array",
            required: false
        },
        experiences:{
            title: "experiences",
            type: "array",
            required: false
        }

    }
}

var documentSchema = mongoose.Schema({
	name: {type: String, unique: true, required: true},
	description: String,
	authors: [
		{
			name: String,
			email: String
		}
	],
	date: { type: Date, default: Date.now },
	category: String,
    year: Number,
	images: [
		{
            nomeFile: String,
			title: String,
			caption: String,
			path: String
		}
	]
});

var cvMongooseSchema = mongoose.Schema({
    photo:[
        {
            nomeFile: String,
            title: String,
            caption: String,
            path: String
        }
    ],
    name: {type: String},
    secondName: {type: String},
    email: {type: String, unique: true, required: true},
    address: {type: String},
    phone: [
        {
            number: String
        }
    ],
    school: [
        {
            start: {
                date:{type: Date, default: Date.now},
                opened:{type: Boolean, default: false}
            },
            end: {
                date:{type: Date, default: Date.now},
                opened:{type: Boolean, default: false}
            },
            description: {type: String}
        }
    ],
    experiences: [
        {
            start: {
                date:{type: Date, default: Date.now},
                opened:{type: Boolean, default: false}
            },
            end: {
                date:{type: Date, default: Date.now},
                opened:{type: Boolean, default: false}
            },
            description: {type: String}
        }
    ]

});

var Document = mongoose.model('document', documentSchema);
var Cv = mongoose.model('cv', cvMongooseSchema);


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
		Document.remove({name: decodeURI(id)}, function(err){
			console.log("called delete", id);
			if(err) {
                console.log(err);
                return;
            }
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
		Document.find({name: decodeURIComponent(req.uri.child())}, function(err, doc){
			console.log(req.uri.child(), err, doc);
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
        console.log("delete image", decodeURI(req.uri.child()));
        var fs = require('fs');

        fs.unlinkSync(decodeURI(__dirname + "/../static/images/" + req.uri.child()))
        console.log('successfully deleted '+decodeURI(req.uri.child()));
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



var cvCollection = new CRUDCollection({

    schema : cvSchema,

    create : function(req, res, obj, cb){
        try{
            var documentToSave = new Cv(obj);
            documentToSave.save( function(err){
                if(err)
                    console.warn("tried to create a cv with duplicate email");
                else
                    cb();
            } );
        }catch (err){
            console.log(err.message);
            return;
        }

    },

    update : function(req, res, email, obj, cb){
        console.log("update", decodeURIComponent(email));
        Cv.findOneAndUpdate(
            {email: decodeURIComponent(email)},
            {
                name: obj.name,
                secondName: obj.secondName,
                email: obj.email,
                photo: obj.photo,
                address: obj.address,
                phone: obj.phone,
                school: obj.school,
                experiences: obj.experiences
            },
            function(){
                cb();
            }
        )
    },

    destroy : function(req, res, id, cb) {
        Cv.remove({email: decodeURIComponent(id)}, function(err){
            console.log("called delete", decodeURIComponent(id));
            if(err) {
                console.log(err);
                return;
            }
            cb();
        })
    },

    list : function(req, res, cb){
        Cv.find({}, function(err, docs){
            console.log("list", err, docs);
            cb(null, docs);
        });
    },

    fetch : function(req, res, cb){
        console.log("fetch called", decodeURIComponent(req.uri.child()));
        Cv.find({email: decodeURIComponent(req.uri.child())}, function(err, doc){
            console.log(req.uri.child(), err, doc);
            cb(null, doc);
        });
    }

});

cvCollection.extendedHandler = {
    DELETE : function(req, res){
        Cv.remove({}, function(err){
            if(err)	console.log("an error occurred", err);
        });
        res.writeHead(204);
        res.end();
    }
}

cvCollection.imagesHandler = {
    DELETE : function(req, res) {
        console.log("delete image", decodeURI(req.uri.child()));
        var fs = require('fs');

        fs.unlinkSync(decodeURI(__dirname + "/../static/images/" + req.uri.child()))
        console.log('successfully deleted '+decodeURI(req.uri.child()));
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
	port : process.env.OPENSHIFT_NODEJS_PORT || 3001,
	staticDir: __dirname + '/../static'
};

var server = new Percolator(app);

server.server.ip = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";

server.connectMiddleware(multiparty);

server.route('/documents',                      documentsCollection.handler);
server.route('/documents/:id',                  documentsCollection.wildcard);
server.route('/documents/images/upload/:id',    documentsCollection.imagesHandler);
server.route('/documents/testUtil/destroy',     documentsCollection.extendedHandler);
server.route('/designers',                      cvCollection.handler);
server.route('/designers/:id',                  cvCollection.wildcard);
server.route('/designers/images/upload/:email', cvCollection.imagesHandler);
server.route('/designers/testUtil/destroy',     cvCollection.extendedHandler);

server.listen(function(){
	console.log(server.server.router.routes);
	console.log('Listening on:', server.server.ip +":"+server.server.port);
});
