import { select, event } from 'd3-selection';
import { drag } from 'd3-drag';
import { line, curveLinear, arc, curveCatmullRom } from 'd3-shape';
import { dispatch } from 'd3-dispatch';

var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

var Annotation = function () {
    function Annotation(_ref) {
      var _ref$x = _ref.x,
          x = _ref$x === undefined ? 0 : _ref$x,
          _ref$y = _ref.y,
          y = _ref$y === undefined ? 0 : _ref$y,
          _ref$dy = _ref.dy,
          dy = _ref$dy === undefined ? 0 : _ref$dy,
          _ref$dx = _ref.dx,
          dx = _ref$dx === undefined ? 0 : _ref$dx,
          data = _ref.data,
          type = _ref.type,
          subject = _ref.subject,
          connector = _ref.connector,
          note = _ref.note,
          disable = _ref.disable,
          id = _ref.id,
          className = _ref.className;
      classCallCheck(this, Annotation);


      this._dx = dx;
      this._dy = dy;
      this._x = x;
      this._y = y;
      this.id = id;
      this._className = className || '';

      this.type = type || '';
      this.data = data;

      this.note = note || {};
      this.connector = connector || {};
      this.subject = subject || {};

      this.disable = disable || [];
    }

    createClass(Annotation, [{
      key: 'updatePosition',
      value: function updatePosition() {
        if (this.type.setPosition) {
          this.type.setPosition();
          if (this.type.subject.selectAll(':not(.handle)').nodes().length !== 0) {
            this.type.redrawSubject();
          }
        }
      }
    }, {
      key: 'updateOffset',
      value: function updateOffset() {
        if (this.type.setOffset) {
          this.type.setOffset();

          if (this.type.connector.selectAll(':not(.handle)').nodes().length !== 0) {
            this.type.redrawConnector();
          }

          this.type.redrawNote();
        }
      }
    }, {
      key: 'className',
      get: function get() {
        return this._className;
      },
      set: function set(className) {
        this._className = className;
        if (this.type.setClassName) this.type.setClassName();
      }
    }, {
      key: 'x',
      get: function get() {
        return this._x;
      },
      set: function set(x) {
        this._x = x;
        this.updatePosition();
      }
    }, {
      key: 'y',
      get: function get() {
        return this._y;
      },
      set: function set(y) {
        this._y = y;
        this.updatePosition();
      }
    }, {
      key: 'dx',
      get: function get() {
        return this._dx;
      },
      set: function set(dx) {
        this._dx = dx;
        this.updateOffset();
      }
    }, {
      key: 'dy',
      get: function get() {
        return this._dy;
      },
      set: function set(dy) {
        this._dy = dy;
        this.updateOffset();
      }
    }, {
      key: 'offset',
      get: function get() {
        return { x: this._dx, y: this._dy };
      },
      set: function set(_ref2) {
        var x = _ref2.x,
            y = _ref2.y;

        this._dx = x;
        this._dy = y;
        this.updateOffset();
      }
    }, {
      key: 'position',
      get: function get() {
        return { x: this._x, y: this._y };
      },
      set: function set(_ref3) {
        var x = _ref3.x,
            y = _ref3.y;

        this._x = x;
        this._y = y;
        this.updatePosition();
      }
    }, {
      key: 'translation',
      get: function get() {
        return {
          x: this._x + this._dx,
          y: this._y + this._dy
        };
      }
    }, {
      key: 'json',
      get: function get() {
        var json = {
          x: this._x,
          y: this._y,
          dx: this._dx,
          dy: this._dy
        };

        if (this.data && Object.keys(this.data).length > 0) json.data = this.data;
        if (this.type) json.type = this.type;
        if (this._className) json.className = this._className;

        if (Object.keys(this.connector).length > 0) json.connector = this.connector;
        if (Object.keys(this.subject).length > 0) json.subject = this.subject;
        if (Object.keys(this.note).length > 0) json.note = this.note;

        return json;
      }
    }]);
    return Annotation;
  }();

var AnnotationCollection = function () {
    function AnnotationCollection(_ref) {
      var annotations = _ref.annotations,
          accessors = _ref.accessors,
          accessorsInverse = _ref.accessorsInverse;
      classCallCheck(this, AnnotationCollection);

      this.accessors = accessors;
      this.accessorsInverse = accessorsInverse;
      this.annotations = annotations;
    }

    createClass(AnnotationCollection, [{
      key: "clearTypes",
      value: function clearTypes(newSettings) {
        this.annotations.forEach(function (d) {
          d.type = undefined;
          d.subject = newSettings && newSettings.subject || d.subject;
          d.connector = newSettings && newSettings.connector || d.connector;
          d.note = newSettings && newSettings.note || d.note;
        });
      }
    }, {
      key: "setPositionWithAccessors",
      value: function setPositionWithAccessors() {
        var _this = this;

        this.annotations.forEach(function (d) {
          d.type.setPositionWithAccessors(_this.accessors);
        });
      }
    }, {
      key: "editMode",
      value: function editMode(_editMode) {
        this.annotations.forEach(function (a) {
          if (a.type) {
            a.type.editMode = _editMode;
            a.type.updateEditMode();
          }
        });
      }
    }, {
      key: "updateDisable",
      value: function updateDisable(disable) {
        this.annotations.forEach(function (a) {
          a.disable = disable;
          if (a.type) {
            disable.forEach(function (d) {
              if (a.type[d]) {
                a.type[d].remove && a.type[d].remove();
                a.type[d] = undefined;
              }
            });
          }
        });
      }
    }, {
      key: "updateTextWrap",
      value: function updateTextWrap(textWrap) {
        this.annotations.forEach(function (a) {
          if (a.type && a.type.updateTextWrap) {
            a.type.updateTextWrap(textWrap);
          }
        });
      }
    }, {
      key: "updateNotePadding",
      value: function updateNotePadding(notePadding) {
        this.annotations.forEach(function (a) {
          if (a.type) {
            a.type.notePadding = notePadding;
          }
        });
      }
    }, {
      key: "json",
      get: function get() {
        var _this2 = this;

        return this.annotations.map(function (a) {
          var json = a.json;
          if (_this2.accessorsInverse && a.data) {
            json.data = {};
            Object.keys(_this2.accessorsInverse).forEach(function (k) {
              json.data[k] = _this2.accessorsInverse[k]({ x: a.x, y: a.y });

              //TODO make this feasible to map back to data for other types of subjects
            });
          }
          return json;
        });
      }
    }, {
      key: "noteNodes",
      get: function get() {
        return this.annotations.map(function (a) {
          return _extends({}, a.type.getNoteBBoxOffset(), { positionX: a.x, positionY: a.y });
        });
      }

      //TODO: come back and rethink if a.x and a.y are applicable in all situations
      // get connectorNodes() {
      //   return this.annotations.map(a => ({ ...a.type.getConnectorBBox(), startX: a.x, startY: a.y}))
      // }

      // get subjectNodes() {
      //   return this.annotations.map(a => ({ ...a.type.getSubjectBBox(), startX: a.x, startY: a.y}))
      // }

      // get annotationNodes() {
      //   return this.annotations.map(a => ({ ...a.type.getAnnotationBBox(), startX: a.x, startY: a.y}))
      // }

    }]);
    return AnnotationCollection;
  }();

var pointHandle = function pointHandle(_ref) {
    var _ref$cx = _ref.cx,
        cx = _ref$cx === undefined ? 0 : _ref$cx,
        _ref$cy = _ref.cy,
        cy = _ref$cy === undefined ? 0 : _ref$cy;

    return { move: { x: cx, y: cy } };
  };

  var circleHandles = function circleHandles(_ref2) {
    var _ref2$cx = _ref2.cx,
        cx = _ref2$cx === undefined ? 0 : _ref2$cx,
        _ref2$cy = _ref2.cy,
        cy = _ref2$cy === undefined ? 0 : _ref2$cy,
        r1 = _ref2.r1,
        r2 = _ref2.r2,
        padding = _ref2.padding;

    var h = { move: { x: cx, y: cy } };

    if (r1 !== undefined) {
      h.r1 = { x: cx + r1 / Math.sqrt(2), y: cy + r1 / Math.sqrt(2) };
    }

    if (r2 !== undefined) {
      h.r2 = { x: cx + r2 / Math.sqrt(2), y: cy + r2 / Math.sqrt(2) };
    }

    if (padding !== undefined) {
      h.padding = { x: cx + r1 + padding, y: cy };
    }

    return h;
  };

  //arc handles
  var addHandles = function addHandles(_ref5) {
    var group = _ref5.group,
        handles = _ref5.handles,
        _ref5$r = _ref5.r,
        r = _ref5$r === undefined ? 10 : _ref5$r;

    //give it a group and x,y to draw handles
    //then give it instructions on what the handles change 
    var h = group.selectAll('circle.handle').data(handles);

    h.enter().append('circle').attr('class', 'handle').call(d3Drag.drag().container(d3Selection.select('g.annotations').node()).on('start', function (d) {      return d.start && d.start(d);
    }).on('drag', function (d) {
      return d.drag && d.drag(d);
    }).on('end', function (d) {
      return d.end && d.end(d);
    }));

    group.selectAll('circle.handle').attr('cx', function (d) {
      return d.x;
    }).attr('cy', function (d) {
      return d.y;
    }).attr('r', function (d) {
      return d.r || r;
    }).attr('class', function (d) {
      return 'handle ' + (d.className || '');
    });

    h.exit().remove();
  };

var leftRightDynamic = function leftRightDynamic(align, y) {
    if (align == "dynamic" || align == "left" || align == "right") {
      if (y < 0) {
        align = "top";
      } else {
        align = "bottom";
      }
    }
    return align;
  };

  var topBottomDynamic = function topBottomDynamic(align, x) {
    if (align == "dynamic" || align == "top" || align == "bottom") {
      if (x < 0) {
        align = "right";
      } else {
        align = "left";
      }
    }
    return align;
  };

var noteAlignment = (function (_ref) {    var padding = _ref.padding,
        bbox = _ref.bbox,
        align = _ref.align,
        orientation = _ref.orientation,
        offset = _ref.offset;

    var x = -bbox.x;
    var y = -bbox.y;

    if (orientation === "topBottom") {
      align = topBottomDynamic(align, offset.x);
      if (offset.y < 0) {
        y -= bbox.height + padding;
      } else {
        y += padding;
      }

      if (align === "middle") {
        x -= bbox.width / 2;
      } else if (align === "right") {
        x -= bbox.width;
      }
    } else if (orientation === "leftRight") {
      align = leftRightDynamic(align, offset.y);
      if (offset.x < 0) {
        x -= bbox.width + padding;
      } else {
        x += padding;
      }

      if (align === "middle") {
        y -= bbox.height / 2;
      } else if (align === "top") {
        y -= bbox.height;
      }
    }

    return { x: x, y: y };
  });

var lineBuilder = function lineBuilder(_ref) {
    var data = _ref.data,
        _ref$curve = _ref.curve,
        curve = _ref$curve === undefined ? d3Shape.curveLinear : _ref$curve,
        canvasContext = _ref.canvasContext,
        className = _ref.className;

    var lineGen = d3Shape.line().curve(curve);

    var builder = {
      type: 'path',
      className: className,
      data: data
    };

    if (canvasContext) {
      lineGen.context(canvasContext);
      builder.pathMethods = lineGen;
    } else {
      builder.attrs = {
        d: lineGen(data)
      };
    }

    return builder;
  };

  var arcBuilder = function arcBuilder(_ref2) {
    var data = _ref2.data,
        canvasContext = _ref2.canvasContext,
        className = _ref2.className;


    var builder = {
      type: 'path',
      className: className,
      data: data
    };

    var arcShape = d3Shape.arc().innerRadius(data.innerRadius || 0).outerRadius(data.outerRadius || data.radius || 2).startAngle(data.startAngle || 0).endAngle(data.endAngle || 2 * Math.PI);    if (canvasContext) {
      arcShape.context(canvasContext);
      builder.pathMethods = lineGen;
    } else {

      builder.attrs = {
        d: arcShape()
      };
    }

    return builder;
  };

var noteVertical = (function (_ref) {    var align = _ref.align,
        _ref$x = _ref.x,
        x = _ref$x === undefined ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === undefined ? 0 : _ref$y,
        bbox = _ref.bbox,
        offset = _ref.offset,
        padding = _ref.padding;

    align = leftRightDynamic(align, offset.y);

    if (align == "top") {
      y -= bbox.height;
    } else if (align == "middle") {
      y -= bbox.height / 2;
    }

    var data = [[x, y], [x, y + bbox.height]];
    return { components: [lineBuilder({ data: data, className: "note-line" })] };
  });

var noteHorizontal = (function (_ref) {    var align = _ref.align,
        _ref$x = _ref.x,
        x = _ref$x === undefined ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === undefined ? 0 : _ref$y,
        offset = _ref.offset,
        bbox = _ref.bbox,
        padding = _ref.padding;

    align = topBottomDynamic(align, offset.x);

    if (align == "right") {
      x -= bbox.width;
    } else if (align == "middle") {
      x -= bbox.width / 2;
    }

    var data = [[x, y], [x + bbox.width, y]];
    return { components: [lineBuilder({ data: data, className: "note-line" })] };
  });

var lineSetup = function lineSetup(_ref) {
    var type = _ref.type,
        subjectType = _ref.subjectType;

    var annotation = type.annotation;
    var offset = annotation.position;

    var x1 = annotation.x - offset.x,
        x2 = x1 + annotation.dx,
        y1 = annotation.y - offset.y,
        y2 = y1 + annotation.dy;

    var subjectData = annotation.subject;

    if (subjectType == "circle" && (subjectData.outerRadius || subjectData.radius)) {
      var h = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      var angle = Math.asin(-y2 / h);
      var r = subjectData.outerRadius || subjectData.radius + (subjectData.radiusPadding || 0);

      x1 = Math.abs(Math.cos(angle) * r) * (x2 < 0 ? -1 : 1);
      y1 = Math.abs(Math.sin(angle) * r) * (y2 < 0 ? -1 : 1);
    }

    if (subjectType == "rect") {
      var width = subjectData.width,
          height = subjectData.height;


      if (width > 0 && annotation.dx > 0 || width < 0 && annotation.dx < 0) {
        if (Math.abs(width) > Math.abs(annotation.dx)) x1 = width / 2;else x1 = width;
      }
      if (height > 0 && annotation.dy > 0 || height < 0 && annotation.dy < 0) {
        if (Math.abs(height) > Math.abs(annotation.dy)) y1 = height / 2;else y1 = height;
      }
      if (x1 == width / 2 && y1 == height / 2) {
        x1 = x2;y1 = y2;
      }
    }

    return [[x1, y1], [x2, y2]];
  };

var connectorLine = (function (connectorData) {    var data = lineSetup(connectorData);
    return { components: [lineBuilder({ data: data, className: "connector" })] };
  });

var connectorElbow = (function (_ref) {    var type = _ref.type,
        subjectType = _ref.subjectType;


    var annotation = type.annotation;
    var offset = annotation.position;

    var x1 = annotation.x - offset.x,
        x2 = x1 + annotation.dx,
        y1 = annotation.y - offset.y,
        y2 = y1 + annotation.dy;

    var subjectData = annotation.subject;

    if (subjectType == "rect") {
      var width = subjectData.width,
          height = subjectData.height;


      if (width > 0 && annotation.dx > 0 || width < 0 && annotation.dx < 0) {
        if (Math.abs(width) > Math.abs(annotation.dx)) x1 = width / 2;else x1 = width;
      }
      if (height > 0 && annotation.dy > 0 || height < 0 && annotation.dy < 0) {
        if (Math.abs(height) > Math.abs(annotation.dy)) y1 = height / 2;else y1 = height;
      }
      if (x1 == width / 2 && y1 == height / 2) {
        x1 = x2;y1 = y2;
      }
    }

    var data = [[x1, y1], [x2, y2]];

    var diffY = y2 - y1;
    var diffX = x2 - x1;
    var xe = x2;
    var ye = y2;
    var opposite = y2 < y1 && x2 > x1 || x2 < x1 && y2 > y1 ? -1 : 1;

    if (Math.abs(diffX) < Math.abs(diffY)) {
      xe = x2;
      ye = y1 + diffX * opposite;
    } else {
      ye = y2;
      xe = x1 + diffY * opposite;
    }

    if (subjectType == "circle" && (subjectData.outerRadius || subjectData.radius)) {
      var r = (subjectData.outerRadius || subjectData.radius) + (subjectData.radiusPadding || 0);
      var length = r / Math.sqrt(2);

      if (Math.abs(diffX) > length && Math.abs(diffY) > length) {
        x1 = length * (x2 < 0 ? -1 : 1);
        y1 = length * (y2 < 0 ? -1 : 1);
        data = [[x1, y1], [xe, ye], [x2, y2]];
      } else if (Math.abs(diffX) > Math.abs(diffY)) {
        var angle = Math.asin(-y2 / r);
        x1 = Math.abs(Math.cos(angle) * r) * (x2 < 0 ? -1 : 1);
        data = [[x1, y2], [x2, y2]];
      } else {
        var _angle = Math.acos(x2 / r);
        y1 = Math.abs(Math.sin(_angle) * r) * (y2 < 0 ? -1 : 1);
        data = [[x2, y1], [x2, y2]];
      }
    } else {
      data = [[x1, y1], [xe, ye], [x2, y2]];
    }

    return { components: [lineBuilder({ data: data, className: "connector" })] };
  });

var connectorCurve = (function (_ref) {
    var type = _ref.type,
        connectorData = _ref.connectorData,
        subjectType = _ref.subjectType;


    if (!connectorData) {
      connectorData = {};
    }
    if (!connectorData.points || typeof connectorData.points === "number") {
      connectorData.points = createPoints(type.annotation.offset, connectorData.points);
    }
    if (!connectorData.curve) {
      connectorData.curve = d3Shape.curveCatmullRom;
    }

    var handles = [];

    if (type.editMode) {
      (function () {
        var cHandles = connectorData.points.map(function (c, i) {
          return _extends({}, pointHandle({ cx: c[0], cy: c[1] }), { index: i });
        });

        var updatePoint = function updatePoint(index) {
          connectorData.points[index][0] += d3Selection.event.dx;
          connectorData.points[index][1] += d3Selection.event.dy;
          type.redrawConnector();
        };

        handles = type.mapHandles(cHandles.map(function (h) {
          return _extends({}, h.move, { drag: updatePoint.bind(type, h.index) });
        }));
      })();
    }

    var data = lineSetup({ type: type, subjectType: subjectType });
    data = [data[0]].concat(toConsumableArray(connectorData.points), [data[1]]);
    var components = [lineBuilder({ data: data, curve: connectorData.curve, className: "connector" })];

    return { components: components, handles: handles };
  });

  var createPoints = function createPoints(offset) {
    var anchors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

    var diff = { x: offset.x / (anchors + 1), y: offset.y / (anchors + 1) };
    var p = [];

    var i = 1;
    for (; i <= anchors; i++) {
      p.push([diff.x * i + i % 2 * 20, diff.y * i - i % 2 * 20]);
    }
    return p;
  };

var connectorArrow = (function (_ref) {    var annotation = _ref.annotation,
        start = _ref.start,
        end = _ref.end;

    var offset = annotation.position;
    if (!start) {
      start = [annotation.dx, annotation.dy];
    } else {
      start = [-end[0] + start[0], -end[1] + start[1]];
    }
    if (!end) {
      end = [annotation.x - offset.x, annotation.y - offset.y];
    }

    var x1 = end[0],
        y1 = end[1];

    var dx = start[0];
    var dy = start[1];

    var size = 10;
    var angleOffset = 16 / 180 * Math.PI;
    var angle = Math.atan(dy / dx);

    if (dx < 0) {
      angle += Math.PI;
    }

    var data = [[x1, y1], [Math.cos(angle + angleOffset) * size + x1, Math.sin(angle + angleOffset) * size + y1], [Math.cos(angle - angleOffset) * size + x1, Math.sin(angle - angleOffset) * size + y1], [x1, y1]];

    //TODO add in reverse
    // if (canvasContext.arrowReverse){
    //   data = [[x1, y1], 
    //   [Math.cos(angle + angleOffset)*size, Math.sin(angle + angleOffset)*size],
    //   [Math.cos(angle - angleOffset)*size, Math.sin(angle - angleOffset)*size],
    //   [x1, y1]
    //   ]
    // } else {
    //   data = [[x1, y1], 
    //   [Math.cos(angle + angleOffset)*size, Math.sin(angle + angleOffset)*size],
    //   [Math.cos(angle - angleOffset)*size, Math.sin(angle - angleOffset)*size],
    //   [x1, y1]
    //   ]
    // }

    return { components: [lineBuilder({ data: data, className: 'connector-arrow' })] };
  });

var connectorDot = (function (_ref) {    var line = _ref.line;


    var dot = arcBuilder({ className: 'connector-dot', data: { radius: 3 } });
    dot.attrs.transform = 'translate(' + line.data[0][0] + ', ' + line.data[0][1] + ')';

    return { components: [dot] };
  });

var subjectCircle = (function (_ref) {
    var subjectData = _ref.subjectData,
        type = _ref.type;

    if (!subjectData.radius && !subjectData.outerRadius) {
      subjectData.radius = 20;
    }

    var handles = [];
    var c = arcBuilder({ data: subjectData, className: "subject" });
    if (type.editMode) {
      var h = circleHandles({
        r1: c.data.outerRadius || c.data.radius,
        r2: c.data.innerRadius,
        padding: subjectData.radiusPadding
      });

      var updateRadius = function updateRadius(attr) {
        var r = subjectData[attr] + d3Selection.event.dx * Math.sqrt(2);
        subjectData[attr] = r;
        type.redrawSubject();
        type.redrawConnector();
      };

      var cHandles = [_extends({}, h.r1, { drag: updateRadius.bind(type, subjectData.outerRadius !== undefined ? 'outerRadius' : 'radius') })];

      if (subjectData.innerRadius) {
        cHandles.push(_extends({}, h.r2, { drag: updateRadius.bind(type, 'innerRadius') }));
      }
      handles = type.mapHandles(cHandles);
    }

    return { components: [c], handles: handles };
  });

var subjectRect = (function (_ref) {
    var subjectData = _ref.subjectData,
        type = _ref.type;

    if (!subjectData.width) {
      subjectData.width = 100;
    }
    if (!subjectData.height) {
      subjectData.height = 100;
    }

    var handles = [];
    var width = subjectData.width,
        height = subjectData.height;


    var data = [[0, 0], [width, 0], [width, height], [0, height], [0, 0]];
    var rect = lineBuilder({ data: data, className: 'subject' });

    if (type.editMode) {

      var updateWidth = function updateWidth(attr) {
        subjectData.width = d3Selection.event.x;
        type.redrawSubject();
        type.redrawConnector();
      };

      var updateHeight = function updateHeight() {
        subjectData.height = d3Selection.event.y;        type.redrawSubject();
        type.redrawConnector();
      };

      var rHandles = [{ x: width, y: height / 2, drag: updateWidth.bind(type) }, { x: width / 2, y: height, drag: updateHeight.bind(type) }];

      handles = type.mapHandles(rHandles);
    }

    return { components: [rect], handles: handles };
  });

var subjectThreshold = (function (_ref) {    var subjectData = _ref.subjectData,
        type = _ref.type;

    var offset = type.annotation.position;

    var x1 = (subjectData.x1 !== undefined ? subjectData.x1 : offset.x) - offset.x,
        x2 = (subjectData.x2 !== undefined ? subjectData.x2 : offset.x) - offset.x,
        y1 = (subjectData.y1 !== undefined ? subjectData.y1 : offset.y) - offset.y,
        y2 = (subjectData.y2 !== undefined ? subjectData.y2 : offset.y) - offset.y;

    var data = [[x1, y1], [x2, y2]];
    return { components: [lineBuilder({ data: data, className: 'subject' })] };
  });

var subjectBadge = (function (_ref) {
    var subjectData = _ref.subjectData,
        type = _ref.type;

    if (!subjectData.radius) subjectData.radius = 14;
    if (!subjectData.x) subjectData.x = "left";
    if (!subjectData.y) subjectData.y = "top";

    var handles = [];
    var radius = subjectData.radius;
    var innerRadius = radius * .7;
    var x = subjectData.x == "left" ? -radius : radius;
    var y = subjectData.y == "top" ? -radius : radius;
    var transform = 'translate(' + x + ', ' + y + ')';
    var circlebg = arcBuilder({ className: 'subject', data: { radius: radius } });
    circlebg.attrs.transform = transform;

    var circle = arcBuilder({ className: 'subject-ring', data: { outerRadius: radius, innerRadius: innerRadius } });
    circle.attrs.transform = transform;

    var pointer = lineBuilder({ className: 'subject-pointer',
      data: [[0, 0], [x, 0], [0, y], [0, 0]]
    });

    if (type.editMode) {

      var dragBadge = function dragBadge() {
        subjectData.x = d3Selection.event.x < 0 ? "left" : "right";
        subjectData.y = d3Selection.event.y < 0 ? "top" : "bottom";        type.redrawSubject();
      };

      var bHandles = [{ x: x * 2, y: y * 2, drag: dragBadge.bind(type) }];
      handles = type.mapHandles(bHandles);
    }

    var text = void 0;
    if (subjectData.text) {
      text = {
        type: "text",
        className: "badge-text",
        attrs: {
          text: subjectData.text,
          "text-anchor": "middle",
          dy: ".25em",
          x: x,
          y: y
        }
      };
    }
    return { components: [pointer, circlebg, circle, text], handles: handles };
  });

var Type = function () {
    function Type(_ref) {
      var a = _ref.a,
          annotation = _ref.annotation,
          editMode = _ref.editMode,
          dispatcher = _ref.dispatcher,
          notePadding = _ref.notePadding,
          accessors = _ref.accessors;
      classCallCheck(this, Type);

      this.a = a;

      this.note = annotation.disable.indexOf("note") === -1 && a.select('g.annotation-note');
      this.noteContent = this.note && a.select('g.annotation-note-content');
      this.connector = annotation.disable.indexOf("connector") === -1 && a.select('g.annotation-connector');
      this.subject = annotation.disable.indexOf("subject") === -1 && a.select('g.annotation-subject');

      if (dispatcher) {
        var handler = addHandlers.bind(null, dispatcher, annotation);
        handler({ component: this.note, name: 'note' });
        handler({ component: this.connector, name: 'connector' });
        handler({ component: this.subject, name: 'subject' });
      }

      this.annotation = annotation;
      this.editMode = annotation.editMode || editMode;
      this.notePadding = notePadding || 3;
      this.offsetCornerX = 0;
      this.offsetCornerY = 0;

      if (accessors && annotation.data) {
        this.init(accessors);
      }
    }

    createClass(Type, [{
      key: 'init',
      value: function init(accessors) {
        if (!this.annotation.x) {
          this.mapX(accessors);
        }
        if (!this.annotation.y) {
          this.mapY(accessors);
        }
      }
    }, {
      key: 'mapY',
      value: function mapY(accessors) {
        if (accessors.y) {
          this.annotation.y = accessors.y(this.annotation.data);
        }
      }
    }, {
      key: 'mapX',
      value: function mapX(accessors) {
        if (accessors.x) {
          this.annotation.x = accessors.x(this.annotation.data);
        }
      }
    }, {
      key: 'updateEditMode',
      value: function updateEditMode() {
        this.a.selectAll('circle.handle').remove();
      }
    }, {
      key: 'drawOnSVG',
      value: function drawOnSVG(component, builders) {
        var _this = this;

        if (!Array.isArray(builders)) {
          builders = [builders];
        }

        builders.filter(function (b) {
          return b;
        }).forEach(function (_ref2) {
          var type = _ref2.type,
              className = _ref2.className,
              attrs = _ref2.attrs,
              handles = _ref2.handles;

          if (type === "handle") {
            addHandles({ group: component, r: attrs && attrs.r, handles: handles });
          } else {
            (function () {
              newWithClass(component, [_this.annotation], type, className);

              var el = component.select(type + '.' + className);
              var attrKeys = Object.keys(attrs);
              attrKeys.forEach(function (attr) {
                if (attr === "text") {
                  el.text(attrs[attr]);
                } else {
                  el.attr(attr, attrs[attr]);
                }
              });
            })();
          }
        });
      }

      //TODO: how to extend this to a drawOnCanvas mode? 

    }, {
      key: 'getNoteBBox',
      value: function getNoteBBox() {
        return bboxWithoutHandles(this.note, '.annotation-note-content text');
      }
    }, {
      key: 'getNoteBBoxOffset',
      value: function getNoteBBoxOffset() {
        var bbox = bboxWithoutHandles(this.note, '.annotation-note-content');
        var transform = this.noteContent.attr('transform').split(/\(|\,|\)/g);
        bbox.offsetCornerX = parseFloat(transform[1]) + this.annotation.dx;
        bbox.offsetCornerY = parseFloat(transform[2]) + this.annotation.dy;
        bbox.offsetX = this.annotation.dx;
        bbox.offsetY = this.annotation.dy;
        return bbox;
      }

      // getConnectorBBox() { return bboxWithoutHandles(this.connector)}
      // getSubjectBBox() { return bboxWithoutHandles(this.subject)}
      // getAnnotationBBox() { return bboxWithoutHandles(this.a)}

    }, {
      key: 'drawSubject',
      value: function drawSubject() {
        var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var subjectData = this.annotation.subject;
        var type = context.type;
        var subjectParams = { type: this, subjectData: subjectData };

        var subject = {};
        if (type === "circle") subject = subjectCircle(subjectParams);else if (type === "rect") subject = subjectRect(subjectParams);else if (type === "threshold") subject = subjectThreshold(subjectParams);else if (type === "badge") subject = subjectBadge(subjectParams);

        var _subject = subject,
            _subject$components = _subject.components,
            components = _subject$components === undefined ? [] : _subject$components,
            _subject$handles = _subject.handles,
            handles = _subject$handles === undefined ? [] : _subject$handles;

        if (this.editMode) {
          handles = handles.concat(this.mapHandles([{ drag: this.dragSubject.bind(this) }]));
          components.push({ type: "handle", handles: handles });
        }

        return components;
      }
    }, {
      key: 'drawConnector',
      value: function drawConnector() {
        var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var connectorData = this.annotation.connector;
        var type = connectorData.type || context.type;
        var connectorParams = { type: this, connectorData: connectorData };
        connectorParams.subjectType = this.typeSettings && this.typeSettings.subject && this.typeSettings.subject.type;

        var connector = {};
        if (type === "curve") connector = connectorCurve(connectorParams);else if (type === "elbow") connector = connectorElbow(connectorParams);else connector = connectorLine(connectorParams);

        var _connector = connector,
            _connector$components = _connector.components,
            components = _connector$components === undefined ? [] : _connector$components,
            _connector$handles = _connector.handles,
            handles = _connector$handles === undefined ? [] : _connector$handles;

        var line = components[0];
        var endType = connectorData.end || context.end;
        var end = {};
        if (endType === "arrow") end = connectorArrow({ annotation: this.annotation, start: line.data[1], end: line.data[0] });else if (endType === "dot") end = connectorDot({ line: line });

        if (end.components) {
          components = components.concat(end.components);
        }

        if (this.editMode) {
          if (handles.length !== 0) components.push({ type: "handle", handles: handles });
        }
        return components;
      }
    }, {
      key: 'drawNote',
      value: function drawNote() {
        var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var noteData = this.annotation.note;
        var align = noteData.align || context.align || 'dynamic';
        var noteParams = { bbox: context.bbox, align: align, offset: this.annotation.offset };
        var lineType = noteData.lineType || context.lineType;
        var note = {};
        if (lineType == "vertical") note = noteVertical(noteParams);else if (lineType == "horizontal") note = noteHorizontal(noteParams);

        var _note = note,
            _note$components = _note.components,
            components = _note$components === undefined ? [] : _note$components,
            _note$handles = _note.handles,
            handles = _note$handles === undefined ? [] : _note$handles;

        if (this.editMode) {
          handles = this.mapHandles([{ x: 0, y: 0, drag: this.dragNote.bind(this) }]);
          components.push({ type: "handle", handles: handles });
        }
        return components;
      }
    }, {
      key: 'drawNoteContent',
      value: function drawNoteContent(context) {
        var noteData = this.annotation.note;
        var padding = noteData.padding || this.notePadding;
        var orientation = noteData.orientation || context.orientation || 'topBottom';
        var lineType = noteData.lineType || context.lineType;
        var align = noteData.align || context.align || 'dynamic';
        var subjectType = this.typeSettings && this.typeSettings.subject && this.typeSettings.subject.type;

        if (lineType == "vertical") orientation = "leftRight";else if (lineType == "horizontal") orientation = "topBottom";

        var noteParams = { padding: padding, bbox: context.bbox, offset: this.annotation.offset, orientation: orientation, align: align };

        var _noteAlignment = noteAlignment(noteParams),
            x = _noteAlignment.x,
            y = _noteAlignment.y;

        this.offsetCornerX = x + this.annotation.dx;
        this.offsetCornerY = y + this.annotation.dy;
        this.note && this.noteContent.attr('transform', 'translate(' + x + ', ' + y + ')');

        return [];
      }
    }, {
      key: 'drawOnScreen',
      value: function drawOnScreen(component, drawFunction) {
        return this.drawOnSVG(component, drawFunction);
      }
    }, {
      key: 'redrawSubject',
      value: function redrawSubject() {
        this.subject && this.drawOnScreen(this.subject, this.drawSubject());
      }
    }, {
      key: 'redrawConnector',
      value: function redrawConnector() {
        var bbox = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getNoteBBox();

        this.connector && this.drawOnScreen(this.connector, this.drawConnector());
      }
    }, {
      key: 'redrawNote',
      value: function redrawNote() {
        var bbox = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getNoteBBox();

        this.noteContent && this.drawOnScreen(this.noteContent, this.drawNoteContent({ bbox: bbox }));
        this.note && this.drawOnScreen(this.note, this.drawNote({ bbox: bbox }));
      }
    }, {
      key: 'setPosition',
      value: function setPosition() {
        var position = this.annotation.position;
        this.a.attr('transform', 'translate(' + position.x + ', ' + position.y + ')');
      }
    }, {
      key: 'setOffset',
      value: function setOffset() {
        if (this.note) {
          var offset = this.annotation.offset;
          this.note.attr('transform', 'translate(' + offset.x + ', ' + offset.y + ')');
        }
      }
    }, {
      key: 'setPositionWithAccessors',
      value: function setPositionWithAccessors(accessors) {
        if (accessors && this.annotation.data) {
          this.mapX(accessors);
          this.mapY(accessors);
        }
        this.setPosition();
      }
    }, {
      key: 'setClassName',
      value: function setClassName() {
        this.a.attr("class", 'annotation ' + (this.className && this.className()) + ' ' + (this.editMode ? "editable" : "") + ' ' + (this.annotation.className || ''));
      }
    }, {
      key: 'draw',
      value: function draw() {
        this.setClassName();
        this.setPosition();
        this.setOffset();
        this.redrawSubject();
        this.redrawConnector();
        this.redrawNote();
      }
    }, {
      key: 'dragstarted',
      value: function dragstarted() {
        d3Selection.event.sourceEvent.stopPropagation();
        this.a.classed("dragging", true);
        this.a.selectAll("circle.handle").style("pointer-events", "none");
      }
    }, {
      key: 'dragended',
      value: function dragended() {
        this.a.classed("dragging", false);
        this.a.selectAll("circle.handle").style("pointer-events", "all");
      }
    }, {
      key: 'dragSubject',
      value: function dragSubject() {
        var position = this.annotation.position;
        position.x += d3Selection.event.dx;
        position.y += d3Selection.event.dy;
        this.annotation.position = position;
      }
    }, {
      key: 'dragNote',
      value: function dragNote() {
        var offset = this.annotation.offset;
        offset.x += d3Selection.event.dx;
        offset.y += d3Selection.event.dy;
        this.annotation.offset = offset;
      }
    }, {
      key: 'mapHandles',
      value: function mapHandles(handles) {
        var _this2 = this;

        return handles.map(function (h) {
          return _extends({}, h, {
            start: _this2.dragstarted.bind(_this2), end: _this2.dragended.bind(_this2) });
        });
      }
    }]);
    return Type;
  }();

  var customType = function customType(initialType, typeSettings, _init) {
    return function (_initialType) {
      inherits(customType, _initialType);

      function customType(settings) {
        classCallCheck(this, customType);

        var _this3 = possibleConstructorReturn(this, (customType.__proto__ || Object.getPrototypeOf(customType)).call(this, settings));

        _this3.typeSettings = typeSettings;

        if (typeSettings.disable) {
          typeSettings.disable.forEach(function (d) {
            _this3[d] = undefined;
            if (d == "note") {
              _this3.noteContent = undefined;
            }
          });
        }
        return _this3;
      }

      createClass(customType, [{
        key: 'className',
        value: function className() {
          return (typeSettings.className || '') + ' ' + (get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), 'className', this) && get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), 'className', this).call(this) || '');
        }
      }, {
        key: 'drawSubject',
        value: function drawSubject(context) {
          this.typeSettings.subject = Object.assign({}, typeSettings.subject, this.typeSettings.subject);
          return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), 'drawSubject', this).call(this, _extends({}, context, this.typeSettings.subject));
        }
      }, {
        key: 'drawConnector',
        value: function drawConnector(context, subjectContext) {
          this.typeSettings.connector = Object.assign({}, typeSettings.connector, this.typeSettings.connector);
          return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), 'drawConnector', this).call(this, _extends({}, context, typeSettings.connector, this.typeSettings.connector));
        }
      }, {
        key: 'drawNote',
        value: function drawNote(context) {
          this.typeSettings.note = Object.assign({}, typeSettings.note, this.typeSettings.note);
          return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), 'drawNote', this).call(this, _extends({}, context, typeSettings.note, this.typeSettings.note));
        }
      }, {
        key: 'drawNoteContent',
        value: function drawNoteContent(context) {
          return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), 'drawNoteContent', this).call(this, _extends({}, context, typeSettings.note, this.typeSettings.note));
        }
      }], [{
        key: 'init',
        value: function init(annotation, accessors) {
          get(customType.__proto__ || Object.getPrototypeOf(customType), 'init', this).call(this, annotation, accessors);
          if (_init) {
            annotation = _init(annotation, accessors);
          }
          return annotation;
        }
      }]);
      return customType;
    }(initialType);
  };

  var d3NoteText = function (_Type) {
    inherits(d3NoteText, _Type);

    function d3NoteText(params) {
      classCallCheck(this, d3NoteText);

      var _this4 = possibleConstructorReturn(this, (d3NoteText.__proto__ || Object.getPrototypeOf(d3NoteText)).call(this, params));

      console.log('in constructor for note text', params, _this4.typeSettings);
      _this4.textWrap = params.textWrap || 120;
      _this4.drawText();
      return _this4;
    }

    createClass(d3NoteText, [{
      key: 'updateTextWrap',
      value: function updateTextWrap(textWrap) {
        this.textWrap = textWrap;
        this.drawText();
      }

      //TODO: add update text functionality

    }, {
      key: 'drawText',
      value: function drawText() {
        if (this.note) {

          newWithClass(this.note, [this.annotation], 'g', 'annotation-note-content');

          var noteContent = this.note.select('g.annotation-note-content');
          newWithClass(noteContent, [this.annotation], 'rect', 'annotation-note-bg');
          newWithClass(noteContent, [this.annotation], 'text', 'annotation-note-label');
          newWithClass(noteContent, [this.annotation], 'text', 'annotation-note-title');

          var titleBBox = { height: 0 };
          var label = this.a.select('text.annotation-note-label');
          console.log('in wrap length', this.typeSettings);
          var wrapLength = this.annotation.note && this.annotation.note.wrap || this.typeSettings && this.typeSettings.note && this.typeSettings.note.wrap || this.textWrap;

          if (this.annotation.note.title) {
            var title = this.a.select('text.annotation-note-title');
            title.text(this.annotation.note.title).attr('dy', '1.1em');
            title.call(wrap, wrapLength);
            titleBBox = title.node().getBBox();
          }

          label.text(this.annotation.note.label).attr('dy', '1em');
          label.call(wrap, wrapLength);

          label.attr('y', titleBBox.height * 1.1 || 0);

          var bbox = this.getNoteBBox();
          this.a.select('rect.annotation-note-bg').attr('width', bbox.width).attr('height', bbox.height);
        }
      }
    }]);
    return d3NoteText;
  }(Type);

  var d3Label = customType(d3NoteText, {
    className: "label",
    note: { align: "middle" }
  });

  var d3Callout = customType(d3NoteText, {
    className: "callout",
    note: { lineType: "horizontal" }
  });

  var d3CalloutElbow = customType(d3Callout, {
    className: "callout elbow",
    connector: { type: "elbow" }
  });

  var d3CalloutCurve = customType(d3Callout, {
    className: "callout curve",
    connector: { type: "curve" }
  });

  var d3Badge = customType(Type, {
    className: "badge",
    subject: { type: "badge" },
    disable: ['connector', 'note']
  });

  var d3CalloutCircle = customType(d3CalloutElbow, {
    className: "callout circle",
    subject: { type: "circle" }
  });

  var d3CalloutRect = customType(d3CalloutElbow, {
    className: "callout rect",
    subject: { type: "rect" }
  });

  var ThresholdMap = function (_d3Callout) {
    inherits(ThresholdMap, _d3Callout);

    function ThresholdMap() {
      classCallCheck(this, ThresholdMap);
      return possibleConstructorReturn(this, (ThresholdMap.__proto__ || Object.getPrototypeOf(ThresholdMap)).apply(this, arguments));
    }

    createClass(ThresholdMap, [{
      key: 'mapY',
      value: function mapY(accessors) {
        get(ThresholdMap.prototype.__proto__ || Object.getPrototypeOf(ThresholdMap.prototype), 'mapY', this).call(this, accessors);
        var a = this.annotation;
        if ((a.subject.x1 || a.subject.x2) && a.data && accessors.y) {
          a.y = accessors.y(a.data);
        }
      }
    }, {
      key: 'mapX',
      value: function mapX(accessors) {
        get(ThresholdMap.prototype.__proto__ || Object.getPrototypeOf(ThresholdMap.prototype), 'mapX', this).call(this, accessors);
        var a = this.annotation;
        if ((a.subject.y1 || a.subject.y2) && a.data && accessors.x) {
          a.x = accessors.x(a.data);
        }
      }
    }]);
    return ThresholdMap;
  }(d3Callout);

  var d3XYThreshold = customType(ThresholdMap, {
    className: "callout xythreshold",
    subject: { type: "threshold" }
  });

  var newWithClass = function newWithClass(a, d, type, className) {
    var group = a.selectAll(type + '.' + className).data(d);
    group.enter().append(type).merge(group).attr('class', className);

    group.exit().remove();
    return a;
  };

  var addHandlers = function addHandlers(dispatcher, annotation, _ref3) {
    var component = _ref3.component,
        name = _ref3.name;

    if (component) {
      component.on("mouseover.annotations", function () {
        dispatcher.call(name + 'over', component, annotation);
      }).on("mouseout.annotations", function () {
        return dispatcher.call(name + 'out', component, annotation);
      }).on("click.annotations", function () {
        return dispatcher.call(name + 'click', component, annotation);
      });
    }
  };

  //Text wrapping code adapted from Mike Bostock
  var wrap = function wrap(text, width) {
    text.each(function () {
      var text = d3Selection.select(this),
          words = text.text().split(/[ \t\r\n]+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = .2,
          //ems
      y = text.attr("y"),
          dy = parseFloat(text.attr("dy")) || 0,
          tspan = text.text(null).append("tspan").attr("x", 0).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width && line.length > 1) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("dy", lineHeight + dy + "em").text(word);
        }
      }
    });
  };

  var bboxWithoutHandles = function bboxWithoutHandles(selection) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ':not(.handle)';

    if (!selection) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    return selection.selectAll(selector).nodes().reduce(function (p, c) {
      var bbox = c.getBBox();
      p.x = Math.min(p.x, bbox.x);
      p.y = Math.min(p.y, bbox.y);
      p.width = Math.max(p.width, bbox.width);
      p.height += bbox.height;
      return p;
    }, { x: 0, y: 0, width: 0, height: 0 });
  };

function annotation() {
    var annotations = [],
        collection = void 0,
        context = void 0,
        //TODO: add canvas functionality
    disable = [],
        accessors = {},
        accessorsInverse = {},
        editMode = false,
        ids = void 0,
        type = d3Callout,
        textWrap = void 0,
        notePadding = void 0,
        annotationDispatcher = d3Dispatch.dispatch("subjectover", "subjectout", "subjectclick", "connectorover", "connectorout", "connectorclick", "noteover", "noteout", "noteclick"),
        sel = void 0;

    var annotation = function annotation(selection) {
      sel = selection;
      //TODO: check to see if this is still needed    
      if (!editMode) {
        selection.selectAll("circle.handle").remove();
      }

      var translatedAnnotations = annotations.map(function (a) {
        if (!a.type) {
          a.type = type;
        }
        if (!a.disable) {
          a.disable = disable;
        }
        return new Annotation(a);
      });

      collection = new AnnotationCollection({
        annotations: translatedAnnotations,
        accessors: accessors,
        accessorsInverse: accessorsInverse,
        ids: ids
      });

      var annotationG = selection.selectAll('g').data([collection]);
      annotationG.enter().append('g').attr('class', 'annotations');

      var group = selection.select('g.annotations');
      newWithClass(group, collection.annotations, 'g', 'annotation');

      var annotation = group.selectAll('g.annotation');

      annotation.each(function (d) {
        var a = d3Selection.select(this);        var position = d.position;

        a.attr('class', 'annotation');

        newWithClass(a, [d], 'g', 'annotation-connector');
        newWithClass(a, [d], 'g', 'annotation-subject');
        newWithClass(a, [d], 'g', 'annotation-note');
        newWithClass(a.select('g.annotation-note'), [d], 'g', 'annotation-note-content');

        d.type = new d.type({ a: a, annotation: d, textWrap: textWrap, notePadding: notePadding, editMode: editMode,
          dispatcher: annotationDispatcher, accessors: accessors });
        d.type.draw();
      });
    };

    annotation.json = function () {
      console.log('Annotations JSON was copied to your clipboard. Please note the annotation type is not JSON compatible. It appears in the objects array in the console, but not in the copied JSON.', collection.json);
      window.copy(JSON.stringify(collection.json.map(function (a) {
        delete a.type;return a;
      })));
      return annotation;
    };

    annotation.update = function () {
      if (annotations && collection) {
        annotations = collection.annotations.map(function (a, i) {
          a.type.draw();return a;
        });
      }
      return annotation;
    };

    annotation.updatedAccessors = function () {
      collection.setPositionWithAccessors();
      annotations = collection.annotations;
      return annotation;
    };

    annotation.disable = function (_) {
      if (!arguments.length) return disable;
      disable = _;
      if (collection) {
        collection.updateDisable(disable);
        annotations = collection.annotations;
      }
      return annotation;
    };

    annotation.textWrap = function (_) {
      if (!arguments.length) return textWrap;
      textWrap = _;
      if (collection) {
        collection.updateTextWrap(textWrap);
        annotations = collection.annotations;
      }
      return annotation;
    };

    annotation.notePadding = function (_) {
      if (!arguments.length) return notePadding;
      notePadding = _;
      if (collection) {
        collection.updateNotePadding(notePadding);
        annotations = collection.annotations;
      }
      return annotation;
    };

    annotation.type = function (_, settings) {
      if (!arguments.length) return type;
      type = _;
      if (collection) {
        collection.annotations.map(function (a) {

          a.type.note && a.type.note.selectAll("*:not(.annotation-note-content)").remove();
          a.type.noteContent && a.type.noteContent.selectAll("*").remove();
          a.type.subject && a.type.subject.selectAll("*").remove();
          a.type.connector && a.type.connector.selectAll("*").remove();
          a.type.typeSettings = {};
          a.type = type;

          a.subject = settings && settings.subject || a.subject;
          a.connector = settings && settings.connector || a.connector;
          a.note = settings && settings.note || a.note;
        });

        annotations = collection.annotations;
      }
      return annotation;
    };

    annotation.annotations = function (_) {
      if (!arguments.length) return collection && collection.annotations || annotations;
      annotations = _;
      return annotation;
    };

    annotation.context = function (_) {
      if (!arguments.length) return context;
      context = _;
      return annotation;
    };

    annotation.accessors = function (_) {
      if (!arguments.length) return accessors;
      accessors = _;
      return annotation;
    };

    annotation.accessorsInverse = function (_) {
      if (!arguments.length) return accessorsInverse;
      accessorsInverse = _;
      return annotation;
    };

    annotation.ids = function (_) {
      if (!arguments.length) return ids;
      ids = _;
      return annotation;
    };

    annotation.editMode = function (_) {
      if (!arguments.length) return editMode;
      editMode = _;

      if (sel) {
        sel.selectAll('g.annotation').classed('editable', editMode);
      }

      if (collection) {
        collection.editMode(editMode);
        annotations = collection.annotations;
      }
      return annotation;
    };

    annotation.collection = function (_) {
      if (!arguments.length) return collection;
      collection = _;
      return annotation;
    };

    annotation.on = function () {
      var value = annotationDispatcher.on.apply(annotationDispatcher, arguments);
      return value === annotationDispatcher ? annotation : value;
    };

    return annotation;
  };

var index = {    annotation: annotation,
    annotationTypeBase: Type,
    annotationLabel: d3Label,
    annotationCallout: d3Callout,
    annotationCalloutCurve: d3CalloutCurve,
    annotationCalloutElbow: d3CalloutElbow,
    annotationCalloutCircle: d3CalloutCircle,
    annotationCalloutRect: d3CalloutRect,
    annotationXYThreshold: d3XYThreshold,
    annotationBadge: d3Badge,
    annotationCustomType: customType
  };

export { annotation, Type as annotationTypeBase, d3Label as annotationLabel, d3Callout as annotationCallout, d3CalloutCurve as annotationCalloutCurve, d3CalloutElbow as annotationCalloutElbow, d3CalloutCircle as annotationCalloutCircle, d3CalloutRect as annotationCalloutRect, d3XYThreshold as annotationXYThreshold, d3Badge as annotationBadge, customType as annotationCustomType };export default index;
//# sourceMappingURL=indexRollup.mjs.map