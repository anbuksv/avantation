export namespace ParameterObject {
    export enum IN {
        Path = 'path',
        Query = 'query',
        Header = 'header',
        Cookie = 'cookie',
        FormData = 'formData'
    }
}

export namespace SecuritySchemeObject {
    export enum Type {
        apiKey = 'apiKey',
        http = 'http',
        oauth2 = 'oauth2',
        openIdConnect = 'openIdConnect'
    }

    export enum IN {
        Query = 'query',
        Header = 'header',
        Cookie = 'cookie'
    }
}

export enum openapi {
    V3 = '3.0.0'
}
