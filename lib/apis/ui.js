"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widdershins = require("widdershins");
const shins = require("shins");
const fs = require("fs");
function default_1(_options) {
    let { host, basePath, api, outPath, logo, httpSchema } = _options;
    httpSchema = httpSchema ? httpSchema : "https";
    const languageMap = {
        "shell": "Shell",
        // "http": "HTTP",
        "javascript": "JavaScript",
        "javascript--nodejs": "Node.js",
        "ruby": "Ruby",
        "python": "Python",
        "java": "Java",
        "go": "Go"
    };
    api.servers = [
        {
            url: `${httpSchema}://${host}/${basePath}`
        }
    ];
    Object.keys(api.paths).forEach((path) => {
        if (api.paths[path].get !== undefined)
            delete api.paths[path].get["x-code-samples"];
        if (api.paths[path].post !== undefined)
            delete api.paths[path].post["x-code-samples"];
        if (api.paths[path].put !== undefined)
            delete api.paths[path].put["x-code-samples"];
        if (api.paths[path].delete !== undefined)
            delete api.paths[path].delete["x-code-samples"];
    });
    let options = {
        codeSamples: true,
        httpsnippet: false,
        theme: "vs2015" || "dracula",
        search: true,
        discovery: false,
        shallowSchemas: false,
        headings: 2,
        omitBody: false,
        language_tabs: [],
        sample: true
    };
    Object.getOwnPropertyNames(languageMap).forEach((lang) => {
        let obj = {};
        obj[lang] = languageMap[lang];
        options.language_tabs.push(obj);
    });
    // Shin options
    let shinOptions = {
        inline: true,
        unsafe: false,
        minify: true
    };
    if (logo) {
        shinOptions.logo = logo;
    }
    widdershins.convert(api, options, function (err, markdown) {
        if (err) {
            console.log(err);
            return;
        }
        shins.render(markdown, shinOptions, (err, html) => {
            if (err) {
                console.log(err);
                return;
            }
            fs.writeFileSync(outPath, html, "utf8");
        });
    });
}
exports.default = default_1;
