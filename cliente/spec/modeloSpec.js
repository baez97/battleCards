describe("El juego de las cartas...", function() {
  var juego;
  var usr1,usr2;

  beforeEach(function() {
    juego=new Juego();
    usr1=new Usuario("pepe");
    usr2=new Usuario("juan");
  });

  it("Compruebo condiciones iniciales (cartas, usuario)", function() {
    expect(juego.cartas).toBeDefined();
    expect(juego.cartas.length).toEqual(30);
    expect(juego.usuarios).toBeDefined();
    expect(juego.usuarios.length).toEqual(0);
  });

  it("Los usuarios tienen un mazo", function(){
    expect(usr1.mazo).toBeDefined();
    expect(usr1.mazo.length).toEqual(0);
    expect(usr2.mazo).toBeDefined();
    expect(usr2.mazo.length).toEqual(0);
    });

    it("Los usuarios tiene mano (inicialmente sin cartas)", function(){
    expect(usr1.mano).toBeDefined();
    expect(usr1.mano.length).toEqual(0);
    expect(usr2.mano).toBeDefined();
    expect(usr2.mano.length).toEqual(0);
    });

   it("agregar pepe el usuario al juego", function(){
    juego.agregarUsuario(usr1);
    expect(juego.usuarios.length).toEqual(1);
    expect(juego.usuarios[0].nombre).toEqual("pepe");
    expect(usr1.mazo.length).toEqual(30);
    });

   it("agregar pepe y juan el usuario al juego", function(){
    juego.agregarUsuario(usr1);
    juego.agregarUsuario(usr2);
    expect(juego.usuarios.length).toEqual(2);
    expect(juego.usuarios[0].nombre).toEqual("pepe");
    expect(usr1.mazo.length).toEqual(30);
    expect(juego.usuarios[1].nombre).toEqual("juan");
    expect(usr2.mazo.length).toEqual(30);
    });

});
