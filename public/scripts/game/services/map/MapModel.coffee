app.service 'Map', (MapAPI) ->
  Map = {}

  return (game, Phaser, mapId, $) ->
    Map.game = game
    Map.Phaser = Phaser
    Map.mapId = mapId
    Map.$ = $
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
      that = Map
      if !data
        MapAPI.moveMap().get {direction: direction, mapId: Map.mapId}, (mapData) ->
          Map.$('#map-id').attr('href', '/edit/' + Map.mapId);
          Map._loadAssets.call(that, mapData, callback)
          console.log "Triggering enterMap"
          # Map.game.mapData = data
          # Map.game.trigger 'enterMap'
      else
        Map._loadAssets.call(Map, data, callback)

    Map._loadAssets = (data, loader = Map.game.load) ->
      Map.mapId = data._id
      Map.game.mapId = Map.mapId
      Map.mapData = data
      loader.tilemap('map', null, data, Map.Phaser.Tilemap.TILED_JSON)

      for tileset in data.tilesets
        Map.tiles[tileset.name] = loader.image(tileset.name, "assets/tilemaps/tiles/" + tileset.image, 32, 32)

      loader.start();
      loader.onLoadComplete.add =>
        do Map.create

    Map.create = ->
      map = Map.game.add.tilemap('map')
      for tileset in Map.mapData.tilesets
          map.addTilesetImage(tileset.name)

      for layer in Map.mapData.layers
        layer = map.createLayer(layer.name)
        Map.layers.push(layer)
        layer.resizeWorld()

      Map.game._createCtrls(Map.mapData)
      Map.trigger 'finishLoad'

    Map.reloadMap = (loader, direction) ->
      # url = "#{Map.game.rootUrl}/move/#{direction}/#{Map.mapId}"
      MapAPI.moveMap().get {direction: direction, mapId: Map.mapId}, (mapData) ->
        Map._loadAssets.call(Map, mapData, loader)
        Map.game.mapData = mapData
        Map.game.trigger "enterMap"

    Map.reload = (direction) ->
      layer.destroy() for layer in Map.layers
      Map.layers = []
      loader = new Map.Phaser.Loader(Map.game)
      Map.reloadMap(loader, direction)

    Map.update = ->

    Map._makeMap = (direction, mapId) ->
      MapAPI.makeMap().get({direction: direction, mapId: mapId})

    return Map
