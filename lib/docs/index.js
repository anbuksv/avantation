"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../apis/logger");
exports.SHORT_DESCRIPTION = "Designed for programmers to generate documentation for large scal applications.";
exports.HAR = {
    long: "har",
    required: true,
    description: {
        short: "har file path",
        long: `\tThe HTTP Archive format(HAR), is JSON formatted archive file format for logging of a web browswer's intraction with site.
        To generate the HAR file for your existion application use Chrome,Firefox,Safari,Internet Explorer,Edge.
        To generate the HAR file for new projects use Insomania REST Clint Desktop application.`
    }
};
exports.HOST = {
    short: "h",
    long: "host",
    required: true,
    description: {
        short: "Host Name"
    }
};
exports.BASE_PATH = {
    short: "b",
    long: "base-path",
    required: true,
    description: {
        short: "API host base path. Example:['api/v1']",
        long: "\tBase path of the end point"
    }
};
exports.PATH_REGEX = {
    short: "r",
    long: "path-param-regex",
    required: false,
    description: {
        short: "Convert Regex matching params into dynamic path ",
        long: `\tIn request URL regex matching path parameter will be converted into ${logger_1.colors.Bright}${logger_1.colors.fg.Green}dynamic path parameters${logger_1.colors.Reset}.\n\tPassed value converted into Regular experssion by using ${logger_1.colors.Bright}${logger_1.colors.fg.Cyan}new RegExp()${logger_1.colors.Reset}(JavaScript)`
    },
    default: `${getDefault('[0-9]|[-$@!~%^*()_+]')}`
};
exports.SECURITY_HEADERS = {
    short: "s",
    long: "security-headers",
    required: false,
    description: {
        short: "Custom Securtity Headers configurarion.(SecuritySchemeObject as per OAS3.0)",
        long: `\tTo map custom security headers link 'x-api-key' as autorization header.
            
            ${getTitle('Syntax')}
                {
                    "${logger_1.colors.fg.Red}headerNameInHTTPRequest${logger_1.colors.Reset}": {Sequrity Scheme Object as per OAS3.0}
                }
            
            ${getTitle('Example')}
                {
                    "${logger_1.colors.fg.Green}x-api-key${logger_1.colors.Reset}": {
                        "name": "X-API-KEY,
                        "type": "apiKey",
                        "in": "headers"
                    }
                }
        `
    },
    default: `${getDefault('{}')}`
};
exports.TEMPLATE = {
    short: "t",
    long: "template",
    required: false,
    description: {
        short: "OAS3.0 Template path location",
        long: "\tYou can override the default template by passing your template file location."
    },
    default: `${getDefault('Avantation Template')}`
};
exports.DIABLE_TAG = {
    long: "disable-tag",
    required: false,
    description: {
        short: "Diable API's grouping based on route path"
    },
    default: `${getDefault('false')}`
};
exports.STATIC_UI_LOGO = {
    long: "static-ui-logo",
    required: false,
    description: {
        short: "Static UI logo file location."
    }
};
exports.DISABLE_STATIC_UI = {
    long: "disable-static-ui",
    required: false,
    description: {
        short: "disable the static ui file generation process."
    },
    default: `${getDefault('false')}`
};
exports._JSON = {
    short: "j",
    long: "json",
    description: {
        short: "Output will be in JSON format"
    },
    required: false,
    default: `${getDefault('false')}`
};
exports.PIPE = {
    short: "p",
    long: "pipe",
    description: {
        short: "Pipe the result into next command"
    },
    required: false,
    default: `${getDefault('false')}`
};
exports.OUT = {
    short: "o",
    long: "out",
    description: {
        short: "Destination path of documentation"
    },
    required: false,
    default: `${getDefault('./avantation.yaml')}`
};
exports.INFO = `
Avantion is command-line tool (avantation --help)
${exports.SHORT_DESCRIPTION}

${getTitle('Usages')}

  avantation [options]

Avantation will search HTTP requested and build the Request body,Query Parameter,Path Parameter Object based on host and base path pattern matching in har file and save the all the results on avantation.yaml

By default output file will be written on current working directory.To change the output file location use ${logger_1.colors.fg.Yellow}-o, --out${logger_1.colors.Reset}.

${getTitle('Example')}

${getExample()}

${getTitle("Options")}
`;
exports.manual = [
    exports.HAR,
    exports.HOST,
    exports.BASE_PATH,
    exports.PATH_REGEX,
    exports.SECURITY_HEADERS,
    exports.TEMPLATE,
    exports.DIABLE_TAG,
    exports.STATIC_UI_LOGO,
    exports.DISABLE_STATIC_UI,
    exports._JSON,
    exports.PIPE,
    exports.OUT
];
function getTitle(title) {
    return `${logger_1.colors.Bright}${logger_1.colors.fg.Magenta}${title}${logger_1.colors.Reset}`;
}
function getExample() {
    return `  ${logger_1.colors.fg.Green}avantation${logger_1.colors.Reset} ${logger_1.colors.fg.Yellow}--har${logger_1.colors.Reset} example.com.har ${logger_1.colors.fg.Yellow}-h${logger_1.colors.Reset} apis.example.com ${logger_1.colors.fg.Yellow}-b${logger_1.colors.Reset} v1 ${logger_1.colors.fg.Yellow}-o${logger_1.colors.Reset} ./example.json`;
}
function getDefault(defaut) {
    return `\t${logger_1.colors.Bright}${logger_1.colors.fg.Red}default:${logger_1.colors.Reset} ${logger_1.colors.Bright}${logger_1.colors.fg.White}${defaut}${logger_1.colors.Reset}`;
}
