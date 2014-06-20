define(['jquery'], ($) ->
  class Map
    constructor: (@game, @Phaser, @mapId) ->
      @layer = null
      @layers = []
      @oldBorders = null
      @borders = 
        upScreen: true
        rightScreen: true
        downScreen: true
        leftScreen: true
      @game.physics.arcade.checkCollision.up = false
      @game.physics.arcade.checkCollision.right = false
      @game.physics.arcade.checkCollision.down = false
      @game.physics.arcade.checkCollision.left = false
      @game.on('changeMap', (direction) =>
        @reload(direction)
      )

    preload: (direction, data, callback) ->
      that = @
      url = "#{@game.rootUrl}/move/#{direction}/#{@mapId}"
      if !data
        $.ajax({
          url: url
          success: (data) =>
            $('#map-id').attr('href', '/edit/' + @mapId);
            that._loadAssets.call(that, data, callback)
        })
      else
        @_loadAssets.call(@, data, callback)
        
    _loadAssets: (data, callback) ->
      # if hero
      #   hero.set 'mapId', data._id
      #   console.log "Enter #{hero.mapId}"
      #   console.log hero.sprite.x
      #   console.log hero.sprite.y
      #   hero.actions.join hero.mapId, hero.user,
      #     x: hero.sprite.x
      #     y: hero.sprite.y
      @mapId = data._id

      @game.mapId = @mapId
      # @game.join
      #   mapId: @mapId
      #   x: 0
      #   y: 0

      @mapData = data
      @game.load.tilemap('map', null, data, @Phaser.Tilemap.TILED_JSON)
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
          @game.physics.arcade.checkCollision[border.split('Screen')[0]] = !value

    create: ->
      # console.log map
      map = @game.add.tilemap('map')
      tilesetName = @_getNameOfTileset(@mapData)
      map.addTilesetImage(tilesetName, 'tiles')
      layername = @_getLayerName(@mapData)
      # console.log layername
      @layer = map.createLayer(layername)
      @layers.push(@layer)
      # console.log @layers
      @layer.resizeWorld()
      @layer.debug = false
      # console.log @layer
      @trigger 'finishLoad'

    reload: (direction) ->
      layer.destroy() for layer in @layers
      @layers = []
      @preload(direction, null, @create)

    update: ->

    _getImageNameOfTileset: (data) ->
      return data.tilesets[0].image

    _getNameOfTileset: (data) ->
      return data.tilesets[0].name

    _getLayerName: (data) ->
      return data.layers[0].name


  return Map
)