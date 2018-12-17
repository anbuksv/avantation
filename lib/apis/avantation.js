"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OASEnum = require("../enums/oas");
const querystring = require("querystring");
const util_1 = require("./util");
const fs = require("fs");
const path = require("path");
const ui_1 = require("./ui");
const HTTPSnippet = require('httpsnippet');
var URL = require('url-parse');
const YAML = require('json2yaml');
class AvantationAPI {
    constructor(input, oclif) {
        this.tagsHolder = {};
        this.har = input.har;
        this.host = input.host;
        this.basePath = input.basePath;
        this.pathParamRegex = input.pathParamRegex;
        this.pipe = input.pipe;
        this.json = input.json;
        this.template = input.template;
        this.out = input.out;
        this.pathRegex = new RegExp(this.pathParamRegex);
        this.oclif = oclif;
        this.mimeTypes = ["application/json", "", "application/json; charset=utf-8"];
        this.disableTag = input.disableTag;
        this.securityHeaders = input.securityHeaders;
        if (input.uiLogo) {
            this.uiLogo = path.resolve(input.uiLogo);
        }
        this.run();
    }
    async run() {
        // console.log("Creater:", this.har.log.creator);
        let req;
        this.har.log.entries.forEach(this.buildEntry.bind(this));
        this.onBuildComplete(this.template);
    }
    buildEntry(entry) {
        let url = new URL(entry.request.url);
        if (url.host !== this.host || !url.pathname.includes(this.basePath)) {
            this.oclif.warn(`Skiping invalid url ${url.href}`);
            return; //simply ingnore invalid url match
        }
        entry.response.content.mimeType = entry.response.content.mimeType === "application/json; charset=utf-8" ? "application/json" : entry.response.content.mimeType;
        if (!this.mimeTypes.includes(entry.response.content.mimeType)) {
            // console.log(entry.response.content);
            this.oclif.warn(`Skiping invalid mimeType:${entry.response.content.mimeType} @${url.href} in response.`);
            return; //simply ingnore invalid url match
        }
        // console.log(`query:${url.query} and path:${url.pathname}`);
        let path = this.buildPathDetails(url);
        if (path === undefined)
            return; //simpley ingnore invalid path match api
        let hardCodedQuery = this.buildHardCodedQueryParams(url);
        let queryParams = this.buildQueryParams(entry.request.queryString);
        let requestBody = this.buildRequestbody(entry.request.postData, url);
        let response = this.buildResponse(entry.response);
        let security = this.buildSecurity(entry.request.headers);
        let pathItemInfo = this.buildTag(entry.comment, path.tag);
        let sampleCodes = this.generateSampleCodes(entry.request);
        let operationItem = {
            security: Object.keys(security).length > 0 ? [security] : [],
            tags: [pathItemInfo.tag],
            summary: pathItemInfo.comment || pathItemInfo.tag,
            parameters: [...path.params, ...hardCodedQuery, ...queryParams],
            requestBody: requestBody,
            responses: response,
            "x-code-samples": sampleCodes
        };
        if (this.disableTag)
            delete operationItem.tags;
        if (!this.template.paths[path.value])
            this.template.paths[path.value] = {};
        this.tagsHolder[pathItemInfo.tag] = pathItemInfo.tag;
        switch (entry.request.method.toLocaleLowerCase()) {
            case "post":
                this.template.paths[path.value].post = operationItem;
                break;
            case "get":
                this.template.paths[path.value].get = operationItem;
                break;
            case "put":
                this.template.paths[path.value].put = operationItem;
                break;
            case "delete":
                this.template.paths[path.value].delete = operationItem;
                break;
            case "del":
                this.template.paths[path.value].delete = operationItem;
                break;
        }
    }
    buildPathDetails(url) {
        let basePathArr = url.pathname.split(this.basePath);
        if (basePathArr.length !== 2) {
            this.oclif.warn("Skiping following invalid path API:" + JSON.stringify({
                host: url.host,
                path: url.pathname,
                basePath: this.basePath
            }, null, 4));
            return undefined;
        }
        let pathArr = basePathArr[1].split("/");
        let pathTag = undefined;
        let that = this;
        let dynamicPathParam = [];
        let dynamicPathProcessId = 0;
        pathArr.forEach(function (path, index) {
            if (!pathTag)
                pathTag = path;
            let isDynamicPath = that.pathRegex.test(path);
            if (isDynamicPath) {
                let name = "id" + (dynamicPathProcessId > 0 ? dynamicPathProcessId : "");
                dynamicPathProcessId++;
                let gPath = {
                    in: OASEnum.ParameterObject.IN.Path,
                    name: name,
                    schema: {
                        type: "string"
                    },
                    required: true
                };
                dynamicPathParam.push(gPath);
                pathArr[index] = "{" + name + "}";
            }
        });
        return {
            params: dynamicPathParam,
            value: pathArr.join("/"),
            tag: pathTag
        };
    }
    buildHardCodedQueryParams(url) {
        let pathItemObject = [];
        if (!url.query)
            return pathItemObject;
        let queryStr = url.query.split("?")[1];
        if (!queryStr)
            return pathItemObject;
        let query = querystring.parse(queryStr);
        for (let prop in query) {
            let item;
            item = {
                in: OASEnum.ParameterObject.IN.Query,
                name: prop,
                schema: {
                    type: "string"
                },
                required: true
            };
            pathItemObject.push(item);
        }
        return pathItemObject;
    }
    buildQueryParams(queryArray) {
        let params = [];
        params = queryArray.map(function (query) {
            let param = {
                in: OASEnum.ParameterObject.IN.Query,
                name: query.name,
                schema: {
                    type: "string"
                },
                required: true
            };
            return param;
        });
        return params;
    }
    buildRequestbody(postData, url) {
        if (postData == undefined || !postData.mimeType)
            return undefined;
        let param = {
            required: true,
            content: {}
        };
        if (postData.mimeType) {
            switch (postData.mimeType.split(";")[0].toLocaleLowerCase()) {
                case "application/json":
                case "application/json; charset=utf-8":
                    let data = postData.text ? JSON.parse(postData.text) : {};
                    param.content[postData.mimeType] = {
                        schema: util_1.Util.generateSchema(data),
                        example: data
                    };
                    break;
                case "multipart/form-data":
                    param.content["multipart/form-data"] = {
                        schema: this.buildFormData(postData)
                    };
                    break;
                case "application/x-www-form-urlencoded":
                    param.content["application/x-www-form-urlencoded"] = {
                        schema: this.buildFormData(postData)
                    };
                    break;
                default:
                    this.oclif.warn(`currently mimeType:${postData.mimeType} not supported. ${url.href}`);
            }
        }
        return param;
    }
    buildFormData(postData) {
        if (postData.params !== undefined && postData.params.length !== 0) {
            let properties = {};
            let required = postData.params.map(function (query) {
                if (query.value == "" || query.value == "(binary)") {
                    properties[query.name] = {
                        "type": "string",
                        "format": "binary"
                    };
                    return query.name;
                }
                properties[query.name] = {
                    "type": "string"
                };
                return query.name;
            });
            return {
                "type": "object",
                "properties": properties,
                "required": required
            };
        }
        return util_1.Util.generateSchema({});
    }
    buildResponse(res) {
        let response = {
            "default": {
                description: "Unexpected error",
                content: {
                    ["application/json"]: {
                        example: {
                            "message": "Sorry unable to perform operation."
                        }
                    }
                }
            }
        };
        if (!res.content.text || !res.content.mimeType.includes("application/json"))
            return response;
        let responseData = JSON.parse(res.content.text);
        let responObject = {
            description: res.statusText,
            content: {
                [res.content.mimeType]: {
                    schema: util_1.Util.generateSchema(responseData),
                    example: responseData
                }
            }
        };
        response[res.status] = responObject;
        return response;
    }
    buildSecurity(headers) {
        let security = {};
        let that = this;
        headers.forEach(function (header) {
            if (header.name.trim().toLocaleLowerCase() === "authorization")
                security["JWT"] = [];
            if (that.securityHeaders[header.name.trim()])
                security[header.name.trim()] = [];
        });
        return security;
    }
    buildTag(comment, pathTag) {
        if (!comment || !comment.includes("#"))
            return {
                "tag": pathTag || ""
            };
        let commentArr = comment.split("#");
        let data = querystring.parse(commentArr[1]);
        return {
            "tag": data.tag || pathTag || "",
            "comment": commentArr[0]
        };
    }
    generateSampleCodes(harRequest) {
        let snip = new HTTPSnippet(harRequest);
        return [
            {
                "lang": "Curl",
                "source": snip.convert("shell", "curl")
            },
            {
                "lang": "JavaScript",
                "source": snip.convert("javascript", "jquery")
            },
            {
                "lang": "OkHttp",
                "source": snip.convert("java", "okhttp")
            },
            {
                "lang": "Swift",
                "source": snip.convert("swift")
            },
            {
                "lang": "Python",
                "source": snip.convert("python", "requests")
            },
            {
                "lang": "NodeJs",
                "source": snip.convert("node", "native")
            }
        ];
    }
    onBuildComplete(openapi) {
        if (!this.template.tags)
            this.template.tags = [];
        if (!this.disableTag)
            for (let tag in this.tagsHolder) {
                this.template.tags.push({
                    name: tag
                });
            }
        let that = this;
        this.template.servers.forEach(function (server) {
            server.url = server.url.replace("{host}", that.host);
            if (server.variables && server.variables.basePath && server.variables.basePath.default) {
                server.variables.basePath.default = server.variables.basePath.default.replace("{basePath}", that.basePath);
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
        if (this.json || path.extname(this.out) == ".json") {
            if (this.out.endsWith(".yaml")) {
                this.out = this.out.replace(".yaml", ".json");
            }
            let _path = this.out ? path.resolve(this.out) : path.join(process.cwd(), "avantation.json");
            fs.writeFileSync(_path, JSON.stringify(this.template, null, 4));
            this.buildStaticUI();
            return;
        }
        fs.writeFileSync(this.out ? path.resolve(this.out) : path.join(process.cwd(), "avantation.yaml"), YAML.stringify(this.template));
        this.buildStaticUI();
        return;
    }
    buildStaticUI() {
        let StaticUIOut = this.out ? path.dirname(path.resolve(this.out)) + "/index.html" : path.join(process.cwd(), "index.html");
        ui_1.default({
            api: this.template,
            host: this.host,
            basePath: this.basePath,
            outPath: StaticUIOut,
            httpSchema: "http",
            logo: this.uiLogo
        });
    }
}
exports.AvantationAPI = AvantationAPI;
