var Ractive = require("ractive");
var rcu = require("rcu");
var toSource = require("tosource");
rcu.init(Ractive);

createComponent = function(definition, source) {
  var components_output = [];
  var name = source.name.split("!");
  name = name[0];
  name = name.replace(/^.*[\\\/]/, '');

  components_output.push('var components = {};');

  for(var i = 0; i < definition.imports.length; i++) {
    components_output.push("components[\'" + definition.imports[i].name + "\'] = require(\'" + definition.imports[i].href + "!ractem\')");
  }

  var beforeScript = [
    'var Ractive = require(\'ractive\')',
    components_output.join("\n\n"),
    'var component = {};',
    'var options = {};',
    'options.template = ' + toSource(definition.template),
    'options.partials = ' + toSource(definition.partials),
    'options.css = ' + toSource(definition.css),
    'options.components = components;',
  ].join("\n");

  var afterScript = [
      'var exports = component.exports;',
      'if ( typeof exports === \'object\') {',
        'for ( prop in exports ) {',
          'if ( exports.hasOwnProperty( prop ) ) {',
            'options[ prop ] = exports[ prop ];',
          '}',
        '}',
      '}',
      'module.exports = Ractive.extend(options);'
    ].join("\n");

    var options = {
      source: [name],
      file: name,
      offset: beforeScript.split("\n").length
    };
    var sourceMap = rcu.generateSourceMap(definition, options);
    var code = [
      beforeScript,
      definition.script,
      afterScript,
    ].join("\n");

    return {
      code: code,
      sourceMap: sourceMap
    };
}

exports.translate = function(load) {
  var definition = rcu.parse(load.source);
  var imports = {};
  var options = {
    template: definition.template,
    partials: definition.partials,
    css: definition.css,
    components: imports
  };
  var component = createComponent(definition, load);
  load.metadata.sourceMap = component.sourceMap;
  return component.code;
}
