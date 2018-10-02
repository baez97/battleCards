function Juego(){
	this.cartas=[];
	this.usuarios=[];
	this.tablero=undefined;
	this.agregarCarta=function(carta){
		this.cartas.push(carta);
	}
	this.agregarUsuario=function(usuario){
		usuario.mazo=this.cartas;
		usuario.juego=this;
		this.usuarios.push(usuario);
	}
	this.crearColeccion=function(){
		//10 ataque 5 coste 3 vida 5
		for (var i=0;i<10;i++){
			this.cartas.push(new Carta("Dragon"+i, 5, 5,3));
		}
		//10 ataque 3 coste 2 vida 3
		for (var i=0;i<10;i++){
			this.cartas.push(new Carta("Guerrero"+i, 3, 3,2));
		}
		//10 ataque 2 coste 1 vida 2
		for (var i=0;i<10;i++){
			this.cartas.push(new Carta("Esbirro"+i, 2, 2,1));
		}
	}
	this.agregarTablero=function(tablero){
		this.tablero=tablero;
	}
	//aquí se construye el Juego
	this.crearColeccion();
	this.agregarTablero(new Tablero());
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
	this.crearZonas();
}

function Zona(nombre){
	this.nombre=nombre;
	this.ataque=[];
	this.mano=[];
	this.mazo=[];
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

function Usuario(nombre){
	this.nombre=nombre;
	this.juego=undefined;
	this.mazo=[];
	this.mano=[];
	this.zona=undefined;
	this.agregarZona=function(zona){
		this.zona=zona;
	}
}

function Carta(vidas,ataque,nombre,coste){
	this.vidas=vidas;
	this.ataque=ataque;
	this.nombre=nombre;
	this.coste=coste;
}
