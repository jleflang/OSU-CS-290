var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', 35829);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req, res){
    var qtable = [];

    for (var q in req.query) {
        qtable.push({'q': q, 'value': req.query[q]});
    }
    var table = {};
    table.request = qtable;
    console.info("<= GET:\n" + JSON.stringify(table, null, '\t'));

    res.render('get', table); 
});

app.post('/', function(req, res){
    var qtable = [];
    var qtable2 = [];

    for (var q in req.query) {
        qtable.push({'q': q, 'value': req.query[q]});
    }

    for (var r in req.body) {
        qtable2.push({'r': r, 'body': req.body[r]});
    }

    var table = {};
    table.request = qtable;
    table.reply = qtable2;
    console.info("POST!");
    console.info("<= GET:\n" + JSON.stringify(table.request, null, '\t'));
    console.info("<= POST:\n" + JSON.stringify(table.reply, null, '\t'));
 
    res.render('post', table);
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