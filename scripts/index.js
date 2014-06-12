/*jslint node: true*/

'use strict';

(function() {

  var WidgetEngine = function() {
    this._widgets = {};
  };

  WidgetEngine.prototype.register = function register(widgetName, widgetDependencies, widgetLogicFn) {

    var i = 0,
      l = widgetDependencies.length,
      scriptDependencies = [],
      cssDependencies = [];

    if (!this._widgets[widgetName]) {
      this._widgets[widgetName] = {
        dependencies: widgetDependencies
      };
    }

    for (;i<l;i++) {
      if (widgetDependencies[i].indexOf('.js')) {
        scriptDependencies.push(widgetDependencies[i]);
      }
      if (widgetDependencies[i].indexOf('.css')) {
        cssDependencies.push(widgetDependencies[i]);
      }
    }

    $script([scriptDependencies], function() {
      widgetLogicFn();
    });

    this.injectCSS_(cssDependencies);
  };

  WidgetEngine.prototype.injectCSS_ = function injectCSS(cssDependencies) {

    var i = 0, l = cssDependencies.length;
    var head = document.getElementsByName('head')[0];
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

  if (module && module.exports) {
    module.exports = new WidgetEngine();
  }
  else if (window && !window.$we) {
    window.$we = new WidgetEngine();
  }

})();
