const e = require('express');
var express = require('express');
var exphbs = require('express-handlebars');
var fs = require('fs')

var peopleData = require('./peopleData');

var app = express();
var port = process.env.PORT || 8000;

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static('public'));

app.get('/', function (req, res, next) {
	res.status(200).render('homePage');
});

app.get('/people', function (req, res, next) {
	res.status(200).render('peoplePage', {
		people: peopleData
	});
});

app.get('/people/:person', function (req, res, next) {
	var person = req.params.person.toLowerCase();
	if (peopleData[person]) {
		res.status(200).render('photoPage', peopleData[person]);
	} else {
		next();
	}
});

app.post('/people/:person/addPhoto',function(req,res,next){
	console.log("req.body: ",req.body);
	var url = req.body.url;
	var caption = req.body.caption;
	var person = req.params.person.toLowerCase();

	if(peopleData[person]){
		if(url &&caption){
			//next();
			peopleData[person].photos.push({
				url: url,
				caption: caption
			})

			fs.writeFile(
				__dirname + '/peopleData.json',
				JSON.stringify(peopleData, null,2),
				function(err){
					if(!err){
						res.status(200).send("g8 success");
					}
					else{
						res.status(500).send("pain in my as whole 500")
					}
				}
			)
		}
		else{
			res.status(400).send("pain in my as whole 400");
		}
	}
	else{
		next();
	}
});

app.get('*', function (req, res, next) {
	res.status(404).render('404', {
		page: req.url
	});
});

app.listen(port, function () {
	console.log("== Server listening on port", port);
})
