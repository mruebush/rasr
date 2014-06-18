require.config({
  baseUrl: 'scripts/edit',

  shim: {
    'jquery-ui': {
      exports: '$',
      deps: [
        'jquery'
      ]
    },

    'jquery.mousewheel': ['jquery'],
    'jquery.jscrollpane': ['jquery'],
    'jquery.draggable': ['jquery'],

    'underscore': {
      exports: '_'
    }
  },

  paths: {
    'jquery': 'libs/jquery',
    'jquery.mousewheel': 'plugins/jquery.mousewheel',
    'jquery.jscrollpane': 'plugins/jquery.jscrollpane',
    'jquery.draggable': 'plugins/jquery.draggable',
    'jquery-ui': 'libs/jquery-ui',

    'editor': 'modules/editor',
    'underscore': 'libs/underscore',
    'text': 'plugins/text',
    'templates': '../templates'
  }
});

require(['jquery-ui', 'editor'], function($, Editor) {
  Editor.$ = $;
  $(document).ready(Editor.initialize);
});