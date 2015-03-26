# Semantic-UI components for plastiq

These are some simple wrappers for using Semantic UI with Plastiq.

For the most part they're not very clever, and by this I mean:

  * you are still required to generate the HTML (or virtual-DOM) required to make Semantic UI work.
  * they don't necessarily update Semantic UI with HTML changes, for example, if your virtual-DOM adds a new tab, it won't make it known to Semantic UI.
  * Events, such as tab selection, aren't bound onto your model, as you might expect in a framework more idiomatic to plastiq.

Nevertheless, this isn't by design, so if you find something that you wish was a bit more clever, please send a pull request.

```bash
npm install plastiq-semantic-ui
```

## modal

```JavaScript
semanticUi.modal(options, vdom);
```

* `options` - options passed to `$(element).modal(options)`.
* `vdom` - contents of the modal.

```JavaScript
var plastiq = require('plastiq');
var h = plastiq.html;
var semanticUi = require('plastiq-semantic-ui');

function render(model) {
  var refresh = h.refresh;

  return h('div',
    h('input', {type: 'checkbox', binding: [model, 'show']}),
    model.show
    ? semanticUi.modal(
        {
          onHidden: function () {
            model.show = false;
          }
        },
        h('.ui.modal',
          h('i.close.icon'),
          h('.header', 'Modal Title'),
          h('.content',
            h('.image', 'An image can appear on left or an icon'),
            h('.description', 'A description can appear on the right')
          ),
          h('.actions',
            h('.ui.button', 'Cancel'),
            h('.ui.button', 'OK')
          )
        )
      )
    : undefined
  );
}

plastiq.append(document.body, render, {});
```

## tab

```JavaScript
semanticUi.tabs([options], vdom);
```

* `options` - options passed to `$(element).find('.item').tab(options)`.
* `vdom` - contents of the modal, should contain several `.item` elements.

```JavaScript
var plastiq = require('plastiq');
var h = plastiq.html;
var semanticUi = require('plastiq-semantic-ui');

function render(model) {
  var refresh = h.refresh;

  return h('div',
    semanticUi.tabs(
      h('.ui.top.attached.tabular.menu',
        h('a.item.active', {dataset: {tab: 'first'}}, 'First'),
        h('a.item', {dataset: {tab: 'second'}}, 'Second'),
        h('a.item', {dataset: {tab: 'third'}}, 'Third')
      )
    ),
    h('.ui.bottom.attached.tab.segment.active', {dataset: {tab: 'first'}}, 'First'),
    h('.ui.bottom.attached.tab.segment', {dataset: {tab: 'second'}}, 'Second'),
    h('.ui.bottom.attached.tab.segment', {dataset: {tab: 'third'}}, 'Third')
  );
}

plastiq.append(document.body, render, {});
```
