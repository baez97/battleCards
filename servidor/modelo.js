var _=require("underscore");

function Juego(){
	this.cartas=[];
	this.usuarios=[];
	this.partidas=[];
	this.agregarCarta=function(carta){
		this.cartas.push(carta);
	}
	this.agregarUsuario=function(usuario){
		usuario.mazo=_.shuffle(this.crearColeccion());
		usuario.juego=this;
		this.usuarios.push(usuario);
	}
	this.crearColeccion=function(){
		var mazo=[];
		//10 ataque 5 coste 3 vida 5
		for (var i=0;i<10;i++){
			mazo.push(new Carta("Dragon"+i, 5, 5,3));
		}
		//10 ataque 3 coste 2 vida 3
		for (var i=0;i<10;i++){
			mazo.push(new Carta("Guerrero"+i, 3, 3,2));
		}
		//10 ataque 2 coste 1 vida 2
		for (var i=0;i<10;i++){
			mazo.push(new Carta("Esbirro"+i, 2, 2,1));
		}
		return mazo;
	}
	this.agregarPartida=function(partida){
		this.partidas.push(partida);
	}
	this.crearPartida=function(nombre,usuario){
		var partida=new Partida(nombre);
		this.agregarPartida(partida);
		partida.asignarUsuario(usuario);
	}	
	this.asignarPartida=function(nombre, usuario){
		for (var i=0;i<this.partidas.length;i++){
			if (this.partidas[i].nombre==nombre){
				this.partidas[i].asignarUsuario(usuario);
			}
		}
	}
	//aquí se construye el Juego
	//this.crearColeccion();
}

function Partida(nombre){
	this.nombre=nombre;
	this.usuariosPartida=[];
	this.tablero=undefined;
	this.crearTablero=function(){
		this.tablero=new Tablero();
	}
	this.asignarUsuario=function(usuario){
		usuario.asignarPartida(this);
		this.usuariosPartida.push(usuario);
		this.tablero.asignarUsuario(usuario);
		this.comprobarInicio();
	}
	this.comprobarInicio=function(){
		if (this.usuariosPartida.length==2){
			this.turnoInicial();
			this.asignarManoInicial();
		}
	}
	this.asignarManoInicial=function(){
		for(var i=0;i<this.usuariosPartida.length;i++){
			this.usuariosPartida[i].manoInicial();
		}
	}
	this.turnoInicial=function(){
		var num=Math.round(Math.random());
		this.usuariosPartida[num].esMiTurno();

	}
	this.cambiarTurno=function(){
		for(var i=0;i<this.usuariosPartida.length;i++){
			this.usuariosPartida[i].cambiarTurno();
		}
		// if (this.usuariosPartida[0].turno){
		// 	this.usuariosPartida[0].turno=false;
		// 	this.usuariosPartida[1].esMiTurno();
		// }else{
		// 	this.usuariosPartida[1].turno=false;
		// 	this.usuariosPartida[0].esMiTurno();
		// }
	}
	this.crearTablero();
}

function Tablero(){
	this.zonas=[];
	this.agregarZona=function(zona){
		this.zonas.push(zona);
	}
	this.crearZonas=function(){
		this.agregarZona(new Zona("arriba"));
		this.agregarZona(new Zona("abajo"));
	}
	this.asignarUsuario=function(usuario){
		for(var i=0;i<this.zonas.length;i++){
			if(this.zonas[i].libre){
				usuario.agregarZona(this.zonas[i]);
				this.zonas[i].libre=false;
				break;
			}
		}
	}
	this.crearZonas();
}

function Zona(nombre){
	this.nombre=nombre;
	this.ataque=[];
	this.mano=[];
	this.mazo=[];
	this.libre=true;
	this.agregarAtaque=function(carta){
		this.ataque.push(carta);
	}
	this.agregarMano=function(carta){
		this.mano.push(carta);
	}
	this.agregarMazo=function(mazo){
		this.mazo=mazo;
	}
}

function MiTurno(){
	this.pasarTurno=function(usr){
		usr.partida.cambiarTurno();
	}
	this.jugarCarta=function(usr,carta){
		usr.puedeJugarCarta(carta);
	}
	this.cambiarTurno=function(usr){
		usr.turno=new NoMiTurno();
	}
	this.meToca=function(){
		return true;
	}
}

function NoMiTurno(){
	this.esMiTurno=function(usr){
		usr.turno=new MiTurno();
		usr.cogerCarta();
		usr.elixir=usr.consumido+1;
		usr.consumido=0;
	}
	this.pasarTurno=function(usr){
		console.log("No se puede pasar el turno si no se tiene");
	}
	this.jugarCarta=function(carta,usr){
		console.log("No es tu turno");
	}
	this.cambiarTurno=function(usr){
		usr.turno=new MiTurno();
		this.esMiTurno(usr);
	}
	this.meToca=function(){
		return false;
	}
}

function Usuario(nombre){
	this.nombre=nombre;
	this.juego=undefined;
	this.vidas=20;
	this.mazo=[];
	//this.mano=[];
	//this.ataque=[];
	this.elixir=1;
	this.turno=new NoMiTurno();
	this.zona=undefined;
	this.partida=undefined;
	this.consumido=0;
	this.asignarPartida=function(partida){
		this.partida=partida;
	}
	this.agregarZona=function(zona){
		this.zona=zona;
	}
	this.crearPartida=function(nombre){
		this.juego.crearPartida(nombre,this);
	}
	this.eligePartida=function(nombre){
		this.juego.asignarPartida(nombre,this);
	}
	this.cambiarTurno=function(){
		this.turno.cambiarTurno(this);
	}
	this.pasarTurno=function(){
		//this.partida.cambiarTurno();
		this.turno.pasarTurno(this);
	}
	this.esMiTurno=function(){
		this.turno.esMiTurno(this);
		// this.turno=true;
		// this.cogerCarta();
		// this.elixir=this.consumido+1;
		// this.consumido=0;
	}
	this.cogerCarta=function(){
		var carta;
		carta= this.mazo.find(function(each){
			return each.posicion=="mazo";
		});
		carta.posicion="mano";
	}
	this.jugarCarta=function(carta){
		this.turno.jugarCarta(this,carta);
	}
	this.puedeJugarCarta=function(carta){
		if (this.elixir>=carta.coste){
			carta.posicion="ataque";
			this.elixir=this.elixir-carta.coste;
			this.consumido=this.consumido+carta.coste;
		}
		else
			console.log("No tienes suficiente elixir");
	}
	this.ataque=function(carta,objetivo){
		objetivo.esAtacado(carta);
	}
	this.esAtacado=function(carta){
		this.vidas=this.vidas-carta.ataque;
		this.comprobarVidas();
	}
	this.comprobarVidas=function(){
		if (this.vidas<=0){
			this.juego.fin();
		}
	}
	this.manoInicial=function(){
		for(var i=0;i<5;i++){
			this.cogerCarta();
		}
	}
	this.localizarCarta=function(coste){
		return this.mazo.find(function(each){
			return each.posicion=="mano" && each.coste==coste;
		});
	}
}

function Carta(vidas,ataque,nombre,coste){
	this.vidas=vidas;
	this.ataque=ataque;
	this.nombre=nombre;
	this.coste=coste;
	this.posicion="mazo";
	this.esAtacado=function(carta){
		this.vidas=this.vidas-carta.ataque;
		this.comprobarVidas();
		carta.comprobarVidas();
	}
	this.comprobarVidas=function(){
		if (this.vidas<=0){
			this.posicion="cementerio";
		}
	}
}
module.exports.Juego=Juego;
module.exports.Usuario=Usuario;
module.exports.MiTurno=MiTurno;
module.exports.NoMiTurno=NoMiTurno;