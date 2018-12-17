import * as OAS from '../interfaces/oas';
interface options {
    host: string;
    basePath: string;
    api: OAS.Template;
    outPath: string;
    logo?: string;
    httpSchema?: string;
}
export default function (_options: options): void;
export {};
