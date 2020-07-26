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

  let context = {};

  mysql.pool.query("SELECT * FROM workouts", function (err, rows, fields) {
    if (err) {
      next(err);
      return;
    }

    let entry = [];

    for (let data in rows) {
      entry.push(data);
    }

    res.render('home', context);
  });
})
.post('/', function(req, res, next) {
    
  let context = {};

  if (req.body['submit']) {
    for (let q in req.query) {
      context.push(req.query[q]);
    }
  
    mysql.pool.query("INSERT INTO workouts (`id`,`name`,`reps`,`weight`,`date`,`lbs`) VALUES (NULL,?,?,?,?,?)", 
    context, function(err, result) {
      if (err) {
        next(err);
        return;
      }
  
      let entry = JSON.parse(result);
      console.log(result);
      res.render('home', entry);
    });
  }

  if (req.body['update']) {
 
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result) {
      if (err) {
        next(err);
        return;
      }
      if (result.length == 1) {
        var curVals = result[0];
        mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", 
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
        function(err, result) {
          if (err) {
            next(err);
            return;
          }
          res.send(result);
        });
      }
    });
  }
  
  if (req.body['delete']) {
    mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result) {
      if (err) {
        next(err);
        return;
      }


    });
  }

});

app.get('/reset-table', function(req, res, next){
    var context = {};
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
        res.render('home',context);
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
