"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GenerateSchema = require('generate-schema');
var Util;
(function (Util) {
    function toValidJSON(input) {
        var UNESCAPE_MAP = { '\\"': '"', "\\`": "`", "\\'": "'" };
        var ML_ESCAPE_MAP = { '\n': '\\n', "\r": '\\r', "\t": '\\t', '"': '\\"' };
        function unescapeQuotes(r) { return UNESCAPE_MAP[r] || r; }
        return input.replace(/`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\/\*[^]*?\*\/|\/\/.*\n?/g, // pass 1: remove comments
        function (s) {
            if (s.charAt(0) == '/')
                return '';
            else
                return s;
        })
            .replace(/(?:true|false|null)(?=[^\w_$]|$)|([a-zA-Z_$][\w_$]*)|`((?:\\.|[^`])*)`|'((?:\\.|[^'])*)'|"(?:\\.|[^"])*"|(,)(?=\s*[}\]])/g, // pass 2: requote
        function (s, identifier, multilineQuote, singleQuote, lonelyComma) {
            if (lonelyComma)
                return '';
            else if (identifier != null)
                return '"' + identifier + '"';
            else if (multilineQuote != null)
                return '"' + multilineQuote.replace(/\\./g, unescapeQuotes).replace(/[\n\r\t"]/g, function (r) { return ML_ESCAPE_MAP[r]; }) + '"';
            else if (singleQuote != null)
                return '"' + singleQuote.replace(/\\./g, unescapeQuotes).replace(/"/g, '\\"') + '"';
            else
                return s;
        });
    }
    Util.toValidJSON = toValidJSON;
    function generateSchema(input) {
        let schema = GenerateSchema.json(input);
        delete schema["$schema"];
        return schema;
    }
    Util.generateSchema = generateSchema;
    function buildWildCardRegex(wildCardString) {
        return new RegExp(`^${wildCardString.split("*").join(".*")}`);
    }
    Util.buildWildCardRegex = buildWildCardRegex;
})(Util = exports.Util || (exports.Util = {}));
