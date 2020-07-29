// Listen
document.addEventListener('DOMContentLoaded', submitBind);
document.addEventListener('DOMContentLoaded', editBind);

// Create the table
document.addEventListener('DOMContentLoaded', createTable);
document.addEventListener('DOMContentLoaded', initialRows);


/*
    submitBind function

*/
function submitBind () {
    document.getElementById('submit').addEventListener('click', function(event) {
        event.preventDefault();

        var req = new XMLHttpRequest();

        let name = document.getElementById('name').value;
        let reps = document.getElementById('reps').value;
        let weight = document.getElementById('weight').value;
        let date = document.getElementById('date').value;
        // https://stackoverflow.com/questions/3869535/how-to-get-the-selected-radio-button-value-using-js
        let lbs = document.querySelector('input[name = "lbs"]:checked').value;

        let content = {'name': name, 'reps': reps, 'weight': weight, 'date': date, 'lbs': lbs};

        req.open('POST', '/', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('Accept', 'text/plain');
        req.send(JSON.stringify(content));

        req.addEventListener('load', function() {
            if (req.status >= 200 && req.status < 400) {
                let id = req.responseText;
                createRow(id)
                .then(function(status) {
                    console.log(status);
                })
                .catch(function(error) {
                    alert(error);
                });
            } else {
                console.error(req.statusText);
            }
        });
        
    });
}

/*
    editBind function

*/

function editBind () {  
    document.getElementById('edit').addEventListener('click', function (event) {
        event.preventDefault();

        var req = new XMLHttpRequest();

        this.parentNode.parentNode.parentNode.parentNode.style.display = "none";

        let id = document.getElementById('modid').value;
        let name = document.getElementById('modname').value;
        let reps = document.getElementById('modreps').value;
        let weight = document.getElementById('modweight').value;
        let date = document.getElementById('moddate').value;
        let lbs = document.querySelector('input[name = "modlbs"]:checked').value;

        let content = {'name': name, 'reps': reps, 'weight': weight, 'date': date, 'lbs': lbs};

        req.open('PUT', '/?id=' + id, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('Accept', 'text/plain');
        req.send(JSON.stringify(content));

        req.addEventListener('load', function() {
            if (req.status >= 200 && req.status < 400) {
                updateRow(id, name, reps, weight, date, lbs)
                .then(function (status) {
                    console.log(status);
                })
                .catch(function (err) {
                    console.error(err);
                });
            } else {
                console.error(req.statusText);
            }
        });
    });
}

/*
    createTable function

*/
function createTable () {
    var table = document.createElement('table');
    table.setAttribute('id', 'workouts');

    var header = document.createElement('thead');

    let heads = ['Name of Exercise', 'Number of Reps', 'Weight Used', 'Unit', 'Date'];

    heads.forEach(label => {
        let head = document.createElement('th');
        head.textContent = label;
        header.appendChild(head);
    });

    table.appendChild(header);

    var body = document.createElement('tbody');
    body.setAttribute('id', 'entry');

    table.appendChild(body);

    document.body.appendChild(table);
}

/*
    initialRows function

*/
function initialRows () {
    var req = new XMLHttpRequest();

    req.open('GET', '/?type=request&id=all', true);
    req.setRequestHeader('Accept', 'application/json');
    req.send(null);

    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            let resp = req.status != 204 ? JSON.parse(req.responseText) : [];

            for (var i = 0; i < resp.length; i++) {
                createRow(resp[i].id)
                .then(function(load) {
                    console.log(load);
                })
                .catch(function(err) {
                    console.error(err);
                });
            }
        } else {
            console.log('BAD END');
        }
    });
}

/*
    createRow function as a Promise

*/
function createRow (id) {
    return new Promise( function(resolve, reject) {
        var req = new XMLHttpRequest();

        req.open('GET', '/?type=request&id=' + id, true);
        req.setRequestHeader('Accept', 'application/json');
        req.send(null);

        req.addEventListener('load', function() {
            if (req.status >= 200 && req.status < 400) {

                if (req.responseText == null) {
                    reject('EMPTY RETURN');
                }

                var response = JSON.parse(req.response);

                var tbody = document.getElementById('entry');

                let row = document.createElement('tr');

                let exer = document.createElement('th');
                exer.setAttribute('id', 'name');
                exer.textContent = response.name;

                let num_reps = document.createElement('td');
                num_reps.setAttribute('id', 'reps');
                num_reps.textContent = response.reps;

                let weights = document.createElement('td');
                weights.setAttribute('id', 'weight');
                weights.textContent = response.weight;

                let dates = document.createElement('td');
                dates.setAttribute('id', 'date');
                let rawDate = new Date(response.date);
                dates.textContent = 
                    (rawDate.getMonth() + 1) + '-' + rawDate.getDate() + '-' + rawDate.getFullYear();

                let is_lbs = document.createElement('td');
                is_lbs.setAttribute('id', 'lbs');
                is_lbs.textContent = convertLbs(response.lbs);

                let mod = document.createElement('td');
                let form = document.createElement('form');
                form.setAttribute('id', 'editform');

                let ids = document.createElement('input');
                ids.setAttribute('type', 'hidden');
                ids.setAttribute('id', 'id');
                ids.setAttribute('value', id);
                form.appendChild(ids);

                let update = document.createElement('input');
                update.setAttribute('type', 'button');
                update.setAttribute('id', 'update');
                update.setAttribute('class', 'update');
                update.setAttribute('value', 'Update');
                update.setAttribute('onclick', "editWindow('entry', this)");
                form.appendChild(update);

                let del = document.createElement('input');
                del.setAttribute('type', 'button');
                del.setAttribute('id', 'delete');
                del.setAttribute('class', 'delete');
                del.setAttribute('value', 'Delete');
                del.setAttribute('onclick', "deleteHandler('entry', this)");
                form.appendChild(del);

                mod.appendChild(form);

                row.appendChild(exer);
                row.appendChild(num_reps);
                row.appendChild(weights);
                row.appendChild(is_lbs);
                row.appendChild(dates);
                row.appendChild(mod);

                tbody.appendChild(row);

                resolve('ROW '+ id + ' ADDED');
            } else {
                reject('ROW NOT ADDED');
            }
        })

        
    });
}

/*
    updateRow function

*/
function updateRow (id, name, reps, weight, date, lbs) {
    return new Promise(function (resolve, reject) {
        try {
            let table = document.getElementById('entry');
            let rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                var row = table.rows[i];

                if (row.children[5].firstChild.firstChild.value == id) {
                    
                    row.cells[0].innerText = name;
                    row.cells[1].innerText = reps;
                    row.cells[2].innerText = weight;
                    row.cells[3].innerText = convertLbs(lbs);
                    let rawDate = new Date(date);
                    row.cells[4].innerText = 
                        (rawDate.getMonth() + 1) + '-' + (rawDate.getDate() + 1) + '-' + rawDate.getFullYear();
                    
                    break;
                }
            }

            resolve('Row ' + id + ' updated');
        }
        catch {
            reject('Row was not updated');
        }
    });
}

/*
    convertLbs function

*/
function convertLbs (is_lbs) {
    return is_lbs == 1 ? 'lbs' : 'kgs';
}

/*
    deleteRow function as a Promise

*/
function deleteRow (tableId, id) {
    return new Promise(function (resolve, reject) {
        try {
            let table = document.getElementById(tableId);
            let rowCount = table.rows.length;

            for (var i = 0; i < rowCount; i++) {
                var row = table.rows[i];

                if (row == id.parentNode.parentNode.parentNode) {
                    table.deleteRow(i);
                    break;
                }
            }

            resolve('DELETE SUCCESSFUL');
        }
        catch {
            reject('Not able to delete');
        }
    });
}

/*
    editWindow function

*/
function editWindow (tableId, id) {
    // https://www.w3schools.com/howto/howto_css_modals.asp
    event.stopPropagation();

    let rowId = document.getElementById('id').value;

    let modal = document.getElementById("editModal");

    let span = document.getElementsByClassName('cancel')[0];

    span.onclick = function () {
        modal.style.display = "none";
    }

    modal.style.display = "block";

    document.getElementById('modid').value = rowId;

    let table = document.getElementById(tableId);
    let rowCount = table.rows.length;

    for (var i = 0; i < rowCount; i++) {
        var row = table.rows[i];

        if (row == id.parentNode.parentNode.parentNode) {

            document.getElementById('modname').value = row.children[0].innerText;
            document.getElementById('modreps').value = row.children[1].innerText;
            document.getElementById('modweight').value = row.children[2].innerText;

            let rawDate = row.children[4].innerText.split('-');
            
            // https://stackoverflow.com/questions/6982692/how-to-set-input-type-dates-default-value-to-today
            document.getElementById('moddate').value = 
                new Date(rawDate[2] + '-' + rawDate[0] + '-' + rawDate[1]).toISOString().split('T')[0];
    
            if (row.children[3].innerText == 'lbs') {
                document.getElementsByClassName('modunit')[0].checked = true;
            } else {
                document.getElementsByClassName('modunit')[1].checked = true;
            }
        }
    }
}

/*
    deleteHandler function

*/
function deleteHandler (tableId, id) {
    var req = new XMLHttpRequest();

    let rowId = id.previousSibling.previousSibling.value;

    req.open('DELETE', '/?id=' + rowId, true);
    req.setRequestHeader('Accept', 'text/plain');
    req.send(null);

    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            deleteRow(tableId, id)
            .then(function (status) {
                console.log(status);
            })
            .catch(function (err) {
                console.error(err);
            });
            
        } else {
            console.error(req.statusText);
        }
    });
    event.stopPropagation();
    event.preventDefault();
}
