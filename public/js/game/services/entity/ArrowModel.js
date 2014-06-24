(function() {
  app.service('Arrow', function() {
    return function(game) {
      this.arrows = game.add.group();
      this.arrows.enableBody = true;
      this.arrows.physicsBodyType = Phaser.Physics.ARCADE;
      this.arrows.createMultiple(50, 'bullet', 0, false);
      this.arrows.setAll('anchor.x', 0.5);
      this.arrows.setAll('anchor.y', 0.5);
      this.arrows.setAll('outOfBoundsKill', true);
      return this.arrows.setAll('checkWorldBounds', true);
    };
  });

}).call(this);
