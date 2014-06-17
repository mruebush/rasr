define(['jquery'], ($) ->
  class Map
    constructor: (@game, @Phaser, @mapId) ->
      @layer = null

    preload: (direction = 'screen', data, callback) ->
      that = @
      url = "/move/#{direction}/#{@mapId}"
      if !data
        $.ajax({
          url: url
          success: (data) =>
            that._loadAssets.call(that, data, callback)
        })
      else
        @_loadAssets.call(@, data, callback)
        
    _loadAssets: (data, callback) ->
      @mapId = data._id
      @mapData = data
      @game.load.tilemap('map', null, data, @Phaser.Tilemap.TILED_JSON)
      tilesetImage = @_getImageNameOfTileset(data)
      @game.load.image('tiles', "../../assets/tilemaps/tiles/" + tilesetImage)
      callback && callback.apply(@)

    create: ->
      map = @game.add.tilemap('map')
      tilesetName = @_getNameOfTileset(@mapData)
      map.addTilesetImage(tilesetName, 'tiles')
      layername = @_getLayerName(@mapData)
      @layer = map.createLayer(layername);
      @layer.resizeWorld();
      @layer.debug = true
      @trigger 'finishLoad'

    reload: (direction) ->
      @preload(direction, null, @create)

    update: ->

    _getImageNameOfTileset: (data) ->
      debugger
      return data.tilesets[0].image

    _getNameOfTileset: (data) ->
      return data.tilesets[0].name

    _getLayerName: (data) ->
      return data.layers[0].name

  return Map
)