// Tests for util.ts

import {Util} from '../src/apis/util'
import * as AvantationInterface from "../src/interfaces/avantation";
import Avantation from "../src";
import defaultTemplate from "../src/templates/avantation";
import tmp from "tmp";
import * as HAR from '../src/interfaces/har';
import * as fs from 'fs';
import { expect } from 'chai';
import 'mocha';

describe('inferHosts empty', () => {

  it('should return empty string', () => {
    const result = Util.inferHost([]);
    expect(result).to.equal("");
  });

});

describe('inferHosts single', () => {
  it('should return host from only entry', () => {
    let har: HAR.Final = JSON.parse(fs.readFileSync("test/resources/example.single.har", { encoding: 'utf-8' }));

    const result = Util.inferHost(har.log.entries);
    expect(result).to.equal("127.0.0.1:21499");
  });
});

describe('inferHosts most frequent', () => {
  it('should return most frequently seen host', () => {
    let har: HAR.Final = JSON.parse(fs.readFileSync("test/resources/example.multiple.har", { encoding: 'utf-8' }));

    const result = Util.inferHost(har.log.entries);
    expect(result).to.equal("127.0.0.1");
  });
});

describe('har missing entries property', () => {
  it('should handle missing entries property', () => {
    tmp.file(function _tempFileCreated(err: any, path: string, fd: number) {
      let har: HAR.Final = JSON.parse(fs.readFileSync("test/resources/example.no_entries.har", { encoding: 'utf-8' }));

      var input: AvantationInterface.InputConfig = {
        har: har,
        title: "OpenAPI specification converted from HAR",
        host: "localhost",
        basePath:  "",
        template: JSON.parse(JSON.stringify(defaultTemplate)),
        out: path,
        pathParamRegex: "^([0-9]|[-$@!~%^*()_+])+$",
        pipe: false,
        json: false,
        disableTag: false,
        securityHeaders: JSON.parse("{}"), // JSON.parse(flags['security-headers'] || '{}'),
        "http-snippet": false,
      };

      class PhantomCommand {
        async run() {
          console.log("Running HAR to OpenAPI Converter");
        }

        log(message?: string, ...args: any[]): void {
          console.log(message, args);
        }
      }

      var result = new Avantation.AvantationAPI(
        input,
        new PhantomCommand()
      );

      expect(result).to.be.any
    })
  });
});