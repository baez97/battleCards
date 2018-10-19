var fs=require("fs");
var config=JSON.parse(fs.readFileSync("config.json"));
var host=config.host;
var port=config.port;
var exp=require("express");
var app=exp(); 
var modelo=require("./servidor/modelo.js");

var juego=new modelo.Juego();

app.get("/",function(request,response){
	var json={};
	response.send(json);
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

	juego.crearPartida(nombre, usr);

	var partida = juego.partidas[juego.partidas.length -1];
	response.send({"nombre-partida:":partida.nombre});
});

app.get("/elegirPartida/:usrid/:nombre",function(request,response){
	var usrid   = request.params.usrid;
	var partida = request.params.nombre;

	var usr     = juego.usuarios[usrid]; 

	usr.eligePartida(partida);

	response.send({"res":"ok"});
});

app.get("/jugarCarta/:usrid/:cartaid",function(request,response){
	var usrid   = request.params.usrid;
	var cartaid = request.params.cartaid;

	var usr		= juego.usuarios[usrid]; 
	var carta	= juego.carta[cartaid];

	usr.jugarCarta(carta);

	const respuesta = usr.nombre + ", has jugado la carta " + carta.nombre;
	response.send({"res":respuesta});
});

app.get("/pasarTurno/:usrid/",function(request,response){
	var usrid = request.params.usrid;
	var usr   = juego.usuarios[usrid];

	usr.pasarTurno(carta);

	const respuesta = usr.nombre + ", has pasado el turno";
	response.send({"res": respuesta});
});

app.get("/ataca/:usrid/:cartaid/:targetid",function(request,response){
	var usrid    = request.params.usrid;
	var cartaid  = request.params.cartaid;
	var targetid = request.params.targetid;

	var usr      = juego.usuarios[usrid]; 
	var carta    = juego.cartas[cartaid];
	var target   = juego.usuarios[targetid];

	usr.ataca(carta, target);

	const respuesta = usr.nombre + ", has atacado a " 
				 + target.nombre + " con " 
				 + carta.nombre;
	response.send({"res": respuesta});
});

app.get("/verResultado/:nombre/",function(request,response){
	var nombre = request.params.nombre;

	const respuesta = juego.verResultado(nombre);

	response.send({"res": respuesta});
});


console.log("Servidor escuchando en "+host+":"+port);
app.listen(port,host);