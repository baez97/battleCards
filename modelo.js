
function Juego(){
	this.cartas=[];
	this.usuarios=[];
	this.agregarCarta=function(carta){
		this.cartas.push(carta);
	}
	this.agregarUsuario=function(usuario){
		this.usuarios.push(usuario);
	}
}

function Usuario(nombre,juego){
	this.nombre=nombre;
	this.juego=juego;
	this.mazo=[];
	this.obtenerColeccionInicial=function(){
		//this.mazo=this.juego.obtenerColeccionInicial();
	}
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
