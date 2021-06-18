// Tests for util.ts

import {Util} from '../src/apis/util'
import {HarEntry, HarRequest} from '../src/interfaces/har'
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