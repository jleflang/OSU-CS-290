// Listen
document.addEventListener('DOMContentLoaded', submitBind);

// Create the table
document.addEventListener('DOMContentLoaded', createTable);

// Const for form
const exerciseForm = document.getElementById('form');


/*
    submitBind function

*/
function submitBind () {
    exerciseForm.addEventListener('submit', function(event) {
        var req = new XMLHttpRequest();

        let name = document.getElementsById('name').value;
        let reps = document.getElementsById('reps').value;
        let weight = document.getElementById('weight').value;
        let date = document.getElementById('date').value;
        let lbs = document.getElementById('lbs').value;

        let content = {'name':name,'reps':reps,'weight':weight,'date':date,'lbs':lbs};

        req.open('POST', '/?type=create', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(content);

        req.addEventListener('load', function() {
            if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.responseText);
                createRow(response.id, response.name, response.reps, response.weight, response.date, response.lbs);
            } else {
                console.error(req.statusText);
            }
        });

        event.preventDefault();
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
    createRow function

*/
function createRow (id, name, reps, weight, date, lbs) {
    var tbody = document.getElementById('entry');

    let row = document.createElement('tr');
    row.setAttribute('id', id);

    let exer = document.createElement('th');
    exer.textContent = name;

    let num_reps = document.createElement('td');
    num_reps.textContent = reps;

    let weights = document.createElement('td');
    weights.textContent = weight;

    let dates = document.createElement('td');
    dates.textContent = date;

    let is_lbs = document.createElement('td');
    is_lbs.textContent = lbs;

    let form = document.createElement('form');

    let ids = document.createElement('input');
    ids.setAttribute('hidden');
    ids.setAttribute('name', 'id');
    ids.setAttribute('value', id);
    form.appendChild(ids);

    let update = document.createElement('input');
    update.setAttribute('button');
    update.setAttribute('id', 'update');
    update.setAttribute('class', 'update');
    update.setAttribute('value', 'Update');
    update.addEventListener('click', updateHandler(event, id));
    form.appendChild(update);

    let del = document.createElement('input');
    del.setAttribute('button');
    del.setAttribute('id', 'delete');
    del.setAttribute('class', 'delete');
    del.setAttribute('value', 'Delete');
    del.addEventListener('click', deleteHandler(this, id));
    form.appendChild(del);

    row.appendChild(exer);
    row.appendChild(num_reps);
    row.appendChild(weights);
    row.appendChild(dates);
    row.appendChild(is_lbs);
    row.appendChild(form);

    tbody.appendChild(row);
}

/*
    updateRow function

*/
function updateRow (table, id, name, reps, weight, date, lbs) {
    
}

/*
    deleteRow function

*/
function deleteRow (table, id) {

}

/*
    updateHandler function

*/
function updateHandler (event, id) {
    var req = new XMLHttpRequest();

    let table = document.getElementById('workouts');
    let name = document.getElementsById('name').value;
    let reps = document.getElementsById('reps').value;
    let weight = document.getElementById('weight').value;
    let date = document.getElementById('date').value;
    let lbs = document.getElementById('lbs').value;

    let content = {'name':name,'reps':reps,'weight':weight,'date':date,'lbs':lbs};

    req.open('POST', '/?type=update&id=' + id, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(content);

    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            updateRow(table, response.id, response.name, response.reps, response.weight, response.date, response.lbs);
        } else {
            console.error(req.statusText);
        }
    });

    event.preventDefault();
}

/*
    deleteHandler function

*/
function deleteHandler (event, id) {
    var req = new XMLHttpRequest();

    req.open('POST', '/?type=delete&id=' + id, true);
    req.send(null);

    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            deleteRow(id);
            console.log('Row deleted successfully!');
        } else {
            console.error(req.statusText);
        }
    });

    event.preventDefault();
}
