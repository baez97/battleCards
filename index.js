var fs=require("fs");
var config=JSON.parse(fs.readFileSync("config.json"));
var host=config.host;
var port=config.port;
var bodyParser = require('body-parser');
var exp=require("express");
var app=exp(); 
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var modelo=require("./servidor/modelo.js");
var comSrv = require("./servidor/comSrv.js");
var com = new comSrv.ComSrv();

var juego=new modelo.Juego();

app.set('port', (process.env.PORT || 5000));
app.use(exp.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	var contenido=fs.readFileSync("./cliente/index-bs.html"); 
	response.setHeader("Content-type","text/html");
	response.send(contenido); 
	});

app.get("/agregarUsuario/:nombre",function(request,response) {
	const nombre = request.params.nombre;

	var usr     = new modelo.Usuario(nombre);

	juego.agregarUsuario(usr);

	response.send({"usr":usr.id});
});

app.get("/crearPartida/:usrid/:nombre",function(request,response) {
	var usrid   = request.params.usrid;
	var nombre  = request.params.nombre;

	var usr     = juego.usuarios[usrid];

	if ( usr ) {
		var id = juego.crearPartida(nombre, usr);
		var partida = juego.partidas[id];
		response.send({"nombre-partida:":partida.nombre, "id":id});
	}

	response.send({"res": -1});

});

app.get("/elegirPartida/:usrid/:nombre",function(request,response){
	var usrid   = request.params.usrid;
	var partida = request.params.nombre;

	var usr     = juego.usuarios[usrid]; 

	var id = usr.eligePartida(partida);

	response.send({"id":id});
});

app.get("/obtenerCartasMano/:usrid", function(request, response) {
	var usrid   = request.params.usrid;
	var usr     = juego.usuarios[usrid];

	var json_cartas = [];

	if ( usr ) {
		json_cartas = usr.obtenerCartasMano();
	}
		
	response.send(json_cartas);
});

app.get("/jugarCarta/:usrid/:cartaid",function(request,response){
	var usrid   = request.params.usrid;
	var cartaid = request.params.cartaid;

	var usr		= juego.usuarios[usrid]; 
	var carta   = usr.obtenerCartaMano(cartaid);
	
	usr.jugarCarta(carta);
	
	const respuesta = usr.nombre + ", has jugado la carta " + carta.nombre;
	response.send({"res":respuesta});
});

app.get("/pasarTurno/:usrid/",function(request,response){
	var usrid = request.params.usrid;
	var usr   = juego.usuarios[usrid];

	if ( usr ) {
		usr.pasarTurno();
		const respuesta = usr.nombre + ", has pasado el turno";
	} else {
		const respuesta = "El usuario no existe";
	}
	response.send({"res": respuesta});
});

app.get("/ataca/:usrid/:cartaid/:targetid",function(request,response){
	var usrid    = request.params.usrid;
	var cartaid  = request.params.cartaid;
	var targetid = request.params.targetid;

	var usr      = juego.usuarios[usrid]; 
	var carta    = juego.cartas[cartaid];
	var target   = juego.usuarios[targetid];

	const respuesta = -1;

	if ( usr ) {
		usr.ataca(carta, target);
		respuesta = usr.nombre + ", has atacado a " 
				 + target.nombre + " con " 
				 + carta.nombre;
	}

	response.send({"res": respuesta});
});

app.get("/verResultado/:nombre/", function(request,response){
	var nombre = request.params.nombre;

	const respuesta = juego.verResultado(nombre);

	response.send({"res": respuesta});
});

app.get("/obtenerPartidas", function(request, response) {
	var json=[];
	var partidas=juego.obtenerPartidas();

	if ( partidas.length != 0 ) {
		for ( var i=0; i<partidas.length; i++ ) {
			var partida=partidas[i];
			json.push({"idPartida":partida.id,"nombre":partida.nombre});
		}
	} 

	response.send(json);
});

app.get("/cambiarTurno/:usrid/", function(request, response) {
	var usr = juego.usuarios[request.params.usrid];
	usr.cambiarTurno();

	response.send({res: "Turno pasado"});
});

server.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});

com.lanzarSocketSrv(io,juego);