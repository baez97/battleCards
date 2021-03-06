var _=require("underscore");

function Juego(){
	this.cartas=[];
	this.usuarios=[];
	this.partidas=[];

	this.verResultado = function(nombre_partida) {
		var partida = this.partidas.find(function(partida) {
			return partida.nombre == nombre_partida;
		});
		return partida.verResultado();
	}

	this.comprobarCartaEnMano = function(usrid, nombreCarta) {
		var usr = this.usuarios[usrid];
		if ( usr ) {
			var cartas = usr.obtenerCartaMano();
			cartas.forEach( carta => {
				if ( carta.nombre == nombreCarta ) {
					return true;
				}
			});
		}
		return false;
	}

	this.agregarCarta=function(carta){
		this.cartas.push(carta);
	}
	this.agregarUsuario=function(usuario){
		usuario.mazo=_.shuffle(this.crearColeccion());
		usuario.juego=this;
		this.usuarios.push(usuario);
		usuario.id=this.usuarios.length-1;
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
		partida.id = this.partidas.length - 1;
		return partida.id;
	}	
	this.asignarPartida=function(nombre, usuario){
		console.log(usuario); 
		for (var i=0;i<this.partidas.length;i++){
			if ( this.partidas[i].nombre==nombre && this.partidas[i].fase.nombre=="inicial" ){
				this.partidas[i].asignarUsuario(usuario);
				return i;
			}
		}
		return -1;
	}

	this.obtenerPartida = function(nombre) {
		return this.partidas.find( function(partida) {
			return partida.nombre == nombre;
		});
	}

	this.obtenerPartidas = function() {
		return this.partidas;
	}
	//aquí se construye el Juego
	//this.crearColeccion();
}

function Partida(nombre) {
	this.id = undefined;
	this.nombre=nombre;
	this.usuariosPartida=[];
	this.tablero=undefined;
	this.fase = new Inicial();

	this.obtenerRival = function(usuario) {
		var rival;
		this.usuariosPartida.forEach( usr => {
			if ( usr.id != usuario.id ) {
				rival = usr;
			}
		});
		
		return rival;
	};

	this.verResultado = function() {
		var [usr1, usr2] = this.usuariosPartida;
		return { 
			jugador1: {
				nombre:        usr1.nombre,
				vidas:         usr1.vidas,
				cartas_mazo:   usr1.obtenerRestantes("mazo"),
				cartas_mano:   usr1.obtenerRestantes("mano"),
				cartas_ataque: usr1.obtenerRestantes("ataque")
			},
			jugador2: {
				nombre:        usr2.nombre,
				vidas:         usr2.vidas,
				cartas_mazo:   usr2.obtenerRestantes("mazo"),
				cartas_mano:   usr2.obtenerRestantes("mano"),
				cartas_ataque: usr2.obtenerRestantes("ataque")
			}
		}
	}
	this.crearTablero=function(){
		this.tablero=new Tablero();
	}
	this.asignarUsuario = function(usuario) {
        this.fase.asignarUsuario(usuario, this);
	}
	
	this.puedeAsignarUsuario=function(usuario) {
        usuario.asignarPartida(this);
        this.usuariosPartida.push(usuario);
        this.tablero.asignarUsuario(usuario);
        this.comprobarInicio();
    }

	this.usrJugarCarta = function(carta, usuario) {
		this.fase.usrJugarCarta(carta, usuario);
	}

	this.comprobarInicio=function(){
		if ( this.usuariosPartida.length == 2 ) {
			this.turnoInicial();
			this.asignarManoInicial();
			this.empezarPartida();
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
	this.cambiarTurno=function(usuario) {
		this.fase.usrPasaTurno(usuario);
	}

	this.puedeCambiarTurno = function() {
		for(var i=0;i<this.usuariosPartida.length;i++){
			this.usuariosPartida[i].cambiarTurno();
			this.usuariosPartida[i].cartasFinTurno();
		}
	}
	this.quitarTurno=function(){
		for(var i=0;i<this.usuariosPartida.length;i++){
			this.usuariosPartida[i].turno=new NoMiTurno();
		}
	}
	this.finPartida=function(){
		console.log("La partida ha terminado");
		this.fase = new Final();
		this.quitarTurno();
	}

	this.empezarPartida = function() {
        this.fase = new Jugando();
	}
	
	this.usrAtaca = function(carta, objetivo, usuario) {
		this.fase.usrAtaca(carta, objetivo, usuario);
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
		usr.partida.cambiarTurno(usr);
	}
	this.jugarCarta=function(usr,carta){
		usr.puedeJugarCarta(carta);
	}
	this.cambiarTurno=function(usr){
		usr.turno=new NoMiTurno();
		usr.elixir=usr.consumido+1;
		usr.consumido=0;
		usr.cartasFinTurno();
	}
	this.meToca=function(){
		return true;
	}
	this.esMiTurno=function(usr){
		//usr.turno=new MiTurno();
		usr.cogerCarta();
	}
}

function NoMiTurno(){
	this.esMiTurno=function(usr){
		console.log("Ahora te toca");
		usr.turno=new MiTurno();
		usr.cogerCarta();
	}
	this.pasarTurno=function(usr){
		console.log("No se puede pasar el turno si no se tiene");
	}
	this.jugarCarta=function(carta,usr){
		console.log("No es tu turno");
	}
	this.cambiarTurno=function(usr){
		//usr.turno=new MiTurno();
		this.esMiTurno(usr);
	}
	this.meToca=function(){
		return false;
	}
}

function Usuario(nombre, id){
	this.nombre=nombre;
	this.juego=undefined;
	this.id;
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
		return this.juego.crearPartida(nombre,this);
	}
	this.eligePartida=function(nombre){
		return this.juego.asignarPartida(nombre,this);
	}
	this.cambiarTurno=function(){
		this.turno.cambiarTurno(this);
	}
	this.pasarTurno=function(){
		//this.partida.cambiarTurno();
		this.turno.pasarTurno(this);
	}
	this.puedePasarTurno = function() {
		this.partida.puedeCambiarTurno();
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
		if (carta){
			carta.posicion="mano";
		}
		else
		{
			this.partida.finPartida();
		}
	}
	this.jugarCarta=function(carta){
		this.partida.usrJugarCarta(carta, this);
	}
	
	this.fasePuedeJugarCarta = function(carta) {
		this.turno.jugarCarta(this, carta);
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
	this.puedeAtacar=function(carta,objetivo){
		if(!carta.haAtacado){
			objetivo.esAtacado(carta);
			carta.haAtacado=true;
			this.comprobarCartasAtaque();
		} else {
			console.log("Esta carta ya ha atacado");
			this.comprobarCartasAtaque();
		}
	}

	this.ataque = function(carta, objetivo) {
		this.partida.usrAtaca(carta, objetivo, this);
	}

	this.esAtacado=function(carta){
		this.vidas=this.vidas-carta.ataque;
		this.comprobarVidas();
	}
	this.comprobarVidas=function(){
		if (this.vidas<=0){
			this.partida.finPartida();
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
	this.obtenerUnaCarta=function(){
		return this.mazo.find(function(each){
			return each.posicion=="mano";
		});	
	}
	this.obtenerCartasAtaque=function(){
		return this.mazo.filter(function(each){
			return each.posicion=="ataque";
		});
	}

	this.obtenerCartaAtaqueNombre = function(nombre) {
		return this.mazo.find(function(each){
			return each.posicion=="ataque" && each.nombre == nombre;
		});
	}

	this.comprobarCartasAtaque=function(){
		var carta;
		var cartasAtaque;
		cartasAtaque= this.obtenerCartasAtaque();
		if (cartasAtaque){
			carta=cartasAtaque.find(function(each){
				return !each.haAtacado;
			});
			if (carta==undefined){
				this.pasarTurno();
				this.ponerNoHaAtacado();
			}
		}
	}
	this.ponerNoHaAtacado=function(){
		_.each(this.obtenerCartasAtaque(),function(item){
			item.haAtacado=false;
		})
	}
	this.obtenerCartasMano=function(){
		return this.mazo.filter(function(each){
			return each.posicion=="mano";
		});
	}

	this.obtenerCartaMano = function(nombre) {
		return this.mazo.find( carta => {
			return carta.nombre == nombre;
		});
	}

	this.obtenerRestantes = function(posicion) {
		return this.mazo.filter(function(carta) {
			return carta.posicion == posicion;
		}).length;
	}

	this.cartasFinTurno = function() {
		var cartasMano;
		cartasMano=this.obtenerCartasMano();
		if(cartasMano.length>10){
			for(var i=0;i<cartasMano.length-10;i++){
				this.descartarCarta(cartasMano[i]);
			}
		}
	}

	this.descartarCarta=function(carta){
		carta.posicion="cementerio";
	}

	this.meToca = function() {
		return this.turno.meToca();
	}

	this.obtenerDatosRival=function(){
    	var rival = this.partida.obtenerRival(this);
		var json  = { "elixir" : rival.elixir,
					  "cartas" : rival.obtenerCartasAtaque(),
					  "vidas"  : rival.vidas };
    	return json;
	}
	
	this.rivalTeToca = function() {
		var rival = this.partida.obtenerRival(this);
		return rival.meToca();
	}

	this.ataqueConNombre = function(idCarta1, idCarta2) {
		var atacante = this.obtenerCartaAtaqueNombre(idCarta1);
		var rival    = this.partida.obtenerRival(this);
		var objetivo = rival.obtenerCartaAtaqueNombre(idCarta2);

		this.ataque(atacante, objetivo);

		return { "carta": atacante, "objetivo": objetivo};
	}

	this.ataqueRivalConNombre = function( idCarta ) {
		var carta = this.obtenerCartaAtaqueNombre(idCarta);
		var rival = this.partida.obtenerRival(this);
		this.ataque(carta, rival);

		var json = { "carta": carta, "vidas": rival.vidas };
		return json;
	}
}

function Carta(nombre,vidas,ataque,coste){
	this.vidas=vidas;
	this.ataque=ataque;
	this.nombre=nombre;
	this.coste=coste;
	this.posicion="mazo";
	this.haAtacado=false;
	this.esAtacado=function(carta){
		this.vidas=this.vidas-carta.ataque;
		carta.vidas=carta.vidas-this.ataque;
		this.comprobarVidas();
		carta.comprobarVidas();
	}
	this.comprobarVidas=function(){
		if (this.vidas<=0){
			this.posicion="cementerio";
		}
	}
}

function Inicial(){
	this.nombre="inicial";
	this.asignarUsuario=function(usr,partida) {
		partida.puedeAsignarUsuario(usr);
	}
	this.usrPasaTurno=function(usuario){
		console.log("La partida ya ha comenzado");
	}
	this.usrAtaca=function(carta, objetivo, usuario) {
		console.log("La partida no ha empezado");
	}
	this.usrJugarCarta = function(carta, usuario) {
		console.log("La partida no ha comenzado");
	}

}

function Jugando(){
	this.nombre="jugando";
	this.asignarUsuario=function(usr,partida){
		console.log("La partida ya tiene 2 jugadores");
	}
	this.usrPasaTurno=function(usuario){
		usuario.puedePasarTurno();
	}
	this.usrAtaca=function(carta, objetivo, usuario) {
		usuario.puedeAtacar(carta, objetivo);
	}
	this.usrJugarCarta = function(carta, usuario) {
		usuario.fasePuedeJugarCarta(carta);
	}
}

function Final(){
	this.nombre="final";
	this.asignarUsuario=function(usr,partida){
		console.log("La partida ha terminado");
	}	
	this.usrPasaTurno=function(usuario){
		console.log("La partida ya ha terminado");
	}
	this.usrAtaca=function(carta, objetivo, usuario) {
		console.log("La partida ha terminado");
	}
	this.usrJugarCarta = function(carta, usuario) {
		console.log("La partida ya ha termiando");
	}
}



module.exports.Juego=Juego;
module.exports.Usuario=Usuario;
module.exports.Partida=Partida;
module.exports.MiTurno=MiTurno;
module.exports.NoMiTurno=NoMiTurno;