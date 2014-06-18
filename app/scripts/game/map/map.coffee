define(['jquery'], ($) ->
  class Map
    constructor: (@game, @Phaser, @mapId) ->
      @layer = null
      @oldBorders = null
      @borders = 
        upScreen: true
        rightScreen: true
        downScreen: true
        leftScreen: true


    preload: (direction = 'screen', data, callback, hero) ->
      that = @
      url = "http://g4m3.azurewebsites.net/#{direction}/#{@mapId}"
      if !data
        $.ajax({
          url: url
          success: (data) =>
            that._loadAssets.call(that, data, callback, hero)
        })
      else
        @_loadAssets.call(@, data, callback, hero)
        
    _loadAssets: (data, callback, hero) ->
      if hero
        hero.set 'mapId', data._id
        console.log "Enter #{hero.mapId}"
        console.log hero.sprite.x
        console.log hero.sprite.y
        hero.actions.join hero.mapId, hero.user,
          x: hero.sprite.x
          y: hero.sprite.y

      @mapId = data._id
      @mapData = data
      @game.load.tilemap('map', "assets/tilemaps/maps/desert. json", data, @Phaser.Tilemap.TILED_JSON)
      tilesetImage = @_getImageNameOfTileset(data)
      @game.load.image('tiles', "assets/tilemaps/tiles/" + tilesetImage)
      callback && callback.apply(@)

      @oldBorders = @borders
      @borders = 
        upScreen: data.upScreen
        rightScreen: data.rightScreen
        downScreen: data.downScreen
        leftScreen: data.leftScreen

      for border, value of @borders
        if !!value != !!@oldBorders[border]
          $(".#{border}").toggleClass('no-bordering-screen')
          @trigger 'borderChange', border, !!value

    create: ->
      map = @game.add.tilemap('map')
      tilesetName = @_getNameOfTileset(@mapData)
      map.addTilesetImage(tilesetName, 'tiles')
      layername = @_getLayerName(@mapData)
      @layer = map.createLayer(layername)
      @layer.resizeWorld()
      @layer.debug = false
      @trigger 'finishLoad'

    reload: (direction, hero) ->
      @preload(direction, null, @create, hero)

    update: ->

    _getImageNameOfTileset: (data) ->
      return data.tilesets[0].image

    _getNameOfTileset: (data) ->
      return data.tilesets[0].name

    _getLayerName: (data) ->
      return data.layers[0].name


  return Map
)