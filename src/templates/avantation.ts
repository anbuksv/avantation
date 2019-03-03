let defaultTemplate: any = {
    openapi: '3.0.0',
    info: {
        version: '1.0',
        title: 'Avantation REST Template',
        description: 'TODO: Add Description'
    },
    servers: [
        {
            url: '{scheme}://{host}/{basePath}',
            variables: {
                scheme: {
                    enum: ['https', 'http'],
                    default: 'http'
                },
                basePath: {
                    default: '{basePath}'
                }
            }
        }
    ],
    tags: [],
    components: {
        schemas: {
            ErrorModel: {
                type: 'object',
                properties: {
                    code: {
                        type: 'string'
                    }
                }
            }
        },
        securitySchemes: {
            JWT: {
                description: 'You can create a JSON Web Token (JWT) during auth.\nUsage format: `Bearer <JWT>`\n',
                name: 'Authorization',
                type: 'apiKey',
                in: 'header'
            }
        }
    },
    paths: {}
};

export default defaultTemplate;
