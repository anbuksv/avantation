const GenerateSchema: any = require('generate-schema');
export namespace Util {
    export function toValidJSON(input: any) {
        var UNESCAPE_MAP: any = { '\\"': '"', '\\`': '`', "\\'": "'" };
        var ML_ESCAPE_MAP: any = { '\n': '\\n', '\r': '\\r', '\t': '\\t', '"': '\\"' };
        function unescapeQuotes(r: any) {
            return UNESCAPE_MAP[r] || r;
        }

        return input
            .replace(
                /`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\/\*[^]*?\*\/|\/\/.*\n?/g, // pass 1: remove comments
                function(s: any) {
                    if (s.charAt(0) == '/') return '';
                    else return s;
                }
            )
            .replace(
                /(?:true|false|null)(?=[^\w_$]|$)|([a-zA-Z_$][\w_$]*)|`((?:\\.|[^`])*)`|'((?:\\.|[^'])*)'|"(?:\\.|[^"])*"|(,)(?=\s*[}\]])/g, // pass 2: requote
                function(s: any, identifier: any, multilineQuote: any, singleQuote: any, lonelyComma: any) {
                    if (lonelyComma) return '';
                    else if (identifier != null) return '"' + identifier + '"';
                    else if (multilineQuote != null)
                        return (
                            '"' +
                            multilineQuote.replace(/\\./g, unescapeQuotes).replace(/[\n\r\t"]/g, function(r: any) {
                                return ML_ESCAPE_MAP[r];
                            }) +
                            '"'
                        );
                    else if (singleQuote != null)
                        return '"' + singleQuote.replace(/\\./g, unescapeQuotes).replace(/"/g, '\\"') + '"';
                    else return s;
                }
            );
    }

    export function generateSchema(input: any): any {
        let schema = GenerateSchema.json(input);
        delete schema['$schema'];
        return schema;
    }

    export function arrayMaxDepth(input: any, depthLimit: number | undefined) {
        input != null &&
            Object.keys(input).forEach(function(key: any) {
                if (input[key] instanceof Array) {
                    input[key] = input[key].slice(0, depthLimit || 3);
                    return;
                }

                if (typeof input[key] == 'object' && input[key] !== null) {
                    arrayMaxDepth(input[key], depthLimit);
                }
            });
    }

    export function buildWildCardRegex(wildCardString: string): RegExp {
        return new RegExp(`^${wildCardString.split('*').join('.*')}`);
    }
}
