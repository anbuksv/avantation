<h2 align="center">Avantation</h2>
<p align="center">
</p>
<p align="center">
<!--  <a href="https://npmjs.org/package/avantation">
    <img alt="Beta" src="https://img.shields.io/badge/-🚀beta-important.svg?style=flat-square)">
  </a>
-->
  <a href="https://npmjs.org/package/avantation">
    <img alt="Version" target="_blank" src="https://img.shields.io/npm/v/avantation.svg?style=flat-square">
  </a>
  <a href="https://npmjs.org/package/avantation">
    <img alt="downloads" target="_blank" src="https://img.shields.io/npm/dm/avantation.svg?style=flat-square">
  </a>
<!--  <a href="#Code Style">
    <img alt="code style: avantation" src="https://img.shields.io/badge/code_style-avantation-ff69b4.svg?style=flat-square">
  </a>
-->
  <a href="https://npmjs.org/package/avantation">
    <img alt="license" target="_blank" src="https://img.shields.io/npm/l/avantation.svg?style=flat-square">
  </a>
  <a href="https://www.paypal.me/anbuksv">
    <img alt="donation" target="_blank" src="https://img.shields.io/badge/donation-paypal-blueviolet.svg?style=flat-square">
  </a>
</p>

avantation is tool the for generate OpenAPI3.0 from HTTP Archive format(HAR).

avantation is written and maintained by Anbarasan K (anbuksv@gmail.com).

<ul>
  <li>
   Project home page: <a target="_blank" href="https://www.avantation.in/">https://www.avantation.in/ </a>
  </li>
  <li>
   Code home page: <a target="_blank" href="https://github.com/anbuksv/avantation">https://github.com/anbuksv/avantation</a>
  </li>
  <li>
   Issue tracker: <a target="_blank" href="https://github.com/anbuksv/avantation/issues">https://github.com/anbuksv/avantation/issues</a>
  </li>
</ul>

## Contributing

Bug reports and code and documentation patches are welcome.

## Install

Direct downloads are available through the [release page](https://github.com/anbuksv/avantation/releases/latest).

If you have Node installed on your computer just run npm install

```
npm install -g avantation
```

## Features

-   HTTP sample code generation
-   Dynamic route path conversion
-   Schema generation
-   Supports json/yaml output formats
-   JWT authentication header mapping
-   Static-UI generation

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

  --disable-tag                            Diable end points grouping based on route path in HAR

  --http-snippet                           Generate HTTP smaple code snippet for request and append it as 'x-code-sample' to OpenAPI path
                                           object.

```

## Demo

### Existing Projects

![Existing Project Demo](demo/Existing_Project_Demo.gif)

**Tools** : [Firefox](https://www.mozilla.org/en-US/firefox/new/) | [Chrome](https://www.google.com/chrome/) | [Safari](https://www.apple.com/safari/) | [Charles Proxy](https://www.charlesproxy.com/)

### New Projects

![New Project Demo](demo/New_Project_Demo.gif)

**Tools** : [Insomnia](https://insomnia.rest/download/)

## User Interface's
<p>
<a target="_blank" href="https://demo.avantation.in/ui/swagger">
  <img alt="Swagger-UI" src="https://img.shields.io/badge/-Swagger-green.svg?style=social&logo=data:image/png;base64,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"/>
</a>
<a target="_blank" href="https://demo.avantation.in/ui">
  <img alt="Redoc-UI" src="https://img.shields.io/badge/-Redoc-green.svg?style=social&logo=data:image/png;base64,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" />
</a>
</p>

# FAQ

<h3>How to generate Static-UI?</h3>
<p>&nbsp;&nbsp;&nbsp;&nbsp;  avantation-ui bash script will help you to build static user interface for your specs but it's required <a href="https://www.npmjs.com/package/redoc-cli">redoc-cli. </a></p>
