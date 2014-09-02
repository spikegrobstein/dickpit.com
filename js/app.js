(function( globals, document ) {

  var gameController = new GameController( document.getElementById('dickpit') );

  globals.gravity = 0.1;
  globals.centerX = gameController.element.offsetWidth / 2 - 75;
  globals.centerY = gameController.element.offsetHeight / 2 - 75;
  globals.distance = 200;

  gameController
    .addBehavior( 'throbber', 'throbber', function() {

    } )
    .addBehavior( 'gravity-effect', 'dick', function() {

      var g = globals.gravity;
      // this.velocity_y += g;

    } )
    .addBehavior( 'rotation', 'dick', function() {
      this.distance = this.baseDistance + Math.sin(globals.gameController.ticks / 10 + this.index) * 20;
      this.index += .015;

      this.move_to(
        globals.centerX + this.distance * Math.sin( this.index ),
        globals.centerY + this.distance * Math.cos( this.index )
      );

      this.setSpriteRotation( U.Math.rad2deg( this.index ));
    } );

  var emitter = new SpriteEmitter( gameController, {
    tags: [ 'bouncer' ],
    angle:35,
    speed: 10,
    rate: 1,
    concurrency: 2,
    splay: 30,
    speed_splay: 2,
    life: 5000,
    max: 100,
    x:300,
    y:220 } );

  // gameController.addEmitter( emitter );

  globals.dickCount = 10;

  var i = 0,
      j = 0;

  for ( j = 0; j < 5; j++ ) {
    var dickCount = globals.dickCount + ( j * Math.random() * 8 );
    for ( i = 0; i < dickCount; i++ ) {
      var dick_ele = document.createElement('div'),
          dickIndex = ( 2 * Math.PI ) / dickCount * i,
          distance = globals.distance + 75 * j,
          dick = new Sprite( dick_ele, {
            x: globals.centerX + distance * Math.sin( dickIndex ),
            y: globals.centerY + distance * Math.cos( dickIndex ),
            tags: ['dick'],
            use_rotation: false
          });

      dick_ele.setAttribute('class', 'dick');
      dick.index = dickIndex;
      dick.distance = distance + Math.random() * 20;
      dick.baseDistance = distance;
      dick.setSpriteRotation( U.Math.rad2deg(dick.index) );
      gameController.addSprite( dick );
    }
  }
  // for ( i = 0; i < globals.dickCount; i++ ) {
    // var dick_ele = document.createElement('div');
    // dick_ele.setAttribute('class', 'dick');
    // var dickIndex = ( 2 * Math.PI ) / globals.dickCount * i,
        // dick = new Sprite( dick_ele, {
          // x: globals.centerX + globals.distance * Math.sin( dickIndex ),
          // y: globals.centerY + globals.distance * Math.cos( dickIndex ),
          // tags: ['dick'],
          // use_rotation: false
        // });

    // dick.index = dickIndex;
    // dick.distance = globals.distance;
    // dick.baseDistance = globals.distance;
    // dick.setSpriteRotation( U.Math.rad2deg(dick.index) );
    // gameController.addSprite( dick );
  // }

  // globals.dickCount += 5;

  // for ( i = 0; i < globals.dickCount; i++ ) {
    // var dick_ele = document.createElement('div');
    // dick_ele.setAttribute('class', 'dick');
    // var dickIndex = ( 2 * Math.PI ) / globals.dickCount * i,
        // dick = new Sprite( dick_ele, {
          // x: globals.centerX + globals.distance * Math.sin( dickIndex ),
          // y: globals.centerY + globals.distance * Math.cos( dickIndex ),
          // tags: ['dick'],
          // use_rotation: false
        // });

    // dick.index = dickIndex;
    // dick.distance = globals.distance + 100;
    // dick.baseDistance = globals.distance + 100;
    // dick.setSpriteRotation( U.Math.rad2deg(dick.index) );
    // gameController.addSprite( dick );
  // }

  // globals.dickCount += 10;

  // for ( i = 0; i < globals.dickCount; i++ ) {
    // var dick_ele = document.createElement('div');
    // dick_ele.setAttribute('class', 'dick');
    // var dickIndex = ( 2 * Math.PI ) / globals.dickCount * i,
        // dick = new Sprite( dick_ele, {
          // x: globals.centerX + globals.distance * Math.sin( dickIndex ),
          // y: globals.centerY + globals.distance * Math.cos( dickIndex ),
          // tags: ['dick'],
          // use_rotation: false
        // });

    // dick.index = dickIndex;
    // dick.distance = globals.distance + 200;
    // dick.baseDistance = globals.distance + 200;
    // dick.setSpriteRotation( U.Math.rad2deg(dick.index) );
    // gameController.addSprite( dick );
  // }

  var keyboard_driver = new KeyboardDriver(gameController.message_bus);

  gameController.message_bus.subscribe( 'before_step_frame', function() {
    globals.centerX = gameController.element.offsetWidth / 2 - 75;
    globals.centerY = gameController.element.offsetHeight / 2 - 75;
  });

  keyboard_driver.handle( ' ', function() {
    gameController.message_bus.publish( 'dick-blast' );
    console.log('dick blast!');
  });

  // attach some shit to the main window
  globals.keyboard_driver = keyboard_driver;
  globals.gameController = gameController;

  globals.debug = false;

  // ok, start it up
  gameController.run();


})( window, document );
