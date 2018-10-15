var modelo = require('./modelo.js');
describe("El juego de las cartas...", function() {
  var juego;
  var usr1,usr2;
  var miturno,nomiturno;

  beforeEach(function() {
    juego=new modelo.Juego();
    usr1=new modelo.Usuario("pepe");
    usr2=new modelo.Usuario("juan");
    miturno=new modelo.MiTurno();
    nomiturno=new modelo.NoMiTurno();
    juego.agregarUsuario(usr1);
    juego.agregarUsuario(usr2);
    usr1.crearPartida("prueba");
    usr2.eligePartida("prueba");
  });

   it("Compruebo condiciones iniciales (cartas, partidas, usuario)", function() {
    expect(juego.usuarios).toBeDefined();
    expect(juego.usuarios.length).toEqual(2);
    expect(juego.partidas).toBeDefined();
    expect(juego.partidas.length).toEqual(1);
  });

  it("Los usuarios tienen un mazo", function(){
    expect(usr1.mazo).toBeDefined();
    expect(usr1.mazo.length).toEqual(30);
    expect(usr2.mazo).toBeDefined();
    expect(usr2.mazo.length).toEqual(30);
    });

    it("Los usuarios tiene mano (inicialmente sin cartas)", function(){
      var cont=0;
      for(var i=0;i<usr1.mazo.length;i++){
        if (usr1.mazo[i].posicion=="mano"){
          cont++
        }
      }
      expect(cont).toBeGreaterThan(4);
      expect(cont).toBeLessThan(7);
    });

   it("agregar pepe y juan el usuario al juego", function(){
    //juego.agregarUsuario(usr1);
    //juego.agregarUsuario(usr2);
    expect(juego.usuarios.length).toEqual(2);
    expect(juego.usuarios[0].nombre).toEqual("pepe");
    expect(usr1.mazo.length).toEqual(30);
    expect(juego.usuarios[1].nombre).toEqual("juan");
    expect(usr2.mazo.length).toEqual(30);
    });

   it("Pepe crea una partida, juan la elige y se les asigna las zonas correspondientes", function(){
      expect(juego.usuarios[0].partida.nombre).toEqual("prueba");
      expect(usr1.partida.nombre).toEqual("prueba");
      expect(juego.usuarios[1].partida.nombre).toEqual("prueba");
      expect(juego.usuarios[0].zona.nombre).toEqual("arriba");
      expect(juego.usuarios[1].zona.nombre).toEqual("abajo");
      expect(usr1.partida.usuariosPartida.length).toEqual(2);
      if (usr1.turno.meToca()){
        expect(usr2.turno.meToca()).toBe(false);
      }
      else{
        expect(usr2.turno.meToca()).toBe(true);
      }
    });

   it("Comprobar que funciona pasar turno",function(){
      usr1.turno=miturno;
      usr2.turno=nomiturno;
      usr1.pasarTurno();
      expect(usr1.turno.meToca()).toEqual(false);
      expect(usr2.turno.meToca()).toEqual(true);
   });

   it("Al jugar una carta, la carta pasa a la zona de ataque y se decrementa el elixir en 1",function(){
      //Forzamos el turno para el usr1
      usr1.turno=miturno;
      usr2.turno=nomiturno;
      //Localizamos una carta de coste 1
      var carta=usr1.localizarCarta(1);
      if (carta!=undefined){
        usr1.jugarCarta(carta);
        expect(usr1.elixir).toEqual(0);
        expect(usr1.consumido).toEqual(1);
        expect(carta.posicion).toEqual("ataque");
      }
   });

 it("Se comprueba que una carta con coste 2 no se pueda jugar en el primer turno pero en el segundo sí",function(){
      //Forzamos el turno para el usr1
      usr1.turno=miturno;
      usr2.turno=nomiturno;
      //Localizamos una carta de coste 1 y otra de 2      
      var carta1=usr1.localizarCarta(1);
      var carta2=usr1.localizarCarta(2);

      // Si se localizan se comprueba que la carta de coste 1 se puede jugar y la de coste 2 no
      if (carta1!=undefined && carta2!=undefined){
        usr1.jugarCarta(carta1);
        expect(carta1.posicion).toEqual("ataque");
        expect(usr1.elixir).toEqual(0);

        usr1.jugarCarta(carta2);
        expect(carta2.posicion).toEqual("mano");

        // Se juega la carta 1 de coste 1 para que el elixir incremente en el turno 2
        //usr1.jugarCarta(carta1);
        
        // Se pasa el turno de usr1 y usr2 para que se actualice el elixir
        usr1.pasarTurno();
        expect(usr1.elixir).toEqual(2);

        usr2.pasarTurno();

        // Se comprueba que ahora la carta 2 se puede jugar
        usr1.jugarCarta(carta2);
        expect(carta2.posicion).toEqual("ataque");
        expect(usr1.elixir).toEqual(0);
      } 
   });

it("Un turno completo con ataque", function(){
      //Forzamos a que tenga 3 de elixir
      usr1.elixir=3;
      usr1.turno=miturno;
      usr2.turno=nomiturno;
      //Localizamos una carta de coste 1
      var carta1=usr1.localizarCarta(1);
      if(carta1!=undefined){
	    var vidasCarta1=carta1.vidas;
        usr2.jugarCarta(carta1);
        usr2.pasarTurno();
      //Localizamos una carta de coste 3
        var carta2=usr1.localizarCarta(3);    
        if(carta2!=undefined){
       	  var vidasCarta2=carta2.vidas;
          usr1.jugarCarta(carta2);
        //Atacamos con la de coste 3 a la de coste 1
          usr1.ataque(carta2,carta1);
        //Comprobamos si no tiene vidas
          expect(carta1.vidas).toEqual(vidasCarta1-carta2.ataque);
          //expect(carta1.posicion).toEqual("cementerio");
          expect(carta2.vidas).toEqual(vidasCarta2-carta1.ataque);
        } 
      }

   });

});
