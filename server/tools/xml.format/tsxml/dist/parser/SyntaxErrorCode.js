"use strict";

(function (SyntaxErrorCode) {
    SyntaxErrorCode[SyntaxErrorCode["Unknown"] = 0] = "Unknown";
    SyntaxErrorCode[SyntaxErrorCode["UnexpectedToken"] = 1] = "UnexpectedToken";
    SyntaxErrorCode[SyntaxErrorCode["MissingTagNameAfterNamespacePrefix"] = 2] = "MissingTagNameAfterNamespacePrefix";
    SyntaxErrorCode[SyntaxErrorCode["MissingAttrNameAfterAttrPrefix"] = 3] = "MissingAttrNameAfterAttrPrefix";
    SyntaxErrorCode[SyntaxErrorCode["IllegalNamespacePrefix"] = 4] = "IllegalNamespacePrefix";
    SyntaxErrorCode[SyntaxErrorCode["IllegalSelfClose"] = 5] = "IllegalSelfClose";
    SyntaxErrorCode[SyntaxErrorCode["ExcessCloseTag"] = 6] = "ExcessCloseTag";
    SyntaxErrorCode[SyntaxErrorCode["InvalidTagName"] = 7] = "InvalidTagName";
})(exports.SyntaxErrorCode || (exports.SyntaxErrorCode = {}));
var SyntaxErrorCode = exports.SyntaxErrorCode;