'use strict';

$we.register('barchart', ['bower_components/underscore/underscore.js', 'css/barchart.css'], function(charts) {

  var template = 'templates/barchart.tpl';
  var i = 0, l = charts.length;

  var renderChart = function(el, widgetData) {

    $we.loadFile(template, function(template) {
      el.innerHTML = _.template(template, {
        title: el.getAttribute('data-widget-title'),
        data: JSON.parse(widgetData)
      });
    });

  };

  var getData = function(el) {

    $we.loadFile(el.getAttribute('data-widget-src'), function(data) {
      renderChart(el, data);
    });

  };

  for(;i<l;i++) {
    getData(charts[i]);
  }

});
