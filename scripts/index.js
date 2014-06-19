/*jslint node: true*/

/**
 * This small script wraps script.js in order to allow registered widgets to have
 * their own dependencies, on demand.
 *
 * It will register itself as $we in the global namespace.
 *
 * @usage:
 *
 *    $we.register('mywidget', ['jQuery.js', 'underscore.js', 'mywidget.css'],
 *          function() {
 *            // widget logic in here with jQuery, underscore loaded and css
 *            // injected
 *            $we.loadFile(file, function(data) {
 *              // handler to load text-based files that return data, like json
 *              // and templates
 *            });
 *          });
 *
 * @examples:
 *  see the /example directory
 *
 */

'use strict';

(function() {

  /**
   * Main widget engine class
   * @constructor
   */
  var WidgetEngine = function() {
    this._widgets = {};
  };

  /**
   * Function to register a widget with the engine.
   * @param {string} widgetName Name the widget for reference.
   * @param {Array} widgetDependencies An array of dependencies (full paths).
   * @param {function} widgetLogicFn Callback function - when this fires, all
   *        dependencies will have been loaded.
   */
  WidgetEngine.prototype.register = function register(widgetName, widgetDependencies, widgetLogicFn) {

    var i = 0,
      l = widgetDependencies.length,
      scriptDependencies = [],
      cssDependencies = [],
      nodes = null,
      engine = this;

    // find out if there are any nodes that match the widget
    nodes = document.querySelectorAll('[data-widget-type="' + widgetName + '"]');

    if (!nodes.length) {
      // no matching nodes for this widget - do nothing
      return;
    }

    if (!this._widgets[widgetName]) {
      this._widgets[widgetName] = {
        dependencies: widgetDependencies
      };
    } else {
      // dependencies for this widget are already loaded/loading
      widgetLogicFn.call(engine, nodes);
    }

    for (;i<l;i++) {
      if (widgetDependencies[i].indexOf('.js') > -1) {
        scriptDependencies.push(widgetDependencies[i]);
      }
      if (widgetDependencies[i].indexOf('.css') > -1) {
        cssDependencies.push(widgetDependencies[i]);
      }
    }

    $script(scriptDependencies, function() {
      widgetLogicFn.call(engine, nodes);
    });

    if (cssDependencies.length) {
      this.injectCSS_(cssDependencies);
    }
  };

  /**
   * Utility to load files that return data from the widget.
   * @param {string} file A path to a file.
   * @param {function} fn A callback function.
   */
  WidgetEngine.prototype.loadFile = function render(file, fn)  {

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      fn(this.responseText);
    };
    xhr.open('get', file, true);
    xhr.send();

  };

  /**
   * Will inject css files in the header element.
   * @param {Array} cssDependencies An array of paths to css files.
   */
  WidgetEngine.prototype.injectCSS_ = function injectCSS(cssDependencies) {

    var i = 0, l = cssDependencies.length;
    var head = document.getElementsByTagName('head')[0];
    var tag = null;
    var t = null;

    for (;i<l;i++) {

      t = cssDependencies[i].split('/');

      if (!document.getElementById(t[t.length])) {
        tag = document.createElement('link');
        tag.setAttribute('href', cssDependencies[i]);
        tag.setAttribute('id',t[t.length]);
        tag.setAttribute('rel', 'stylesheet');
        tag.setAttribute('type', 'text/css');
        head.appendChild(tag);
      }
    }
  };

  /**
   * Exposes the WidgetEngine as a singleton on the global namespace.
   */
  if (window && !window.$we) {
    window.$we = new WidgetEngine();
  }

})();
