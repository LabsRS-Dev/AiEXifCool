"use strict";
/**
 * Flags applied to nodes during parsing.
 * Bitmask.
 */

(function (NodeFlags) {
    NodeFlags[NodeFlags["None"] = 0] = "None";
    NodeFlags[NodeFlags["Opened"] = 1] = "Opened";
    NodeFlags[NodeFlags["Closed"] = 2] = "Closed";
    NodeFlags[NodeFlags["SelfClosing"] = 7] = "SelfClosing";
    NodeFlags[NodeFlags["Void"] = 15] = "Void";
})(exports.NodeFlags || (exports.NodeFlags = {}));
var NodeFlags = exports.NodeFlags;