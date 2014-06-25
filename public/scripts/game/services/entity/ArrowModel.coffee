app.factory 'Arrow', ->

  Arrow = {}
  # fireRate = 500
  # nextFire = 0
  # arrowIndex = 0
  # arrowSpeed = 600
  # numArrows = 50
  # numArrowsShot = 5


  return (game) ->
    Arrow.arrows = game.add.group()
    Arrow.arrows.enableBody = true
    Arrow.arrows.physicsBodyType = Phaser.Physics.ARCADE
    Arrow.arrows.createMultiple 50, 'arrow', 0, false
    Arrow.arrows.setAll 'anchor.x', 0.5
    Arrow.arrows.setAll 'anchor.y', 0.5
    Arrow.arrows.setAll 'outOfBoundsKill', true
    Arrow.arrows.setAll 'checkWorldBounds', true

    # Arrow.fireRate = fireRate
    # Arrow.nextFire = nextFire
    # Arrow.arrowIndex = 0
    # Arrow.arrowSpeed = 600
    # Arrow.numArrows = 50
    # Arrow.numArrowsShot = 5

    return Arrow

# class Arrow
#   constructor: ->
#     arrows;
#     fireRate = 100;
#     nextFire = 0;

#   arrows = game.add.group();
#   arrows.enableBody = true;
#   arrows.physicsBodyType = Phaser.Physics.ARCADE;
#   arrows.createMultiple(30, 'bullet', 0, false);
#   arrows.setAll('anchor.x', 0.5);
#   arrows.setAll('anchor.y', 0.5);
#   arrows.setAll('outOfBoundsKill', true);
#   arrows.setAll('checkWorldBounds', true);
