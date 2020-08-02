var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.argv[2]);

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
    res.status(200);
    res.render('home', {page_name: 'home', helpers:{
        ismatch: function(value, page) {return value == page ? true : false;}
    }});
})
.get('/trips', function(req, res, next) {
    res.status(200);
    res.render('trips', {page_name: 'trips', helpers:{
        ismatch: function(value, page) {return value == page ? true : false;}
    }});
})
.get('/book', function(req, res, next) {
    res.status(200);
    res.render('book', {page_name: 'book', helpers:{
        ismatch: function(value, page) {return value == page ? true : false;}
    }});
})
.get('/about', function(req, res, next) {
    res.status(200);
    res.render('about', {page_name: 'about', helpers:{
        ismatch: function(value, page) {return value == page ? true : false;}
    }});
});

app.use(function(req, res){
    console.warn("Bad path at " + req.path);
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });
