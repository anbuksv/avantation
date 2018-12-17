"use strict";
const command_1 = require("@oclif/command");
const avantation_1 = require("./apis/avantation");
const avantation_2 = require("./templates/avantation");
const logger_1 = require("./apis/logger");
const fs = require("fs");
const path = require("path");
const Docs = require("./docs/index");
let manual = process.argv.slice(2).some((cmd) => {
    return (cmd == "--man") ? true : false;
});
if (manual) {
    console.log(Docs.INFO);
    Docs.manual.forEach((_flag) => {
        let flag = (_flag.short) ? `-${_flag.short}, --${_flag.long}` : `--${_flag.long}`;
        flag = flag + ((_flag.required) ? " (required)" : "");
        console.log(`${logger_1.colors.Bright}${logger_1.colors.fg.Yellow} ${flag} ${logger_1.colors.Reset}`);
        console.log(_flag.description.long || `\t${_flag.description.short}`);
        if (_flag.default) {
            console.log(_flag.default);
        }
        console.log("\n");
    });
    process.exit(0);
}
class Avantation extends command_1.default {
    async run() {
        const { flags } = this.parse(Avantation);
        if (flags.man) {
            console.log(Docs.manual);
        }
        let har = JSON.parse(fs.readFileSync(path.resolve(flags.har), { encoding: 'utf-8' }));
        let template;
        if (flags.template) {
            let _template = JSON.parse(fs.readFileSync(path.resolve(flags.template), { encoding: 'utf-8' }));
            for (let prop in _template) {
                avantation_2.default[prop] = _template[prop];
            }
        }
        template = avantation_2.default;
        var input = {
            har: har,
            host: flags.host,
            basePath: flags["base-path"],
            template: template,
            out: flags.out || "./avantation.yaml",
            pathParamRegex: flags["path-param-regex"] || "[0-9]|[-$@!~%^*()_+]",
            pipe: flags.pipe,
            json: flags.json,
            disableTag: flags["disable-tag"],
            securityHeaders: JSON.parse(flags["security-headers"] || "{}"),
            uiLogo: flags["static-ui-logo"]
        };
        new avantation_1.AvantationAPI(input, this);
    }
}
Avantation.description = Docs.SHORT_DESCRIPTION;
Avantation.flags = {
    "har": command_1.flags.string({
        description: Docs.HAR.description.short,
        required: true
    }),
    "host": command_1.flags.string({
        char: Docs.HOST.short,
        description: Docs.HOST.description.short,
        required: true
    }),
    "base-path": command_1.flags.string({
        char: Docs.BASE_PATH.short,
        description: Docs.BASE_PATH.description.short,
        required: true
    }),
    "template": command_1.flags.string({
        char: Docs.TEMPLATE.short,
        description: Docs.TEMPLATE.description.short
    }),
    "out": command_1.flags.string({
        char: Docs.OUT.short,
        description: Docs.OUT.description.short,
        default: "./avantation.yaml"
    }),
    "path-param-regex": command_1.flags.string({
        char: Docs.PATH_REGEX.short,
        description: Docs.PATH_REGEX.description.short,
        default: "[0-9]|[-$@!~%^*()_+]"
    }),
    "pipe": command_1.flags.boolean({
        char: Docs.PIPE.short,
        description: Docs.PIPE.description.short
    }),
    "json": command_1.flags.boolean({
        char: Docs._JSON.short,
        description: Docs._JSON.description.short
    }),
    "disable-tag": command_1.flags.boolean({
        description: Docs.DIABLE_TAG.description.short
    }),
    "security-headers": command_1.flags.string({
        char: Docs.SECURITY_HEADERS.short,
        description: Docs.SECURITY_HEADERS.description.short,
        default: "{}"
    }),
    "disable-static-ui": command_1.flags.boolean({
        description: Docs.DISABLE_STATIC_UI.description.short,
        default: false
    }),
    "static-ui-logo": command_1.flags.string({
        description: Docs.STATIC_UI_LOGO.description.short
    }),
    "man": command_1.flags.boolean({
        description: "print manual."
    })
};
module.exports = Avantation;
