import Command, { flags } from '@oclif/command';
import { AvantationAPI } from './apis/avantation';
import defaultTemplate from './templates/avantation';
import * as fs from 'fs';
import * as path from 'path';
import * as HAR from './interfaces/har';
import * as AvantationInterface from './interfaces/avantation';
import * as OAS from './interfaces/oas';
import { Util } from './apis/util';

let pipe: boolean = !process.stdout.isTTY;
let stdin: boolean = !process.stdin.isTTY;
let stdinput = '';

if (stdin) {
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
        let chunk;
        // Use a loop to make sure we read all available data.
        while ((chunk = process.stdin.read()) !== null) {
            stdinput = stdinput + chunk;
        }
    });
    process.stdin.on('end', () => {});
}

class Avantation extends Command {
    static description = 'Build OpenAPI specification from HAR.';
    static args = [
        {
            name: 'har',
            description: 'http archive(har) path',
            required: !stdin
        }
    ];

    static flags = {
        host: flags.string({
            char: 'h',
            description: 'Filter the http request from HAR and use it as server url in output.',
            required: false
        }),
        'base-path': flags.string({
            char: 'b',
            description: "Separate the common path as base path from HTTP requests. Example:['api/v1']",
            required: false
        }),
        template: flags.string({
            char: 't',
            description: 'To override the default template pass the your template file location.'
        }),
        out: flags.string({
            char: 'o',
            description: 'Write output result at this DEST location.',
            default: './openapi.yaml'
        }),
        'path-param-regex': flags.string({
            char: 'r',
            description: 'Convert Regex matching params into dynamic path ',
            default: '^([0-9]|[-$@!~%^*()_+])+$'
        }),
        json: flags.boolean({
            char: 'j',
            description: 'Write output result in JSON format.'
        }),
        'disable-tag': flags.boolean({
            description: 'Diable end points grouping based on route path in HAR'
        }),
        'security-headers': flags.string({
            char: 's',
            description: 'Map matching HTTP headers into security headers on request.',
            default: '{}'
        }),
        'http-snippet': flags.boolean({
            description:
                "Generate HTTP smaple code snippet for request and appedn it as 'x-code-sample' to OpenAPI path object.",
            default: false
        })
    };

    async run() {
        const { flags } = this.parse(Avantation);
        const { args } = this.parse(Avantation);
        if (!stdin && !fs.existsSync(path.resolve(args.har))) {
            this.error('Invalid file location ' + path.resolve(args.har));
        }
        let har: HAR.Final = stdin
            ? JSON.parse(stdinput)
            : JSON.parse(fs.readFileSync(path.resolve(args.har), { encoding: 'utf-8' }));
        let template: OAS.Template;
        if (flags.template) {
            let _template: any = JSON.parse(fs.readFileSync(path.resolve(flags.template), { encoding: 'utf-8' }));
            for (let prop in _template) {
                defaultTemplate[prop] = _template[prop];
            }
        }
        template = defaultTemplate;
        let host: string = flags.host
            ? flags.host
            : har.log.entries.length > 0
            ? Util.inferHost(har.log.entries)
            : "";
        var input: AvantationInterface.InputConfig = {
            har: har,
            title: "Avantation REST Template",
            host: host,
            basePath: flags['base-path'] || '',
            template: template,
            out: flags.out || './openapi.yaml',
            pathParamRegex: flags['path-param-regex'] || '^([0-9]|[-$@!~%^*()_+])+$',
            pipe: pipe,
            json: flags.json,
            disableTag: flags['disable-tag'],
            securityHeaders: JSON.parse(flags['security-headers'] || '{}'),
            'http-snippet': flags['http-snippet']
            //	    maxDepth: flags['array-max-depth']
        };

        new AvantationAPI(input, this);
    }
}

export = { Avantation, AvantationAPI }
