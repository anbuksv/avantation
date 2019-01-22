import { colors } from '../apis/logger';
export declare type AlphabetUppercase = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
export declare type AlphabetLowercase = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';


interface flages {
    short?: AlphabetLowercase | AlphabetUppercase,
    long?: string,
    default?: string,
    required: boolean,
    description: description
}

interface description {
    short: string,
    long?: string
}

export const SHORT_DESCRIPTION = "Designed for programmers to generate documentation for large scal applications."

export const HAR: flages = {
    long: "har",
    required: true,
    description: {
        short: "har file path",
        long: `\tThe HTTP Archive format(HAR), is JSON formatted archive file format for logging of a web browswer's intraction with site.
        To generate the HAR file for your existion application use Chrome,Firefox,Safari,Internet Explorer,Edge.
        To generate the HAR file for new projects use Insomania REST Clint Desktop application.`
    }
};
export const HOST: flages = {
    short: "h",
    long: "host",
    required: false,
    description: {
        short: "host name",
        long: "Host name is mandatore field to build openapi sepcification by default it will be first request url in HAR."
    }
};
export const BASE_PATH: flages = {
    short: "b",
    long: "base-path",
    required: true,
    description: {
        short: "API host base path. Example:['api/v1']",
        long: "\tBase path of the end point"
    },
    default: ""
};
export const PATH_REGEX: flages = {
    short: "r",
    long: "path-param-regex",
    required: false,
    description: {
        short: "Convert Regex matching params into dynamic path ",
        long: `\tIn request URL regex matching path parameter will be converted into ${colors.Bright}${colors.fg.Green}dynamic path parameters${colors.Reset}.\n\tPassed value converted into Regular experssion by using ${colors.Bright}${colors.fg.Cyan}new RegExp()${colors.Reset}(JavaScript)`
    },
    default: `${getDefault('[0-9]|[-$@!~%^*()_+]')}`
};
export const SECURITY_HEADERS: flages = {
    short: "s",
    long: "security-headers",
    required: false,
    description: {
        short: "Custom Securtity Headers configurarion.(SecuritySchemeObject as per OAS3.0)",
        long: `\tTo map custom security headers link 'x-api-key' as autorization header.

            ${getTitle('Syntax')}
                {
                    "${colors.fg.Red}headerNameInHTTPRequest${colors.Reset}": {Sequrity Scheme Object as per OAS3.0}
                }

            ${getTitle('Example')}
                {
                    "${colors.fg.Green}x-api-key${colors.Reset}": {
                        "name": "X-API-KEY,
                        "type": "apiKey",
                        "in": "headers"
                    }
                }
        `
    },
    default: `${getDefault('{}')}`
}
export const TEMPLATE: flages = {
    short: "t",
    long: "template",
    required: false,
    description: {
        short: "OAS3.0 Template path location",
        long: "\tYou can override the default template by passing your template file location."
    },
    default: `${getDefault('Avantation Template')}`
};
export const DIABLE_TAG: flages = {
    long: "disable-tag",
    required: false,
    description: {
        short: "Diable API's grouping based on route path"
    },
    default: `${getDefault('false')}`
}

export const STATIC_UI_LOGO: flages = {
    long: "static-ui-logo",
    required: false,
    description: {
        short: "Static UI logo file location."
    }
}

export const BUILD_STATIC_UI: flages = {
    long: "build-static-ui",
    required: false,
    description: {
        short: "build the static user interface from OAS3.0"
    },
    default: `${getDefault('false')}`
}

export const HTTP_SNIPPET: flages = {
    long: "http-snippet",
    required: false,
    description: {
        short: "generate the smaple code for http request."
    },
    default: `${getDefault('false')}`
}

export const _JSON: flages = {
    short: "j",
    long: "json",
    description: {
        short: "Output will be in JSON format"
    },
    required: false,
    default: `${getDefault('false')}`
}
export const PIPE: flages = {
    short: "p",
    long: "pipe",
    description: {
        short: "Pipe the result into next command"
    },
    required: false,
    default: `${getDefault('false')}`
}

export const OUT: flages = {
    short: "o",
    long: "out",
    description: {
        short: "Destination path of documentation"
    },
    required: false,
    default: `${getDefault('./avantation.yaml')}`
}

export const INFO = `
Avantion is command-line tool (avantation --help)
${SHORT_DESCRIPTION}

${getTitle('Usages')}

  avantation [options]

Avantation will search HTTP requested and build the Request body,Query Parameter,Path Parameter Object based on host and base path pattern matching in har file and save the all the results on avantation.yaml

By default output file will be written on current working directory.To change the output file location use ${colors.fg.Yellow}-o, --out${colors.Reset}.

${getTitle('Example')}

${getExample()}

${getTitle("Options")}
`;

export let manual: flages[] = [
    HAR
    , HOST
    , BASE_PATH
    , PATH_REGEX
    , SECURITY_HEADERS
    , TEMPLATE
    , DIABLE_TAG
    , HTTP_SNIPPET
    , BUILD_STATIC_UI
    , STATIC_UI_LOGO
    , _JSON
    , PIPE
    , OUT
];

function getTitle(title: string) {
    return `${colors.Bright}${colors.fg.Magenta}${title}${colors.Reset}`
}

function getExample() {
    return `  ${colors.fg.Green}avantation${colors.Reset} ${colors.fg.Yellow}--har${colors.Reset} example.com.har ${colors.fg.Yellow}-h${colors.Reset} apis.example.com ${colors.fg.Yellow}-b${colors.Reset} v1 ${colors.fg.Yellow}-o${colors.Reset} ./example.json`
}

function getDefault(defaut: string): string {
    return `\t${colors.Bright}${colors.fg.Red}default:${colors.Reset} ${colors.Bright}${colors.fg.White}${defaut}${colors.Reset}`
}
