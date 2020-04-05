// stores and manages sprites
// interface for doing sprite queries
// nth sprite -- fast based on array index
// sprites for tag -- super fast query based on hash index
// sprites overlapping a box -- slow; has to iterate over all sprites
// sprites contained in a box -- slow; has to iterate over all sprites
// garbage collectino
// sprite iterators

// addSprite --
// registerSpriteForTag
// deleteSprite
// addToGarbageCollector
// spritesForTag
var SpriteStore = function( message_bus ) {
  this.message_bus = message_bus;

  this._sprites = new Set(); // HashSet of sprites we're managing
  this._index = {};   // hash of HashSets keyed by tag

  this.message_bus.subscribe( 'sprite_tag_added', this.handleSpriteTagAdded.bind(this) );
  this.message_bus.subscribe( 'sprite_tag_removed', this.handleSpriteTagRemoved.bind(this) );
};

// returns the number of sprites in storage
SpriteStore.prototype.count = function() {
  return this._sprites.size();
};

// given a Sprite object, add that sprite to storage
// if the sprite has tags, those will be indexed.
SpriteStore.prototype.addSprite = function( sprite ) {
  this._sprites.add( sprite );

  var tag;
  for ( tag in sprite.tags ) {
    this.addSpriteToTags( sprite, tag );
  }

  this.message_bus.publish( 'sprite_added', { store: this, sprite: sprite } );

  return this;
};

SpriteStore.prototype.spritesWithTag = function( tag ) {
  var sprites = this._index[tag];

  if ( typeof sprites === 'undefined' ) {
    return [];
  }

  return sprites;
}

// given a Sprite object, delete it from storage
SpriteStore.prototype.deleteSprite = function( sprite ) {
  this._sprites.delete( sprite );

  var tag;
  for ( tag in sprite.tags ) {
    this._index[tag].delete( sprite );
  }

  this.message_bus.publish( 'sprite_deleted', { store: this, sprite: sprite } );

  return this;
};

// given a tag and a sprite, add given sprite to the tag index
SpriteStore.prototype.addSpriteToTags = function( sprite, tag ) {
  if ( typeof this._index[tag] === 'undefined' ) {
    this._index[tag] = new Set();
  }

  this._index[tag].add( sprite );

  return this;
};

SpriteStore.prototype.deleteSpriteFromTags = function( sprite, tag ) {
  if ( typeof this._index[tag] === 'undefined') {
    return this;
  }

  this._index[tag].delete( sprite );
};

SpriteStore.prototype.handleSpriteTagAdded = function( type, payload ) {
  var sprite = payload.sprite,
      tag = payload.tag;

  this.addSpriteToTags( sprite, tag );
};

SpriteStore.prototype.handleSpriteTagRemoved = function( type, payload ) {
  var sprite = payload.sprite,
      tag = payload.tag;

  this.deleteSpriteFromTags( sprite, tag );
};

SpriteStore.prototype.removeDeadSprites = function() {
  var sprite;

  for ( sprite of this._sprites) {
    if ( sprite.dead ) {
      this.deleteSprite( sprite );
    }
  }
}

export default SpriteStore;

