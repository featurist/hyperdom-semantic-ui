var plastiq = require('plastiq');
var h = plastiq.html;

function mapObject(src, fn) {
  var dest = {};

  Object.keys(src).forEach(function (key) {
    dest[key] = fn(src[key]);
  });

  return dest;
}

function refreshifyObject(obj) {
  return mapObject(obj, function (value) {
    if (typeof value === 'function') {
      return h.refreshify(value);
    } else {
      return value;
    }
  });
}

exports.modal = function modal(options, vdom) {
  options = refreshifyObject(options);

  return h.component(
    {
      detached: true,
      onadd: function (element) {
        this.modal = $(element);
        this.modal.modal(options);
        this.modal.modal('show');
      },
      onremove: function (element) {
        this.modal.modal('hide');
        this.modal.remove();
      }
    },
    vdom
  );
};

function isPlainObject(o) {
  return o.constructor === Object;
}

exports.tabs = function tabs(selector, options, vdom) {
  if (typeof(selector) == 'string') {
    var binding = plastiq.binding(options.binding);
    
    var activeKey = binding.get();
    if (!activeKey) {
      activeKey = options.tabs[0].key;
      binding.set(activeKey);
    }

    var activeTab = options.tabs.filter(function (tab) { return tab.key == activeKey; })[0];

    if (!activeTab) {
      activeTab = options.tabs[0];
      activeKey = activeTab.key;
    }

    var content = activeTab.content(activeKey);
    content.properties.className += ' active';
    content.key = 'content';

    return h('div',
      h(selector, {key: 'tabs'},
        options.tabs.map(function (tab) {
          var tabTitle = tab.tab;

          if (activeKey == tab.key) {
            tabTitle.properties.className += ' active';
          }

          tabTitle.properties.onclick = function () {
            binding.set(tab.key);
          };

          return tabTitle;
        })
      ),
      content
    );
  } else {
    options = selector;
    vdom = options;

    if (!isPlainObject(options)) {
      vdom = options;
      options = undefined;
    }

    if (options) {
      options = refreshifyObject(options);
    }

    return h.component(
      {
        onadd: function (element) {
          var items = $(element).find('.item');
          if (options) {
            items.tab(options);
          } else {
            items.tab();
          }
        }
      },
      vdom
    );
  }
};

exports.dropdown = function (options, vdom) {
  if (!isPlainObject(options)) {
    vdom = options;
    options = undefined;
  }

  if (options) {
    options = refreshifyObject(options);
  }

  return h.component(
    {
      onadd: function (element) {
        this.element = $(element);
        if (options) {
          this.element.dropdown(options);
        } else {
          this.element.dropdown();
        }
      },
      onupdate: function () {
        this.element.dropdown('refresh');
      }
    },
    vdom
  );
};

exports.checkbox = function (options, vdom) {
  var binding = h.binding(options.binding);

  return h.component(
    {
      binding: binding,

      onadd: function (element) {
        var self = this;
        var $element = $(element);

        $element.checkbox().on('click', function () {
          self.checked = $(this).checkbox('is checked');
          self.binding.set(self.checked);
        });

        this.checked = !!this.binding.get();
        if (this.checked) {
          $element.checkbox('check');
        }
      },

      onupdate: function (element) {
        var checked = !!this.binding.get();
        if (checked != this.checked) {
          this.checked = checked;
          $(element).checkbox(checked? 'check': 'uncheck');
        }
      }
    },
    vdom
  );
};

exports.search = function(options, vdom) {
  options = refreshifyObject(options);

  return h.component(
    {
      onadd: function (element) {
        $(element).search(options);
      }
    },
    vdom
  );
};
