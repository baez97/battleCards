var modelo = require('./modelo.js');
describe("El juego de las cartas...", function() {
  var juego;
  var usr1,usr2;

  beforeEach(function() {
    juego=new modelo.Juego();
    usr1=new modelo.Usuario("pepe");
    usr2=new modelo.Usuario("juan");
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
      if (usr1.turno){
        expect(usr2.turno).toBe(false);
      }
      else{
        expect(usr2.turno).toBe(true);
      }
    });

   it("Comprobar que funciona pasar turno",function(){
      usr1.turno=true;
      usr2.turno=false;
      usr1.pasarTurno();
      expect(usr1.turno).toEqual(false);
      expect(usr2.turno).toEqual(true);
   });

});
