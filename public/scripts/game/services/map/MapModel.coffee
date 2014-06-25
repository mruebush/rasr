app.service 'Map', (MapAPI) ->
  Map = {}

  return (game, Phaser, mapId) ->
    Map.game = game
    Map.Phaser = Phaser
    Map.mapId = mapId
    Map.layers = []
    Map.tiles = []
    
    Map.game.physics.arcade.checkCollision.up = false
    Map.game.physics.arcade.checkCollision.right = false
    Map.game.physics.arcade.checkCollision.down = false
    Map.game.physics.arcade.checkCollision.left = false
    Map.game.on('changeMap', (direction) =>
      Map.game.changingScreen = true;
      Map.reload(direction)
    )

    Map.preload = (direction, data, callback) ->
      if !data
        MapAPI.moveMap().get {direction: direction, mapId: Map.mapId}, (mapData) ->
          Map._loadAssets.call(Map, mapData, callback)
          console.log "Triggering enterMap"
      else
        Map._loadAssets.call(Map, data, callback)

    Map._loadAssets = (data, loader = Map.game.load, triggerEnter) ->
      Map.mapId = data._id
      Map.game.mapId = Map.mapId
      Map.mapData = data
      loader.tilemap('map', null, data, Map.Phaser.Tilemap.TILED_JSON)

      for tileset in data.tilesets
        Map.tiles[tileset.name] = loader.image(tileset.name, "assets/tilemaps/tiles/" + tileset.image, 32, 32)

      loader.start();
      loader.onLoadComplete.add =>
        Map.create triggerEnter

    Map.create = (triggerEnter) ->
      map = Map.game.add.tilemap('map')
      for tileset in Map.mapData.tilesets
        map.addTilesetImage(tileset.name)
      console.log(Map.mapData.layers)
      for layerInfo in Map.mapData.layers
        layer = map.createLayer(layerInfo.name)
        layer.name = layerInfo.name
        console.log(layerInfo.name, layer.name)
        Map.layers.push(layer)
        layer.resizeWorld()
        # collide on everything, set on from 1 to 1000 for now
        if layer.name is 'collision'
          console.log('setting collision between', layer)
          map.setCollisionBetween(1, 1000, true, layer) 

      Map.game._createCtrls(Map.mapData)
      Map.trigger 'finishLoad'

      if triggerEnter then Map.game.trigger 'enterMap'

    Map.reloadMap = (loader, direction) ->
      # url = "#{Map.game.rootUrl}/move/#{direction}/#{Map.mapId}"
      MapAPI.moveMap().get {direction: direction, mapId: Map.mapId}, (mapData) ->
        Map._loadAssets.call(Map, mapData, loader, true)
        Map.game.mapData = mapData
        # Map.game.trigger "enterMap"

    Map.reload = (direction) ->
      layer.destroy() for layer in Map.layers
      Map.layers = []
      loader = new Map.Phaser.Loader(Map.game)
      Map.reloadMap(loader, direction)

    Map.update = ->

    Map._makeMap = (direction, mapId) ->
      MapAPI.makeMap().get({direction: direction, mapId: mapId})

    return Map
