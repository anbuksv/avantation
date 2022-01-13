import * as Avantation from '../interfaces/avantation';
import * as HAR from '../interfaces/har';
import * as OAS from '../interfaces/oas';
import * as OASEnum from '../enums/oas';
import * as querystring from 'querystring';
import { Util } from './util';
import * as fs from 'fs';
import * as path from 'path';
import { colors as Color } from './logger';

const HTTPSnippet: any = require('httpsnippet');
var URL: any = require('url-parse');
const YAML: any = require('json2yaml');

export class AvantationAPI implements Avantation.InputConfig {
    har: HAR.Final;
    title: string;
    template: OAS.Template;
    host: string;
    basePath: string;
    out: string;
    pathParamRegex: string;
    pipe: boolean;
    json: boolean;
    pathRegex: RegExp;
    tagsHolder: any = {};
    oclif: any;
    disableTag: boolean;
    mimeTypes: string[];
    securityHeaders: OAS.SecurityMap;
    'http-snippet': boolean;

    constructor(input: Avantation.InputConfig, oclif: any) {
        this.har = input.har;
        this.title = input.title;
        this.host = input.host;
        this.basePath = input.basePath;
        this.pathParamRegex = input.pathParamRegex;
        this.pipe = input.pipe;
        this.json = input.json;
        this.template = input.template;
        this.out = input.out;
        this.pathRegex = new RegExp(this.pathParamRegex);
        this.oclif = oclif;
        this.mimeTypes = ['application/json', '', 'application/json; charset=utf-8'];
        this.disableTag = input.disableTag;
        this.securityHeaders = input.securityHeaders;
        this['http-snippet'] = input['http-snippet'];
        this.run();
    }

    private run() {
        if(this.har.log.entries !== undefined) {
            this.har.log.entries.forEach(this.buildEntry.bind(this));
        }
        this.onBuildComplete();
    }

    logSuccess(head: string): void {
        this.oclif.log(`${Color.Bright}${Color.fg.Green}✔ ${Color.Reset}${head}`);
    }

    buildEntry(entry: HAR.HarEntry) {
        let url: Avantation.URL = new URL(entry.request.url);
        let method;
        entry.response.content.mimeType =
            entry.response.content.mimeType === 'application/json; charset=utf-8'
                ? 'application/json'
                : entry.response.content.mimeType;
        if (!this.mimeTypes.includes(entry.response.content.mimeType)) {
            this.oclif.warn(`Skipping invalid mimeType:${entry.response.content.mimeType} @${url.href} in response.`);
            return;
        }

        if (url.host !== this.host || !url.pathname.includes(this.basePath)) {
            this.oclif.warn(`Skipping invalid url ${url.href}`);
            return; //simply ignore invalid url match
        }

        // console.log(`query:${url.query} and path:${url.pathname}`);
        let path: Avantation.Path | undefined = this.buildPathDetails(url);
        if (path === undefined) return; //simply ignore invalid path match api
        let hardCodedQuery: OAS.ParameterObject[] = this.buildHardCodedQueryParams(url);
        let queryParams: OAS.ParameterObject[] = this.buildQueryParams(entry.request.queryString);

        // Avoid duplicating hardcoded query params from the URL, and those
        // specified in the HAR request queryString
        let uniqueQueryParams = new Map<string, OAS.ParameterObject>();
        hardCodedQuery.forEach((q) => {
            uniqueQueryParams.set(q.name, q)
        });
        queryParams.forEach((q) => {
            if (!uniqueQueryParams.has(q.name)) {
                uniqueQueryParams.set(q.name, q)
            }
        });

        let requestBody: OAS.RequestBodyObject | undefined = this.buildRequestBody(entry.request.postData, url);
        let response: OAS.Response = this.buildResponse(entry.response);
        let security: OAS.SecurityRequirementObject = this.buildSecurity(entry.request.headers);
        let pathItemInfo: Avantation.PathItemInfo = this.buildTag(entry.comment, path.tag);
        let operationItem: OAS.OperationObject = {
            security: Object.keys(security).length > 0 ? [security] : [],
            tags: [pathItemInfo.tag],
            summary: pathItemInfo.comment || pathItemInfo.tag,
            parameters: [...path.params, ...uniqueQueryParams.values()],
            requestBody: requestBody,
            responses: response
        };

        if (this['http-snippet']) {
            operationItem['x-code-samples'] = this.generateSampleCodes(entry.request);
        }

        if (this.disableTag) delete operationItem.tags;

        if (!this.template.paths[path.value]) this.template.paths[path.value] = {};

        this.tagsHolder[pathItemInfo.tag] = pathItemInfo.tag;

        switch (entry.request.method.toLocaleLowerCase()) {
            case 'post':
                method = `${Color.Bright}${Color.fg.Green}POST ${Color.Reset}`;
                this.template.paths[path.value].post = operationItem;
                break;
            case 'get':
                method = `${Color.Bright}${Color.fg.Blue}GET ${Color.Reset}`;
                this.template.paths[path.value].get = operationItem;
                break;
            case 'put':
                method = `${Color.Bright}${Color.fg.Magenta}PUT ${Color.Reset}`;
                this.template.paths[path.value].put = operationItem;
                break;
            case 'delete':
                method = `${Color.Bright}${Color.fg.Red}DEL ${Color.Reset}`;
                this.template.paths[path.value].delete = operationItem;
                break;
            case 'del':
                method = `${Color.Bright}${Color.fg.Red}DEL ${Color.Reset}`;
                this.template.paths[path.value].delete = operationItem;
                break;
        }
        if (!this.pipe) this.logSuccess(method + '\t' + url.pathname);
    }

    buildPathDetails(url: Avantation.URL): Avantation.Path | undefined {
        let basePathArr = this.basePath === '' ? ['', url.pathname] : url.pathname.split(this.basePath);

        if (basePathArr.length !== 2) {
            this.oclif.warn(
                'Skipping following invalid path API:' +
                JSON.stringify(
                    {
                        host: url.host,
                        path: url.pathname,
                        basePath: this.basePath
                    },
                    null,
                    4
                )
            );
            return undefined;
        }

        let pathArr = basePathArr[1].split('/');
        let pathTag: string | undefined = undefined;
        let that = this;
        let dynamicPathParam: OAS.ParameterObject[] = [];
        let dynamicPathProcessId: number = 0;
        pathArr.forEach(function (path: string, index: number) {
            if (!pathTag) pathTag = path;
            let isDynamicPath: boolean = that.pathRegex.test(path);
            if (isDynamicPath) {
                let name = 'id' + (dynamicPathProcessId > 0 ? dynamicPathProcessId : '');
                dynamicPathProcessId++;
                let gPath: OAS.ParameterObject = {
                    in: OASEnum.ParameterObject.IN.Path,
                    name: name,
                    schema: {
                        type: 'string'
                    },
                    required: true
                };
                dynamicPathParam.push(gPath);
                pathArr[index] = '{' + name + '}';
            }
        });
        return {
            params: dynamicPathParam,
            value: pathArr.join('/'),
            tag: pathTag
        };
    }

    buildHardCodedQueryParams(url: Avantation.URL): OAS.ParameterObject[] {
        let pathItemObject: OAS.ParameterObject[] = [];
        if (!url.query) return pathItemObject;
        let queryStr = url.query.split('?')[1];
        if (!queryStr) return pathItemObject;

        let query = querystring.parse(queryStr);
        for (let prop in query) {
            let item: OAS.ParameterObject;
            item = {
                in: OASEnum.ParameterObject.IN.Query,
                name: prop,
                schema: {
                    type: 'string'
                },
                required: true
            };
            pathItemObject.push(item);
        }
        return pathItemObject;
    }

    buildQueryParams(queryArray: HAR.NameValue[]): OAS.ParameterObject[] {
        let params: OAS.ParameterObject[] = [];
        params = queryArray.map(function (query: HAR.NameValue) {
            let param: OAS.ParameterObject = {
                in: OASEnum.ParameterObject.IN.Query,
                name: query.name,
                schema: {
                    type: 'string'
                },
                required: true
            };
            return param;
        });
        return params;
    }

    buildRequestBody(postData: HAR.PostData | undefined, url: Avantation.URL): OAS.RequestBodyObject | undefined {
        if (postData == undefined || !postData.mimeType) return undefined;

        let param: OAS.RequestBodyObject = {
            required: true,
            content: {}
        };

        if (postData.mimeType) {
            switch (postData.mimeType.split(';')[0].toLocaleLowerCase()) {
                case 'application/json':
                case 'application/json; charset=utf-8':
                    let data = postData.text ? JSON.parse(postData.text) : {};
                    param.content[postData.mimeType] = {
                        schema: Util.generateSchema(data),
                        example: data
                    };
                    break;

                case 'multipart/form-data':
                    param.content['multipart/form-data'] = {
                        schema: this.buildFormData(postData)
                    };
                    break;

                case 'application/x-www-form-urlencoded':
                    param.content['application/x-www-form-urlencoded'] = {
                        schema: this.buildFormData(postData)
                    };
                    break;
                default:
                    this.oclif.warn(`currently mimeType:${postData.mimeType} not supported. ${url.href}`);
            }
        }
        return param;
    }

    buildFormData(postData: HAR.PostData): any {
        if (postData.params !== undefined && postData.params.length !== 0) {
            let properties: any = {};
            let required: any = postData.params.map(function (query: HAR.NameValue) {
                if (query.value == '' || query.value == '(binary)') {
                    properties[query.name] = {
                        type: 'string',
                        format: 'binary'
                    };
                    return query.name;
                }
                properties[query.name] = {
                    type: 'string'
                };
                return query.name;
            });
            return {
                type: 'object',
                properties: properties,
                required: required
            };
        }
        return Util.generateSchema({});
    }

    buildResponse(res: HAR.HarResponse): OAS.Response {
        let response: OAS.Response = {
            default: {
                description: 'Unexpected error',
                content: {
                    ['application/json']: {
                        example: {
                            message: 'Sorry unable to perform operation.'
                        }
                    }
                }
            }
        };

        if (!res.content.text || !res.content.mimeType.includes('application/json')) return response;

        if (res.content.encoding && res.content.encoding == 'base64') {
            res.content.text = Buffer.from(res.content.text, 'base64').toString();
        }

        let responseData = JSON.parse(res.content.text);
        if (responseData instanceof Array) {
            responseData = responseData.slice(0, 3);
        } else {
            Util.arrayMaxDepth(responseData, 3);
        }
        let responObject: OAS.ReponsesObject = {
            description: res.statusText,
            content: {
                [res.content.mimeType]: {
                    schema: Util.generateSchema(responseData),
                    example: responseData
                }
            }
        };
        response[res.status] = responObject;
        return response;
    }

    buildSecurity(headers: HAR.NameValue[]): OAS.SecurityRequirementObject {
        let security: OAS.SecurityRequirementObject = {};
        let that = this;
        headers.forEach(function (header: HAR.NameValue) {
            if (header.name.trim().toLocaleLowerCase() === 'authorization') security['JWT'] = [];

            if (that.securityHeaders[header.name.trim()]) security[header.name.trim()] = [];
        });
        return security;
    }

    buildTag(comment: string | undefined, pathTag: string | undefined): Avantation.PathItemInfo {
        if (!comment || !comment.includes('#'))
            return {
                tag: pathTag || ''
            };
        let commentArr = comment.split('#');
        let data: any = querystring.parse(commentArr[1]);
        return {
            tag: data.tag || pathTag || '',
            comment: commentArr[0]
        };
    }

    generateSampleCodes(harRequest: HAR.HarRequest): Avantation.Snippet[] {
        let snip = new HTTPSnippet(harRequest);
        return [
            {
                lang: 'Curl',
                source: snip.convert('shell', 'curl')
            },
            {
                lang: 'JavaScript',
                source: snip.convert('javascript', 'jquery')
            },
            {
                lang: 'OKHttp',
                source: snip.convert('java', 'okhttp')
            },
            {
                lang: 'Swift',
                source: snip.convert('swift')
            },
            {
                lang: 'Python',
                source: snip.convert('python', 'requests')
            },
            {
                lang: 'NodeJS',
                source: snip.convert('node', 'native')
            }
        ];
    }

    onBuildComplete(): void {
        if (!this.template.tags) this.template.tags = [];

        if (!this.disableTag)
            for (let tag in this.tagsHolder) {
                this.template.tags.push({
                    name: tag
                });
            }

        let that = this;
        this.template.info.title = that.title;

        this.template.servers.forEach(function (server: OAS.ServerObject) {
            server.url = server.url.replace('{host}', that.host);
            if (server.variables && server.variables.basePath && typeof server.variables.basePath == 'object') {
                server.variables.basePath.default = server.variables.basePath.default.replace(
                    '{basePath}',
                    that.basePath
                );
            }
        });

        if (this.template.components && this.template.components.securitySchemes) {
            for (let security in this.securityHeaders) {
                this.template.components.securitySchemes[security] = this.securityHeaders[security];
            }
        }

        if (this.pipe) {
            console.log(this.json ? JSON.stringify(this.template) : YAML.stringify(this.template));
            return;
        }

        if (this.json || path.extname(this.out) == '.json') {
            if (this.out.endsWith('.yaml')) {
                this.out = this.out.replace('.yaml', '.json');
            }
            let _path = this.out ? path.resolve(this.out) : path.join(process.cwd(), 'openapi.json');
            fs.writeFileSync(_path, JSON.stringify(this.template, null, 4));
            this.afterBuildComplete();
            return;
        }

        fs.writeFileSync(
            this.out ? path.resolve(this.out) : path.join(process.cwd(), 'openapi.yaml'),
            YAML.stringify(this.template)
        );
        this.afterBuildComplete();
        return;
    }

    afterBuildComplete() {
        this.logSuccess('all taskes completed');
    }

    buildStaticUI() { }
}
