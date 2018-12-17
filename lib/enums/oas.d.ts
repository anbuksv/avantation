export declare namespace ParameterObject {
    enum IN {
        Path = "path",
        Query = "query",
        Header = "header",
        Cookie = "cookie",
        FormData = "formData"
    }
}
export declare namespace SecuritySchemeObject {
    enum Type {
        apiKey = "apiKey",
        http = "http",
        oauth2 = "oauth2",
        openIdConnect = "openIdConnect"
    }
    enum IN {
        Query = "query",
        Header = "header",
        Cookie = "cookie"
    }
}
export declare enum openapi {
    V3 = "3.0.0"
}
