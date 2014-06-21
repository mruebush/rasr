define(['jquery'], ($) ->
  class Map
    constructor: (@game, @Phaser, @mapId) ->
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
        @game.changingScreen = true;
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
            $('.creatables > button').remove();

            if(!data.upScreen)
              $up = $("<button class='btn btn-primary'>Up</button>")
              $up.click =>
                @_makeMap('up', data._id)
              $('.creatables').append(up)
            if(!data.rightScreen)
              $right = $("<button class='btn btn-primary'>right</button>")
              $right.click =>
                @_makeMap('right', data._id)
              $('.creatables').append($right)
            if(!data.downScreen)
              $down = $("<button class='btn btn-primary'>down</button>")
              $down.click =>
                @_makeMap('down', data._id)
              $('.creatables').append($down)
            if(!data.leftScreen)
              $left = $("<button class='btn btn-primary'>left</button>")
              $left.click =>
                @_makeMap('left', data._id)
              $('.creatables').append($left)
       
            that._loadAssets.call(that, data, callback)
            @game.mapData = data
            @game.trigger 'enterMap'
        })
      else
        @_loadAssets.call(@, data, callback)

    _loadAssets: (data, callback) ->
      @mapId = data._id
      @game.mapId = @mapId
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
      map = @game.add.tilemap('map')
      tilesetName = @_getNameOfTileset(@mapData)
      map.addTilesetImage(tilesetName, 'tiles')
      layers = @_getLayers(@mapData)
      for layer in layers
        @layers.push(map.createLayer(layer.name))
        @layers[@layers.length - 1].resizeWorld()


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

    _getLayers: (data) ->
      return data.layers;

    _makeMap: (direction, mapId) ->
      $.ajax({
        url: "/make/#{direction}/#{mapId}"
        type: "GET",
        success: ->
          console.log('hah!');
        error: ->
          console.log('lol');
      });


  return Map
)