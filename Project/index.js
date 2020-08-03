var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');
const rand = require('crypto-random-string');
var pdf = require('./pdf');

var handlebars = require('express-handlebars').create({defaultLayout:'main', helpers: {
    ismatch: function(value, page) {return value == page ? true : false;}
}});

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.argv[2]);

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
    res.status(200);
    res.render('home', {page_name: 'home'});
})
.get('/trips', function(req, res, next) {
    res.status(200);
    res.render('trips', {page_name: 'trips'});
})
.get('/book', function(req, res, next) {
    res.status(200);
    res.render('book', {page_name: 'book'});
})
.get('/about', function(req, res, next) {
    res.status(200);
    res.render('about', {page_name: 'about'});
});

app.post('/api', function(req, res, next) {
    let prefix = req.body.namelast.slice(0, 2);
    let suffix = rand({length: 24});

    let ticket = prefix + ":" + suffix;

    console.log(req.body);

    mysql.pool.query("INSERT INTO customer(`namefirst`,`namelast`,`prefix`,`address`,`state`,`destin`,`depart`,`ticket`) VALUES (?,?,?,?,?,?,?,?)", 
        [req.body.namefirst, req.body.namelast, prefix, req.body.address, req.body.state, req.body.destin, req.body.depart, ticket], 
        function(error, result) {
            if (error) {
                next(error);
                return;
            }

            console.log(result);

            pdf(req.body.namefirst + req.body.namelast, ticket, req.body.destin, req.body.depart)
            .then((file) => {
                res.status(200);
                res.setHeader('Content-Type', 'application/pdf; charset=utf-8');
                res.setHeader('Content-Desposition', 'attachment;filename=ticket.pdf');
                res.setHeader('Content-Length', file.length);
                res.setHeader('Content-Security-Policy', "default-src 'self'");
                res.end(file);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(console.log("Ticket!"));
        }
    );

});

app.get('/api/rebuild-table', function(req, res, next) {
    mysql.pool.query("DROP TABLE IF EXISTS customer", function(err){
        var createString = "CREATE TABLE customer("+
        "id INT PRIMARY KEY AUTO_INCREMENT,"+
        "namefirst VARCHAR(255) NOT NULL,"+
        "namelast VARCHAR(255) NOT NULL,"+
        "prefix CHAR(3) NOT NULL,"+
        "address VARCHAR(255) NOT NULL,"+
        "state CHAR(3) NOT NULL,"+
        "destin VARCHAR(8) NOT NULL,"+
        "depart DATE,"+
        "ticket CHAR(28) NOT NULL)";
        mysql.pool.query(createString, function(err) {
            console.warn("Table reset");
            res.status(200);
            res.send('OK');
        });
    });
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
