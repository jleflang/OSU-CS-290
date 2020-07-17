// Add some style
document.body.style.cssText = "font-family: Arial, Helvetica, sans-serif; text-align: center; margin: 20px;";

// Create UI
createTable();
createButtons();

// Cursor Position
var cursorPos = {
    "row": 0,
    "col": 0,
};

// DOM Event: Content Loaded
document.addEventListener("DOMContentLoaded", highlightCell(cursorPos.row, cursorPos.col));
document.addEventListener("DOMContentLoaded", cursorSelect(cursorPos.row, cursorPos.col));
document.addEventListener("DOMContentLoaded", bindButtons);

/*
    bindButtons function

 */
function bindButtons () {
    // go button
    document.getElementById("go").addEventListener("click", function(event) {

        highlightCell(cursorPos.row, cursorPos.col);

        event.stopPropagation();
    });
    // n(orth) button
    document.getElementById("n").addEventListener("click", function(event) {
        if (cursorPos.row > 0) {
            cursorDeselect(cursorPos.row, cursorPos.col);

            cursorPos.row -= 1;

            cursorSelect(cursorPos.row, cursorPos.col);
        }

        event.stopPropagation();
    });
    // s(outh) button
    document.getElementById("s").addEventListener("click", function(event) {
        if (cursorPos.row < 3) {
            cursorDeselect(cursorPos.row, cursorPos.col);

            cursorPos.row += 1;

            cursorSelect(cursorPos.row, cursorPos.col);
        }

        event.stopPropagation();
    });
    // e(ast) button
    document.getElementById("e").addEventListener("click", function(event) {
        if (cursorPos.col > 0) {
            cursorDeselect(cursorPos.row, cursorPos.col);

            cursorPos.col -= 1;

            cursorSelect(cursorPos.row, cursorPos.col);
        }

        event.stopPropagation();
    });
    // w(est) button
    document.getElementById("w").addEventListener("click", function(event) {
        if (cursorPos.col < 3) {
            cursorDeselect(cursorPos.row, cursorPos.col);

            cursorPos.col += 1;

            cursorSelect(cursorPos.row, cursorPos.col);
        }

        event.stopPropagation();
    });
}

/*
    createTable function

 */
function createTable () {
    // create the Table with style
    var tableSet = document.createElement("table");
    tableSet.style.cssText = "table-layout: fixed; width: 355px; height: 355px; border: 3px solid black; padding: 2px;";

    // create the Header
    var header = document.createElement("thead");

    // for the desired range, add the content of the header
    for (var i = 0; i < 4; i++) {
        let tableHead =  document.createElement("th");
        tableHead.textContent = "Header " + (i + 1).toString();
        tableHead.style.margin = "2px";
        header.appendChild(tableHead);
    }

    // create the body
    var body = document.createElement("tbody");

    // for all possible rows
    for (var i = 0; i < 4; i++) {
        // add a row
        body.appendChild(document.createElement("tr"));
        body.rows[i].style.cssText = "margin: 5px; height: 68.25px;";

        // add a cell to the row
        for (var j = 0; j < 4; j++) {
            let cell = document.createElement("td");
            cell.textContent = (i + 1).toString() + ',' + (j + 1).toString();
            cell.setAttribute("id", i.toString() + ',' + j.toString());
            cell.setAttribute("style", "border: 3px ridge grey;");
            body.rows[i].appendChild(cell);
        }
    }

    // add the header and body to the table
    tableSet.appendChild(header);
    tableSet.appendChild(body);

    // add to the body
    document.body.appendChild(tableSet);

    // log we loaded the table
    console.log("Table loaded");

}

/*
    createButtons function

 */

function createButtons () {
    var buttonConfig = document.createElement("div");

    // Learning to use grid layout
    // https://www.sitepoint.com/seven-ways-you-can-place-elements-using-css-grid-layout/
    // https://www.w3schools.com/css/css_grid_item.asp

    buttonConfig.setAttribute("class", "btn-group");
    
    buttonConfig.style.cssText = "display: grid; width: 355px; height: 230px; padding-top: 10px; grid-template-columns: 1fr 1fr 1fr; \
    grid-template-areas: '..... north .....' 'east go west' '..... south .....' '..... ..... .....'; grid-gap: 10px;";

    var buttonN = document.createElement("button");
    var buttonE = document.createElement("button");
    var buttonW = document.createElement("button");
    var buttonS = document.createElement("button");
    var buttonGo = document.createElement("button");

    // id the buttons
    buttonN.setAttribute("id", "n");
    buttonE.setAttribute("id", "e");
    buttonW.setAttribute("id", "w");
    buttonS.setAttribute("id", "s");
    buttonGo.setAttribute("id", "go");

    // Set button css
    buttonN.style.cssText = "grid-area: north; font-size: x-large;";
    buttonE.style.cssText = "grid-area: east; font-size: x-large;";
    buttonW.style.cssText = "grid-area: west; font-size: x-large;";
    buttonS.style.cssText = "grid-area: south; font-size: x-large;";
    buttonGo.style.cssText = "grid-area: go; font-weight: bold;";

    // add the text
    buttonN.textContent = "\u2191";
    buttonE.textContent = "\u2190";
    buttonW.textContent = "\u2192";
    buttonS.textContent = "\u2193";
    buttonGo.textContent = "Mark Cell";

    // add the buttons to the panel
    buttonConfig.appendChild(buttonN);
    buttonConfig.appendChild(buttonE);
    buttonConfig.appendChild(buttonGo);
    buttonConfig.appendChild(buttonW);
    buttonConfig.appendChild(buttonS);

    // add the panel to the page
    document.body.appendChild(buttonConfig);

    // log we loaded the buttons
    console.log("Buttons loaded");
}

/*
    highlightCell function

 */
function highlightCell (row, col) {

    let cell = document.getElementById(row.toString() + "," + col.toString());

    cell.style.background = "yellow";
}

/*
    cursorSelect function

 */
function cursorSelect (row, col) {

    let cell = document.getElementById(row.toString() + "," + col.toString());

    cell.style.borderWidth = "5px";
    cell.style.borderStyle = "solid";
    cell.style.borderColor = "black";
}

/*
    cursorDeselect function
    
 */
function cursorDeselect (row, col) {

    let cell = document.getElementById(row.toString() + "," + col.toString());

    cell.style.borderWidth = "3px";
    cell.style.borderStyle = "ridge";
    cell.style.borderColor = "grey";
}