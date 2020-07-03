/*
    Fixed to not result in undefined behaviors
    Taken from http://www.javascriptkit.com/javatutors/closures2.shtml
    Example 5
*/


function buildList(list) {
    var result = [];
    var newLog = console.log.bind(console)
    for (var i = 0; i < list.length; i++) {
        var item = 'item' + list[i];
        result.push( function() {newLog(item + ' ' + list[i])} );
    }
    return result;
}
 
function testList() {
    var fnlist = buildList([1,2,3]);
    // using j only to help prevent confusion - could use i
    for (var j = 0; j < fnlist.length; j++) {
        fnlist[j]();
    }
}

testList();
