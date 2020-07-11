var apiKey = config.key;

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
    document.getElementById('submitWeather').addEventListener('click', function(event){
        var req = new XMLHttpRequest();

        let input = document.getElementById('locGet').value;
        // https://www.w3schools.com/jsref/jsref_split.asp 
        // using to split the string to great effect
        let res = input.split(',');

        var loc = res[0];
        var country = res[1];

        // https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
        if (isNaN(loc)) {
            req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + loc + ',' + country + '&units=imperial&appid=' + apiKey, true);
        } else {
            req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?zip=' + loc + ',' + country + '&units=imperial&appid=' + apiKey, true);
        }
        req.send(null);

        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                document.getElementById('locRequest').textContent = response.name + ', ' + response.sys.country;
                document.getElementById('reply').textContent = response.weather[0].main + ', Temperature: ' + response.main.temp + '\xB0F, Wind: ' + 
                response.wind.speed + ' miles/hour @ ' + response.wind.deg + '\xB0';
            } else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        event.preventDefault();
    })

    document.getElementById('submitHttpBin').addEventListener('click', function(event){
        var req = new XMLHttpRequest();
        var payload = null;

        payload = document.getElementById('postHttpbin').value;

        req.open('POST', 'https://httpbin.org/post', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(payload);

        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                var response = JSON.parse(req.responseText);
                document.getElementById('httpBinResponse').textContent = response.data;
            } else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        event.preventDefault();
    })
}