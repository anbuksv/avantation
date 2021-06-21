import * as HAR from '../interfaces/har';
import GenerateSchema from './json.js';
export namespace Util {
    export function generateSchema(input: any): any {
        let schema = GenerateSchema(input)
        delete schema['$schema'];
        return schema;
    }

    export function arrayMaxDepth(input: any, depthLimit: number | undefined) {
        input != null &&
            Object.keys(input).forEach(function (key: any) {
                if (input[key] instanceof Array) {
                    input[key] = input[key].slice(0, depthLimit || 3);
                    return;
                }

                if (typeof input[key] == 'object' && input[key] !== null) {
                    arrayMaxDepth(input[key], depthLimit);
                }
            });
    }

    export function buildWildCardRegex(wildCardString: string): RegExp {
        return new RegExp(`^${wildCardString.split('*').join('.*')}`);
    }

    export function inferHost(entries: HAR.HarEntry[]): string {
        let inferred_host = "";
        let inferred_host_count = 0;
        const host_frequency: Map<string, number> = new Map();

        for (const entry of entries) {
            const host = new URL(entry.request.url).host
            let frequency = 0

            if (host_frequency.has(host)) {
                let f = host_frequency.get(host);
                if (f === undefined) {
                    frequency = 1
                } else {
                    frequency = f + 1
                }
            } else {
                frequency = 1;
            }

            host_frequency.set(host, frequency);
            if (frequency > inferred_host_count) {
                inferred_host_count = frequency
                inferred_host = host
            }
        }

        return inferred_host;
    }
}
