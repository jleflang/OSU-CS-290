/*
    Fixed to not result in undefined behaviors
    Taken from http://www.javascriptkit.com/javatutors/closures2.shtml
    Example 5
*/


function buildList(list) {
    // Local var
    var result = [];

    // Let's bind the console to insure function in cli node
    var newLog = console.log.bind(console)

    for (var i = 0; i < list.length; i++) {
        // To loop correctly, make a closure out of i and includes the args of
        //  the enclosed code
        ( function(i) {
            // Create an item
            var item = 'item' + list[i];

            // Push to list
            result.push( function() {newLog(item + ' ' + list[i])} );
        })(i);
    }
    return result;
}
 
function testList() {
    // Example list
    var fnlist = buildList([1,2,3]);
    // using j only to help prevent confusion - could use i
    for (var j = 0; j < fnlist.length; j++) {
        fnlist[j]();
    }

}

// Test it!
testList();
