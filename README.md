Ractem = Ractive + SystemJS
---

It's a plugin for [SystemJS](https://github.com/systemjs/systemjs) for loading [Ractive](https://github.com/ractivejs/ractive) components as describe in the [component-spec](https://github.com/ractivejs/component-spec). It uses [rcu](https://github.com/ractivejs/rcu) for parsing.

Usage
---
Just require your files using ```!ractem``` and you would be ready to go:

```javascript
  var Component = require("components/Widget.html!ractem") // OR
  var Component = require("components/Widget.ractem!")
```

LICENSE
---

Apache 2.0