import * as HAR from './har';
import * as OAS from './oas';

export interface URLResult {
    path: string;
    tag?: string;
    defaultTag: string;
    queryParams: OAS.ParameterObject[];
    pathParams: OAS.ParameterObject[];
    servers?: OAS.ServerObject;
}

export interface Snippet {
    lang: string;
    source: string;
}

export interface URL {
    slashes: boolean;
    protocol: string;
    hash: string;
    query: string;
    pathname: string;
    auth: string;
    host: string;
    port: string;
    hostname: string;
    password: string;
    username: string;
    origin: string;
    href: string;
}

export interface Path {
    value: string;
    params: OAS.ParameterObject[];
    tag: string | undefined;
}

export interface PathItemInfo {
    tag: string;
    comment?: string;
}

export interface build {
    paths: OAS.PathsObject;
}

export interface InputConfig {
    har: HAR.Final;
    title: string;
    host: string;
    basePath: string;
    template: OAS.Template;
    out: string;
    pathParamRegex: string;
    pipe: boolean;
    json: boolean;
    disableTag: boolean;
    securityHeaders: OAS.SecurityMap;
    'http-snippet': boolean;
    mimeTypes?: string[];
}
