/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

var table = require('tableize-array');
var debug = require('debug')('json2csv');
var debugMiss = require('debug')('json2csv:missing');
var through = require('through');
var getlens = require('dot-lens').get;

function lensVal(lens, obj, field) {
  try {
    var val = lens(obj);
    if (val == null) return "";
    return val;
  }
  catch (e) {
    debugMiss("missing field '%s' in %j", field, obj);
    return "";
  }
}

function withFields(fields) {
  debug("using withFields");
  var first = true;
  var d = {};
  var items = [];
  var lenses = fields.map(getlens);

  return through(write);

  function write(obj) {
    if (first === true) {
      first = false;
      this.push(fields);
    }
    this.push(lenses.map(function(lens){
      return lensVal(lens, obj);
    }));
  }
}


function withoutFields() {
  debug("using withoutFields");
  var fields = {};
  var items = [];
  return through(write, end);

  function write(item) {
    exports.keys(item).forEach(function(key){
        fields[key] = 1;
    });
    items.push(item);
  }

  function end() {
    var self = this;
    fields = Object.keys(fields);
    debug("withoutFields fields: %j", fields);
    var lenses = fields.map(getlens);
    this.push(fields);
    items.forEach(function(item){
      self.push(lenses.map(function(lens, i){
        return lensVal(lens, item, fields[i]);
      }));
    });
    this.push(null);
  }
}

function isComplexJSONData(jsonData){
    var isComplex = false;

    // 检测方式1
    exports.keys(jsonData).forEach(function(key){
        //var newKey = key.replace(/\.[0-9]{1,}\./g, ".");
        var result = key.match(/\.[0-9]{1,}\./g);
        if(result && result.length > 1){
            isComplex = true;
        }
    });

    // 检测方式2
    function columnize(data, headers, dot) {
      function recurse(val, path, hdr) {
        if (val instanceof Object && Object.keys(val).length === 0){
            isComplex = true;
        } else if (Object(val) !== val || val instanceof Date) {
          insert(val, path, hdr);
        } else if (val instanceof Array) {
          if (val.length === 0) {
            insert(null, path, hdr);
          } else {
            for (var i=0; i<val.length; i++) {
              recurse(val[i], path + '['+i+']', hdr);
            }
          }
        } else {
          for (var v in val) {
            recurse(val[v], path ? path + dot + v : v, hdr ? hdr + dot + v : v);
          }
        }
      }

      function insert(value, path, hdr) {
        var regex = /.*\[[0-9]+\]/;
        if (!allHeaders && typeof result[hdr] === 'undefined') {
          return;
        } else if (allHeaders && typeof result[hdr] === 'undefined') {
          result[hdr] = {};
        }
        result[hdr][regex.exec(path)[0]] = value;
      }
      var result = {};
      var allHeaders = true;
      if (typeof headers !== 'undefined') {
        allHeaders = false;
        for (var i=0; i<headers.length; i++) {
          result[headers[i]] = {};
        }
      }
      recurse(data, "", "");

      return result;
    }

    if(!isComplex){
        columnize(jsonData, "", '.');
    }

    return isComplex;
}

var exports = module.exports = function(fields) {
  if (fields == null || fields.length === 0)
    return withoutFields();
  else
    return withFields(fields);
};

exports.isComplexJSONData = function(jsonData){
    return isComplexJSONData(jsonData);
};

exports.keys = function(obj) {
  return Object.keys(table(obj));
};

exports.fields = function() {
  var fields = {};
  return through(write, end);

  function write(item) {
    var t = table(item);
    for (var key in t) fields[key] = 1;
  }

  function end() {
    var self = this;
    Object.keys(fields).forEach(function(field){
      self.push(field);
    });
    this.push(null);
  }
};
