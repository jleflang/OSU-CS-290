// This function works due to function hoisting
console.log(add(2,3));

function add(x, y) {
  return x + y;

}

// This code does not work
console.log(z(2,3));

var z = function(x, y) {
  return x * x + y;

}
