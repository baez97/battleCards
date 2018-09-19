
function Juego(){
	this.cartas=[];
	this.usuarios=[];
	this.agregarCarta=function(carta){
		this.cartas.push(carta);
	}
	this.agregarUsuario=function(usuario){
		this.usuarios.push(usuario);
	}
	this.obtenerColeccionInicial=function(numero){
		return this.cartas.slice(0,numero);
	}
	this.iniciarColeccion=function(){
		for(var i=0;i<3;i++){
			this.agregarCarta(new Carta(5,new Azul(),"dragon"));
			this.agregarCarta(new Carta(10,new Rojo(),"perro"));
			this.agregarCarta(new Carta(15,new Amarillo(),"gato"));
		}
	}
	this.iniciarColeccion();
}

function Usuario(nombre,juego){
	this.nombre=nombre;
	this.juego=juego;
	this.mazo=[];
	this.numCartas=3;
	this.obtenerColeccionInicial=function(numero){
		this.mazo=this.juego.obtenerColeccionInicial(numero);
	}
	this.obtenerColeccionInicial(this.numCartas);
}

function Carta(vidas,color,nombre){
	this.vidas=vidas;
	this.color=color;
	this.nombre=nombre;
}

function Rojo(){
}

function Azul(){
}

function Amarillo(){
}
