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
  if (req.query['type'] == 'request') {
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query['id']], function (err, entry, fields) {
      if (err) {
        next(err);
        return;
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.status(200);
      res.send(JSON.stringify(entry[0]));
    });
  } else {
    res.render('home');
  } 
})
.post('/', function(req, res, next) {
  if (req.query['type'] == 'create') {
      
    mysql.pool.query("INSERT INTO workouts(`id`,`name`,`reps`,`weight`,`date`,`lbs`) VALUES (NULL,?,?,?,?,?)", 
    [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result) {
      if (err) {
        next(err);
        return;
      }
  
      console.log(result);
      res.setHeader('Content-Type', 'text/plain');
      res.status(200);
      res.send(result.insertId.toString());
    });
  }

  if (req.query['type'] == 'update') {
 
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query['id']], function(err, result) {
      if (err) {
        next(err);
        return;
      }
      if (result.length == 1) {
        var curVals = result[0];
        mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", 
        [req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, 
          req.body.date || curVals.date, req.body.lbs || curVals.lbs, req.body.id],
        function(err, result) {
          if (err) {
            next(err);
            return;
          }

          console.log(result);
          res.setHeader('Content-Type', 'text/plain');
          res.status(200);
          res.send(result.changedRows.toString());
        });
      }
    });
  }
  
  if (req.query['type'] == 'delete') {
    mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query['id']], function(err, result) {
      if (err) {
        next(err);
        return;
      }

      console.log(result);
      res.setHeader('Content-Type', 'text/plain');
      res.status(200);
      res.send(result.affectedRows.toString());
    });
  }

});

app.get('/reset-table', function(req, res, next){
    mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
      var createString = "CREATE TABLE workouts("+
      "id INT PRIMARY KEY AUTO_INCREMENT,"+
      "name VARCHAR(255) NOT NULL,"+
      "reps INT,"+
      "weight INT,"+
      "date DATE,"+
      "lbs BOOLEAN)";
      mysql.pool.query(createString, function(err){
        context.results = "Table reset";
        res.render('home');
      })
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
