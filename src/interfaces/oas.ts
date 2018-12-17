import * as Avantation from './avantation';

import * as OASEnum from '../enums/oas'

export interface openapi {
    version: OASEnum.openapi;
}

export interface InfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    version: string;
    // "x-logo"?: RedocLogo;
}

export interface ServerObject {
    url: string;
    description?: string;
    variables?: {
        [name: string]: ServerVariableObject;
    }
}

export interface PathsObject {
    [path: string]: PathItemObject
}

export interface ComponentsObject {
    schemas?: any;
    responses?: any;
    parameters?: any;
    examples?: any;
    requestBodies?: any;
    headers?: any;
    securitySchemes?: SecurityMap;
    links?: any;
    callbacks?: any;
}

export interface SecurityRequirementObject {
    [name: string]: string[]
}

export interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
}

export interface ExternalDocumentationObject {
    description?: string;
    url: string;
}

export interface ParameterObject {
    name: string;
    in: OASEnum.ParameterObject.IN;
    description?: string;
    required: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
    schema?: any;
    example?: any;
    examples?: {
        [example: string]: ExampleObject | ReferenceObject;
    }
}

export interface ReponsesObject {
    description: string;
    headers?: any;
    content: ContentObject;
    links?: any;
}

export interface ContactObject {
    name: string;
    url: string;
    email: string;
}

export interface LicenseObject {
    name: string;
    url?: string;
}

export interface ServerVariableObject {
    enum?: string[];
    default: string;
    description?: string;
}

export interface ReferenceObject {
    $ref: string;
}

export interface PathItemObject {
    $ref?: string;
    summary?: string;
    description?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    trace?: OperationObject;
    servers?: ServerObject[];
    parameters?: (ParameterObject | ReferenceObject)[]
}

export interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: (ParameterObject | ReferenceObject)[];
    requestBody?: RequestBodyObject | ReferenceObject;
    responses: Response;
    callbacks?: any;
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
    ["x-code-samples"]?: Avantation.Snippet[];
}

export interface ExternalDocumentationObject {
    url: string;
    description?: string;
}

export interface ExampleObject {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
}

export interface ContentObject {
    [key: string]: MediaTypeObject
}

export interface RequestBodyObject {
    description?: string;
    content: ContentObject;
    required?: boolean;
}

export interface MediaTypeObject {
    schema?: any;
    example?: any;
    examples?: {
        [example: string]: ExampleObject | ReferenceObject;
    };
    encoding?: any;
}

export interface SecuritySchemeObject {
    type: OASEnum.SecuritySchemeObject.Type;
    description?: string;
    name?: string;
    in?: OASEnum.SecuritySchemeObject.IN;
    scheme?: any;
    bearerFormat?: string;
    flows?: any;
    openIdConnectUrl?: any;
    authorizationUrl?: string;
    tokenUrl?: string;
    refreshUrl?: string;
    scopes?: {
        [key: string]: string;
    };
}

export interface Response {
    [statusCode: string]: ReponsesObject | ReferenceObject;
}

export interface RedocLogo {
    url: string;
    backgroundColor: string;
}

export interface SecurityMap {
    [security: string]: SecuritySchemeObject | ReferenceObject;
}

export interface Template {
    openapi: openapi,
    info: InfoObject,
    servers: ServerObject[],
    paths: PathsObject,
    components?: ComponentsObject,
    security?: SecurityRequirementObject[],
    tags?: TagObject[],
    externalDocs?: ExternalDocumentationObject
}