app.factory 'Arrow', ->

  return (game) ->
    Arrow = {}
    Arrow.arrows = game.add.group()
    Arrow.arrows.enableBody = true
    Arrow.arrows.physicsBodyType = Phaser.Physics.ARCADE
    Arrow.arrows.createMultiple 50, 'arrow', 0, false
    Arrow.arrows.setAll 'anchor.x', 0.5
    Arrow.arrows.setAll 'anchor.y', 0.5
    Arrow.arrows.setAll 'outOfBoundsKill', true
    Arrow.arrows.setAll 'checkWorldBounds', true

    return Arrow
