"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParameterObject;
(function (ParameterObject) {
    let IN;
    (function (IN) {
        IN["Path"] = "path";
        IN["Query"] = "query";
        IN["Header"] = "header";
        IN["Cookie"] = "cookie";
        IN["FormData"] = "formData";
    })(IN = ParameterObject.IN || (ParameterObject.IN = {}));
})(ParameterObject = exports.ParameterObject || (exports.ParameterObject = {}));
var SecuritySchemeObject;
(function (SecuritySchemeObject) {
    let Type;
    (function (Type) {
        Type["apiKey"] = "apiKey";
        Type["http"] = "http";
        Type["oauth2"] = "oauth2";
        Type["openIdConnect"] = "openIdConnect";
    })(Type = SecuritySchemeObject.Type || (SecuritySchemeObject.Type = {}));
    let IN;
    (function (IN) {
        IN["Query"] = "query";
        IN["Header"] = "header";
        IN["Cookie"] = "cookie";
    })(IN = SecuritySchemeObject.IN || (SecuritySchemeObject.IN = {}));
})(SecuritySchemeObject = exports.SecuritySchemeObject || (exports.SecuritySchemeObject = {}));
var openapi;
(function (openapi) {
    openapi["V3"] = "3.0.0";
})(openapi = exports.openapi || (exports.openapi = {}));
