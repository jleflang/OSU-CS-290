// Things to test
let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(null,null));
console.log(deepEqual(777,null));
console.log(deepEqual(obj,obj));
console.log(deepEqual(obj,null));
console.log(deepEqual(obj,777));
console.log(deepEqual(777,777));
console.log(deepEqual(obj,{here: 1, object: 2}));
console.log(deepEqual(77,777));

// The deepEqual func
function deepEqual(x, y) {
    // If both params are identical, return true
    if (x === y) return true;

    // Mismatched length
    if (Object.keys(x).length !== Object.keys(y).length) return false;

    // If both params are objects
    if (typeof x == "object" && x != null) {
        if (typeof y == "object" && y != null) {

            // Check keys
            for (var key in Object.keys(x)) {
                // Check to see if the key is in y
                if (!(key in y)) return false;

                // The key was found in both
                // Recursively go through
                return deepEqual(x[key],y[key]);
            }

            // No mismatch
            return true;

        } else return false;
    } else if (x !== y) {return false;} // A mismatch is found
    // No mismatch
    else return true;

};
