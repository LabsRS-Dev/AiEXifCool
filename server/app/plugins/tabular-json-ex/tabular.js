/* jshint undef:true, unused:false, eqnull:true, forin:false, freeze:true, -W004,
bitwise:true, noarg:true, sub:true, node:true,esnext:true, funcscope:true,
notypeof:true
*/

(function () {
  "use strict";

  function columnize(data, headers, dot) {
    function recurse(val, path, hdr) {
      if (val instanceof Object && Object.keys(val).length === 0){
          insert(null, path, hdr);
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
  function rowify(columns) {
    var result = [];
    var hash = {};
    var found = {};

    for (var thisHdr in columns) {
      for (var thisPath in columns[thisHdr]) {
        if (found.hasOwnProperty(thisPath)) {break;}
        found[thisPath] = {};
        var thisValue = columns[thisHdr][thisPath];
        var row = [];
        var exclude = false;
        for (var anHdr in columns) {
          if (thisHdr === anHdr) {
            row.push(thisValue);
          } else if (columns[anHdr].hasOwnProperty(thisPath)) {
            row.push(columns[anHdr][thisPath]);
          } else {
            var matched = null;
            for (var aPath in columns[anHdr]) {
              var aValue = columns[anHdr][aPath];
              var min = Math.min(thisPath.length, aPath.length);
              if (thisPath.substr(0, min) === aPath.substr(0, min)) {
                if (thisPath.length < aPath.length) {
                  exclude = true;
                  break;
                }
                matched = aValue;
                break;
              }
            }
            if (exclude) {break;}
            row.push(matched);
          }
        }
        if (!hash.hasOwnProperty(row) & !exclude) {
          hash[row] = true;
          result.push(row);
        }
      }
    }

    return result;

  }

  var tabulate = {
    delimit: function(data, options) {
      function escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      }

      options = typeof options !== 'undefined' ? options : {};
      var separator = typeof options.separator !== 'undefined' ? options.separator : ',';
      var stringWrap = typeof options.stringWrap !== 'undefined' ? options.stringWrap : '"';
      var eol = typeof options.eol !== 'undefined' ? options.eol : '\n';
      var dateFormatter = typeof options.dateFormatter !== 'undefined' ? options.dateFormatter : function(date) {return date.toLocaleDateString();};
      var rows = this.array(data, options);
      var escape = typeof options.escape === 'function' ? options.escape : function(string, wrap) {
        return string.replace(new RegExp(escapeRegExp(wrap), 'g'), ((typeof options.escape === 'string') ? options.escape : wrap)+wrap);
      };

      var string = rows.map(function(n) {
        return n.map(function(v) {
          if (typeof v === 'string') {return stringWrap+escape(v, stringWrap).replace(/[\n\r]+/g, ' ')+stringWrap;}
          if (v instanceof Date) {return dateFormatter(v);}
          return v;
        }).join(separator);
      }).join(eol)+eol;

      return string;
    },
    flatten: function(data, options) {
      options = typeof options !== 'undefined' ? options : {};
      options.includeHeaders = true;
      var array = this.array(data, options);
      if (array.length < 2) {return [];}
      var headers = array.shift();

      return array.map(function(row) {
        return headers.reduce(function(obj, hdr, i) {
          obj[hdr] = row[i];
          return obj;
        }, {});
      });

    },
    array: function(data, options) {
      if (!data || Object.keys(data).length === 0) {return [];}
      data = data instanceof Array ? data : [data];
      options = typeof options !== 'undefined' ? options : {};
      var headers = options.headers;
      var sort = typeof options.sort !== 'undefined' ? options.sort : [];
      sort = sort instanceof Array ? sort : [sort];
      var includeHeaders = typeof options.includeHeaders !== 'undefined' ? options.includeHeaders : true;
      var dot = typeof options.dot !== 'undefined' ? options.dot : '.';

      var columns = columnize(data, headers, dot);
      var rows = rowify(columns);

      headers = typeof headers !== 'undefined' ? headers : Object.keys(columns);

      if (sort) {
        rows.sort(function(a, b) {
          for (var i=0; i<sort.length; i++) {
            var s;
            var direction;
            if (/^-/.test(sort[i])) {
              direction = 'desc';
              s = sort[i].substr(1);
            } else {
              direction = 'asc';
              s = sort[i];
            }

            var index = headers.indexOf(s);
            if (index !== -1) {
              if (direction === 'asc' && a[index] < b[index]) {return -1;}
              if (direction === 'asc' && a[index] > b[index]) {return 1;}
              if (direction === 'desc' && a[index] > b[index]) {return -1;}
              if (direction === 'desc' && a[index] < b[index]) {return 1;}
            }
          }
          return 0;
        });
      }

      if (includeHeaders === true) {
        rows.unshift(headers);
      }

      return rows;
    },
    html: function(data, options) {

      function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      options = typeof options !== 'undefined' ? options : {};
      var includeHeaders = typeof options.includeHeaders !== 'undefined' ? options.includeHeaders : true;
      var dateFormatter = typeof options.dateFormatter !== 'undefined' ? options.dateFormatter : function(date) {return date.toLocaleDateString();};
      var classes = typeof options.classes !== 'undefined' ? options.classes : {};
      var eol = typeof options.eol !== 'undefined' ? options.eol : '\n';
      var separator = typeof options.separator !== 'undefined' ? options.separator : '\t';
      var array = this.array(data, options);
      var escapeInnerHTML = typeof options.escapeInnerHTML !== 'undefined' ? options.escapeInnerHTML : true;
      var convertLinks = typeof options.convertLinks !== 'undefined' ? options.convertLinks : false;

      if (array.length < 2) {return '';}

      var result = '';
      result += '<table'+(typeof classes.table !== 'undefined' ? ' class="'+htmlEntities(classes.table)+'"' : '')+'>' + eol;
      if (includeHeaders) {
        result += separator+'<thead'+(typeof classes.thead !== 'undefined' ? ' class="'+htmlEntities(classes.thead)+'"' : '')+'>' + eol;
        result += separator+separator+'<tr'+(typeof classes.tr !== 'undefined' ? ' class="'+htmlEntities(classes.tr)+'"' : '')+'>' + eol;
        for (var i=0; i<array[0].length; i++) {
          result += separator+separator+separator+'<th'+(typeof classes.th !== 'undefined' ? ' class="'+htmlEntities(classes.th)+'"' : '')+'>';
          result += !escapeInnerHTML ? array[0][i] : htmlEntities(array[0][i]);
          result += '</th>' + eol;
        }
        result += separator+separator+'</tr>' + eol;
        result += separator+'</thead>' + eol;
      }
      result += separator+'<tbody'+(typeof classes.tbody !== 'undefined' ? ' class="'+htmlEntities(classes.tbody)+'"' : '')+'>' + eol;
      for (var row=1; row<array.length; row++) {
        result += separator+separator+'<tr'+(typeof classes.tr !== 'undefined' ? ' class="'+htmlEntities(classes.tr)+'"' : '')+'>' + eol;
        for (var col=0; col<array[row].length; col++) {
          result += separator+separator+separator+'<td'+(typeof classes.td !== 'undefined' ? ' class="'+htmlEntities(classes.td)+'"' : '')+'>';
          if (array[row][col] instanceof Date) {
            result += dateFormatter(array[row][col]);
          } else if (typeof array[row][col] === 'string') {
            if (convertLinks && /^(?:http|https):\/\/\S*$/.test(array[row][col])) {
              result += '<a href="'+htmlEntities(array[row][col])+'">'+htmlEntities(array[row][col])+'</a>';
            } else {
              result += !escapeInnerHTML ? array[row][col] : htmlEntities(array[row][col]);
            }
          } else if (array[row][col] !== null) {
            result += array[row][col];
          }
          result += '</td>' + eol;
        }
        result += separator+separator+'</tr>' + eol;
      }
      result += separator+'</tbody>' + eol;

      result += '</table>' + eol;
      return result;
    }
  };

  module.exports = tabulate;
})();
