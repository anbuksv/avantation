
<h2 align="center">Avantation</h2>
<p align="center">
🚧 Work in Progress! 🚧
</p>
<p align="center">
<!--  <a href="https://npmjs.org/package/avantation">
    <img alt="Beta" src="https://img.shields.io/badge/-🚀beta-important.svg?style=flat-square)">
  </a>
-->
  <a href="https://npmjs.org/package/avantation">
    <img alt="Version" src="https://img.shields.io/npm/v/avantation.svg?style=flat-square">
  </a>
  <a href="https://npmjs.org/package/avantation">
    <img alt="downloads" src="https://img.shields.io/npm/dm/avantation.svg?style=flat-square">
  </a>
<!--  <a href="#Code Style">
    <img alt="code style: avantation" src="https://img.shields.io/badge/code_style-avantation-ff69b4.svg?style=flat-square">
  </a>
-->
  <a href="https://npmjs.org/package/avantation">
    <img alt="license" src="https://img.shields.io/npm/l/avantation.svg?style=flat-square">
  </a>
  <a href="https://www.paypal.me/anbuksv">
    <img alt="donation" src="https://img.shields.io/badge/donation-paypal-blueviolet.svg?style=flat-square">
  </a>
</p>


avantation is tool the for generate OpenAPI3.0 from HTTP Archive format(HAR).

avantation is written and maintained by Anbarasan K (anbuksv@gmail.com).

- Project home page: https://www.avantation.in/
- Code home page: https://github.com/anbuksv/avantation
- Issue tracker: https://github.com/anbuksv/avantation/issues
- Slack Channel: https://slack.avantation.in

## Contributing
Bug reports and code and documentation patches are welcome.
## Install

Direct downloads are available through the [release page](https://github.com/anbuksv/avantation/releases/latest).

If you have Node installed on your computer just run npm install

```
npm install -g avantation
```

## Features

- HTTP sample code generation
- Dynamic route path conversion
- Schema generation
- Supports json/yaml output formats
- JWT authentication header mapping
- Static-UI generation

## Usage

```sh-session
Build OpenAPI specification from HAR.

USAGE
  $ avantation HAR

ARGUMENTS
  HAR  http archive(har) path

OPTIONS
  -b, --base-path=base-path                Separate the common path as base path from HTTP requests.
                                           Example:['api/v1']

  -h, --host=host                          Filter the http request from HAR and use it as server url in output.

  -j, --json                               Write output result in JSON format.

  -o, --out=out                            [default: ./openapi.yaml] Write output result at this DEST location.

  -r, --path-param-regex=path-param-regex  [default: [0-9]|[-$@!~%^*()_+]] Convert Regex matching params into dynamic path

  -s, --security-headers=security-headers  [default: {}] Map matching HTTP headers into security headers on request.

  -t, --template=template                  To override the default template pass the your template file location.

  --build-static-ui                        Build the static user interface from generated OpenAPI3.0 specification.

  --disable-tag                            Diable end points grouping based on route path in HAR

  --http-snippet                           Generate HTTP smaple code snippet for request and append it as 'x-code-sample' to OpenAPI path
                                           object.

  --static-ui-logo=static-ui-logo          Static-UI logo file location

```

## Demo

### Existing Projects

![Existing Project Demo](demo/Existing_Project_Demo.gif)


__Tools__  :  [Firefox](https://www.mozilla.org/en-US/firefox/new/)  | [Chrome](https://www.google.com/chrome/) | [Safari](https://www.apple.com/safari/)  | [Charles Proxy](https://www.charlesproxy.com/)

### New Projects

![New Project Demo](demo/New_Project_Demo.gif)

__Tools__ : [Insomnia](https://insomnia.rest/download/)
### Demo Results

- **Static-UI** - https://demo.avantation.in/ui/
- **Swagger-UI** - https://demo.avantation.in/ui/swagger/
- **Redoc-UI** - https://demo.avantation.in/ui/swagger/redoc.html

