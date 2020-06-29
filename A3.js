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
    // If both params are null, return true
    if (x === null && y === null) return true;

    // If both params are objects
    if (typeof x == "object" && x != null) {
        if (typeof y == "object" && y != null) {
            // Mismatched length
            if (Object.keys(x).length !== Object.keys(y).length) return false;

            // Check keys
            for (var key in Object.keys(x)) {
                // Check to see if the key is in y
                if (!(key in Object.keys(y))) return false;

                // The key was found
                // But there is a mismatch in values
                if (x[key] !== y[key]) return false;

                // If the values are objects
                if (typeof x[key] === "object" && x[key] != null) {
                    if (typeof y[key] === "object" && y[key] != null) {
                        // Recursively go through
                       return deepEqual(x[key],y[key]);
                    } else return false;

                } else if (x[key] === y[key]) {return true;} // The values at key match
                // No match
                else return false;
            }
        } else return false;
    } else if (x === y) {return true;} // We are not handling objects or nulls
    // No match
    else return false;

};
