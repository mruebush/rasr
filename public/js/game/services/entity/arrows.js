(function() {
  var Arrow;

  Arrow = (function() {
    var arrows;

    function Arrow() {
      arrows;
      var fireRate, nextFire;
      fireRate = 100;
      nextFire = 0;
    }

    arrows = game.add.group();

    arrows.enableBody = true;

    arrows.physicsBodyType = Phaser.Physics.ARCADE;

    arrows.createMultiple(30, 'bullet', 0, false);

    arrows.setAll('anchor.x', 0.5);

    arrows.setAll('anchor.y', 0.5);

    arrows.setAll('outOfBoundsKill', true);

    arrows.setAll('checkWorldBounds', true);

    return Arrow;

  })();

}).call(this);
