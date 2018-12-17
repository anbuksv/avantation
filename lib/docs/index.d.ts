export declare type AlphabetUppercase = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
export declare type AlphabetLowercase = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
interface flages {
    short?: AlphabetLowercase | AlphabetUppercase;
    long?: string;
    default?: string;
    required: boolean;
    description: description;
}
interface description {
    short: string;
    long?: string;
}
export declare const SHORT_DESCRIPTION = "Designed for programmers to generate documentation for large scal applications.";
export declare const HAR: flages;
export declare const HOST: flages;
export declare const BASE_PATH: flages;
export declare const PATH_REGEX: flages;
export declare const SECURITY_HEADERS: flages;
export declare const TEMPLATE: flages;
export declare const DIABLE_TAG: flages;
export declare const STATIC_UI_LOGO: flages;
export declare const DISABLE_STATIC_UI: flages;
export declare const _JSON: flages;
export declare const PIPE: flages;
export declare const OUT: flages;
export declare const INFO: string;
export declare let manual: flages[];
export {};
