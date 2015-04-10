var Ractive = require("ractive");
var rcu = require("rcu");
var toSource = require("tosource");
rcu.init(Ractive);

createComponent = function(definition) {
  var components_output = [];
  components_output.push('var components = {};');

  for(var i = 0; i < definition.imports.length; i++) {
    components_output.push("components[\'" + definition.imports[i].name + "\'] = require(\'" + definition.imports[i].href + "!ractem\')");
  }

  var output = [
      'var Ractive = require(\'ractive\')',
      components_output.join("\n\n"),
      'var component = {};',
      'var options = {};',
      'options.template = ' + toSource(definition.template),
      'options.partials = ' + toSource(definition.partials),
      'options.css = ' + toSource(definition.css),
      'options.components = components;',
      definition.script,
      'var exports = component.exports;',
      'if ( typeof exports === \'object\') {',
        'for ( prop in exports ) {',
          'if ( exports.hasOwnProperty( prop ) ) {',
            'options[ prop ] = exports[ prop ];',
          '}',
        '}',
      '}',
      'module.exports = Ractive.extend(options);'
    ];
    return output.join("\n\n");
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
  return createComponent(definition);
}
