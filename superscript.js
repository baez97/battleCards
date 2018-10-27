var request=require("request");

//var url='https://spacechallenge.herokuapp.com/';
var url="http://127.0.0.1:1338/"
//var socket;//=require('socket.io-client')(url);
//var socket2;//=require('socket.io-client')(url);
//socket=io.connect(url);
var headers={
	//'User-Agent': 'request'
	"User-Agent":"Super Agent/0.0.1",
	'Content-Type' : 'application/x-www-form-urlencoded' 
}

console.log("===========================================");
console.log(" Pruebas BattleCards - Flujo normal");
console.log(" 1. Agrego el usuario Loli");
console.log(" 2. Agrego el usuario Luis");
console.log(" 3. Loli crea la partida Prueba");
console.log(" 4. Luis se une a la partida Prueba");
console.log(" 5. Loli obtener las cartas de la mano");
console.log(" 6. Luis obtener las cartas de la mano");
console.log("===========================================");

function agregarUsuario(nombre){
	var options={
		url:url+'agregarUsuario/'+nombre,
		method:'GET',
		headers:headers
	}
	console.log("---------------------------------------------------------------------------");
	console.log("1. Intentar agregar el usuario "+nombre);
	console.log("---------------------------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse(body) ;
    		if (jsonResponse.usr!=undefined){
    			id1=jsonResponse.usr;
	    		console.log("Usuario id: "+jsonResponse.usr+" creado correctamente \n");
	    		agregarUsuario2("Luis");
	    	}
	    	else{
	    		console.log("No se pudo agregar al usuario \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function agregarUsuario2(nombre){
	var options={
		url:url+'agregarUsuario/'+nombre,
		method:'GET',
		headers:headers
	}
	console.log("---------------------------------------------------------------------------");
	console.log("2. Intentar agregar el segundo usuario "+nombre);
	console.log("---------------------------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			//console.log(body);
			var jsonResponse = JSON.parse(body) ;
    		if (jsonResponse.usr!=undefined){
    			id2=jsonResponse.usr;
	    		console.log("Usuario id: "+jsonResponse.usr+" creado correctamente \n");
	    		crearPartida(id1,"prueba");
	    	}
	    	else{
	    		console.log("No se pudo agregar al usuario \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function crearPartida(usrid, nombre) {
    var options = {
        url: url+'crearPartida/'+usrid+'/'+nombre,
        method: 'GET',
        headers: headers
    }

    console.log("---------------------------------------------------------------------------");
	console.log("3. Intentar crear la partida "+nombre);
	console.log("---------------------------------------------------------------------------");

    request(options, function(error, response, body) {
        if (!error && response.statusCode==200) {
            var jsonResponse = JSON.parse(body);
            if (jsonResponse.id != undefined) {
                console.log("Partida id: " + jsonResponse.id+ " creada correctamente\n");
                elegirPartida(id2, nombre);
            } else {
                console.log("No se pudo crear la partida");
            }
        } else {
            console.log(response.statusCode);
        }
    });
}

function elegirPartida(usrid, nombre) {
    var options = {
        url: url+'elegirPartida/'+usrid+'/'+nombre,
        method: 'GET',
        headers: headers
    }

    console.log("---------------------------------------------------------------------------");
	console.log("4. Intentar elegir la partida "+nombre);
	console.log("---------------------------------------------------------------------------");

    request(options, function(error, response, body) {
        if (!error && response.statusCode==200) {
            var jsonResponse = JSON.parse(body);
            if (jsonResponse.id >= 0) {
                console.log("Partida id: " + jsonResponse.id+ " elegida correctamente\n");
                obtenerCartasMano(id1);
                obtenerCartasMano(id2);
            } else {
                console.log("No se pudo elegir la partida");
            }
        } else {
            console.log(response.statusCode);
        }
    });
}

function obtenerCartasMano(usrid) {
    var options = {
        url: url+'obtenerCartasMano/'+usrid,
        method: 'GET',
        headers: headers
    }

    console.log("---------------------------------------------------------------------------");
	console.log("5. Intentar obtener cartas de usuario " + usrid);
	console.log("---------------------------------------------------------------------------");

    request(options, function(error, response, body) {
        if (!error && response.statusCode==200) {
            var jsonResponse = JSON.parse(body);
            if (jsonResponse.length > 0) {
                console.log("Cartas en mano de usuario: " + usrid+ " obtenidas correctamente\n");
            } else {
                console.log("No se pudieron obtener las cartas en mano de usuario " + usrid);
            }
        } else {
            console.log(response.statusCode);
        }
    });
}




var id1,id2;
agregarUsuario("Loli");
