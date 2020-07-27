// Listen
document.addEventListener('DOMContentLoaded', submitBind);

// Create the table
document.addEventListener('DOMContentLoaded', createTable);


/*
    submitBind function

*/
function submitBind () {
    // Const for form
    const exerciseForm = document.getElementById('form');

    exerciseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var req = new XMLHttpRequest();

        let name = document.getElementById('name').value;
        let reps = document.getElementById('reps').value;
        let weight = document.getElementById('weight').value;
        let date = document.getElementById('date').value;
        let lbs = document.getElementById('lbs').value;

        let content = {'name':name,'reps':reps,'weight':weight,'date':date,'lbs':lbs};

        req.open('POST', '/?type=create', true);
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
    createTable function

*/
function createTable () {
    var table = document.createElement('table');
    table.setAttribute('id', 'workouts');

    var header = document.createElement('thead');

    let heads = ['Name of Exercise', 'Number of Reps', 'Weight Used', 'Date', 'Unit'];

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
                dates.textContent = new Date(response.date).toLocaleDateString('en-US');

                let is_lbs = document.createElement('td');
                is_lbs.setAttribute('id', 'lbs');
                is_lbs.textContent = convertLbs(response.lbs);

                let mod = document.createElement('td');
                let form = document.createElement('form');

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
                update.setAttribute('onclick', "updateHandler(this)");
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
                row.appendChild(dates);
                row.appendChild(is_lbs);
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
            let row = document.getElementById(id).childNodes;

            row.getElementById('name').textContent = name;
            row.getElementById('reps').textContent = reps;
            row.getElementById('weight').textContent = weight;
            row.getElementById('date').textContent = new Date(date).toLocaleDateString('en-US');
            row.getElementById('lbs').textContent = convertLbs(lbs);

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
    if (is_lbs == 1) {
        return 'lbs';
    } else {
        return 'Kgs';
    }
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
    updateHandler function

*/
function updateHandler (id) {
    var req = new XMLHttpRequest();

    let name = document.getElementById('name').value;
    let reps = document.getElementById('reps').value;
    let weight = document.getElementById('weight').value;
    let date = document.getElementById('date').value;
    let lbs = document.getElementById('lbs').value;

    let content = {'name':name,'reps':reps,'weight':weight,'date':date,'lbs':lbs};

    req.open('POST', '/?type=update&id=' + id.toString(), true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Accept', 'text/plain');
    req.send(JSON.stringify(content));

    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            updateRow(response.id, response.name, response.reps, response.weight, response.date, response.lbs)
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

/*
    deleteHandler function

*/
function deleteHandler (tableId, id) {
    var req = new XMLHttpRequest();

    let rowId = document.getElementById('id');

    req.open('POST', '/?type=delete&id=' + rowId.value, true);
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
