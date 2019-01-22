import Command, { flags } from '@oclif/command'
import { AvantationAPI } from './apis/avantation';
import defaultTemplate from './templates/avantation';
import { colors as Color } from './apis/logger'
import * as fs from 'fs'
import * as path from 'path'
import * as HAR from './interfaces/har';
import * as AvantationInterface from './interfaces/avantation';
import * as OAS from './interfaces/oas';
import * as Docs from './docs/index';

let manual = process.argv.slice(2).some((cmd) => {
  return (cmd == "--man") ? true : false
});

if (manual) {
  console.log(Docs.INFO);
  Docs.manual.forEach((_flag) => {
    let flag = (_flag.short) ? `-${_flag.short}, --${_flag.long}` : `--${_flag.long}`;
    flag = flag + ((_flag.required) ? " (required)" : "");
    console.log(`${Color.Bright}${Color.fg.Yellow} ${flag} ${Color.Reset}`)
    console.log(_flag.description.long || `\t${_flag.description.short}`)
    if (_flag.default) {
      console.log(_flag.default)
    }
    console.log("\n");
  })
  process.exit(0);
}

class Avantation extends Command {
  static description = Docs.SHORT_DESCRIPTION

  static flags = {
    "har": flags.string({
      description: Docs.HAR.description.short,
      required: true
    }),
    "host": flags.string({
      char: Docs.HOST.short,
      description: Docs.HOST.description.short,
      required: true
    }),
    "base-path": flags.string({
      char: Docs.BASE_PATH.short,
      description: Docs.BASE_PATH.description.short,
      required: true
    }),
    "template": flags.string({
      char: Docs.TEMPLATE.short,
      description: Docs.TEMPLATE.description.short
    }),
    "out": flags.string({
      char: Docs.OUT.short,
      description: Docs.OUT.description.short,
      default: "./openapi.yaml"
    }),
    "path-param-regex": flags.string({
      char: Docs.PATH_REGEX.short,
      description: Docs.PATH_REGEX.description.short,
      default: "[0-9]|[-$@!~%^*()_+]"
    }),
    "pipe": flags.boolean({
      char: Docs.PIPE.short,
      description: Docs.PIPE.description.short
    }),
    "json": flags.boolean({
      char: Docs._JSON.short,
      description: Docs._JSON.description.short
    }),
    "disable-tag": flags.boolean({
      description: Docs.DIABLE_TAG.description.short
    }),
    "security-headers": flags.string({
      char: Docs.SECURITY_HEADERS.short,
      description: Docs.SECURITY_HEADERS.description.short,
      default: "{}"
    }),
    "build-static-ui":flags.boolean({
        description: Docs.BUILD_STATIC_UI.description.short,
        default: false
    }),
    "static-ui-logo": flags.string({
      description: Docs.STATIC_UI_LOGO.description.short
    }),
    "man": flags.boolean({
      description: "print manual."
    })
  }

  async run() {
    const { flags } = this.parse(Avantation);
    let har: HAR.Final = JSON.parse(fs.readFileSync(path.resolve(flags.har), { encoding: 'utf-8' }));
    let template: OAS.Template;
    if (flags.template) {
      let _template: any = JSON.parse(fs.readFileSync(path.resolve(flags.template), { encoding: 'utf-8' }));
      for (let prop in _template) {
        defaultTemplate[prop] = _template[prop]
      }
    }
    template = defaultTemplate;
    var input: AvantationInterface.InputConfig = {
      har: har,
      host: flags.host,
      basePath: flags["base-path"],
      template: template,
      out: flags.out || "./openapi.yaml",
      pathParamRegex: flags["path-param-regex"] || "[0-9]|[-$@!~%^*()_+]",
      pipe: flags.pipe,
      json: flags.json,
      disableTag: flags["disable-tag"],
      securityHeaders: JSON.parse(flags["security-headers"] || "{}"),
      uiLogo: flags["static-ui-logo"],
      "build-static-ui": flags["build-static-ui"]
    }

    new AvantationAPI(input, this);
  }
}

export = Avantation
