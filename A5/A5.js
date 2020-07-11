var apiKey = 'b63aa6f556f33f2023cfbef3a6bca38f';

document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
    document.getElementById('submitCity').addEventListener('click', function(event){
        var req = new XMLHttpRequest();
        var payload = {cityGet:null};

        payload.cityGet = document.getElementById('cityGet').value;

        req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + payload.cityGet + '&units=imperial&appid=' + apiKey, true);
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

    document.getElementById('submitZip').addEventListener('click', function(event){
        var req = new XMLHttpRequest();
        var payload = {zipGet:null};

        payload.zipGet = document.getElementById('zipGet').value; 
        req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?zip=' + payload.zipGet + '&units=imperial&appid=' + apiKey, true);
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