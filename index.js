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

exports.tabs = function tabs(options, vdom) {
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
