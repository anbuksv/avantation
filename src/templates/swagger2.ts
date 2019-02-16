let swagger2: any = {
    swagger: '2.0',
    info: {},
    host: '',
    basePath: '',
    schemes: ['http', 'https'],
    produces: ['application/json'],
    consumes: ['application/json'],
    securityDefinitions: {
        JWT: {
            name: 'Authorization',
            type: 'apiKey',
            in: 'header',
            'x-type': 'http',
            'x-scheme': 'bearer'
        }
    },
    tags: [],
    paths: {}
};

export default swagger2;
