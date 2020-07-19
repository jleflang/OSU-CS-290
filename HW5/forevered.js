// https://stackoverflow.com/questions/6524716/using-forever-with-node-js
// Better way to utilize forever to keep zombie processes at bay.
var forever = require('forever');

  var child = new (forever.Monitor)('main.js', {
    max: 3,
    silent: true,
    options: [],
    logFile: 'forever/console.log',
    outFile: 'forever/out.log',
    errFile: 'forever/error.log'
  });

  child.on('exit', function () {
    console.log('main.js has exited after 3 restarts');
  });

  child.on('stop', function () {
    console.log('received stop!');
    setTimeout(function() {
        console.log('Exiting after some time.');
        process.exit();
    }, 1000);
  });

  // https://stackoverflow.com/questions/26782861/where-place-forever-monitor-code
  process.on( 'SIGINT', function() {
    console.log( "\nGracefully shutting down \'node forever\' from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    process.exit();
  });

  process.on( 'exit', function() {
    console.log( 'About to exit \'node forever\' process.' );
  });

  child.start();
  forever.startServer(child);