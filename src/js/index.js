import '../css/style.css';

import U from './u.js';
import KeyboardDriver from './keyboard_driver.js';
import Sprite from './sprite.js';
import GameController from './game_controller.js';
import SpriteEmitter from './sprite_emitter.js';


var gameController = new GameController( document.getElementById('dickpit') );

window.gravity = 0.2;
window.width = gameController.element.offsetWidth;
window.height = gameController.element.offsetHeight;
window.centerX = width / 2 - 75;
window.centerY = height / 2 - 75;
window.distance = 200;

gameController
  .addBehavior( 'throbber', 'throbber', function() {

  } )
  .addBehavior( 'gravity-effect', 'bouncing-dick', function() {

    var g = window.gravity;
    this.velocity_y += g;

    if ( this.y > window.height + 200) {
      // delete the sprite
      gameController.sprite_store.deleteSprite(this);
    }
  } )
  .addBehavior( 'rotation', 'dick', function() {
    this.distance = this.baseDistance + Math.sin(gameController.ticks / 10 + this.index) * 20;
    this.index += this.modifier;

    this.move_to(
      window.centerX + this.distance * Math.sin( this.index ),
      window.centerY + this.distance * Math.cos( this.index )
    );

    this.setSpriteRotation( U.Math.rad2deg( this.index ));
  } );

var emitter1 = new SpriteEmitter( gameController, {
      tags: [ 'bouncing-dick' ],
      elementClass: 'little-dick',
      angle: -90,
      speed: 20,
      rate: 1,
      concurrency: 2,
      splay: 30,
      speed_splay: 2,
      life: 5000,
      max: 20,
      x: 200,
      y: window.height - 200 } ),

    emitter2 = new SpriteEmitter( gameController, {
      tags: [ 'bouncing-dick' ],
      elementClass: 'little-dick',
      angle: -90,
      speed: 20,
      rate: 1,
      concurrency: 2,
      splay: 30,
      speed_splay: 2,
      life: 5000,
      max: 20,
      x: window.width - 200,
      y: window.height - 200
    } );

emitter1.count = 100;
emitter2.count = 100;

gameController.addEmitter( emitter1 );
gameController.addEmitter( emitter2 );

window.dickCount = 10;

function randomDickClass() {
  var classes = [ 'dick1', 'dick2', 'dick3' ];
  return classes[Math.round(Math.random() * classes.length)];
}

var i = 0,
    j = 0;

for ( j = 0; j < 5; j++ ) {
  var dickCount = window.dickCount + ( j * Math.random() * 8 );
  for ( i = 0; i < dickCount; i++ ) {
    var dick_ele = document.createElement('div'),
        dickIndex = ( 2 * Math.PI ) / dickCount * i,
        distance = window.distance + 75 * j,
        dick = new Sprite( dick_ele, {
          x: window.centerX + distance * Math.sin( dickIndex ),
          y: window.centerY + distance * Math.cos( dickIndex ),
          tags: ['dick'],
          use_rotation: false
        });

    dick_ele.setAttribute('class', 'dick ' + randomDickClass());
    dick.index = dickIndex;
    dick.distance = distance + Math.random() * 20;
    dick.modifier = 0.015 + (Math.random() - 0.5) / 100;
    dick.baseDistance = distance;
    dick.setSpriteRotation( U.Math.rad2deg(dick.index) );
    gameController.addSprite( dick );
  }
}

var keyboard_driver = new KeyboardDriver(gameController.message_bus);

gameController.message_bus.subscribe( 'before_step_frame', function() {
  if ( gameController.ticks % 100 != 0 ) { return }
  window.centerX = gameController.element.offsetWidth / 2 - 75;
  window.centerY = gameController.element.offsetHeight / 2 - 75;
});

keyboard_driver.handle( ' ', function() {
  gameController.message_bus.publish( 'dick-blast' );
  emitter1.count = 0;
  emitter2.count = 0;
  console.log('dick blast!');
});

gameController.element.addEventListener("touchstart", function() {
  gameController.message_bus.publish( 'dick-blast' );
  emitter1.count = 0;
  emitter2.count = 0;
  console.log('dick blast!');
}, false);

// attach some shit to the main window
window.keyboard_driver = keyboard_driver;
window.gameController = gameController;

window.debug = false;

console.log('Hacking the gibson...');

// ok, start it up
gameController.run();


