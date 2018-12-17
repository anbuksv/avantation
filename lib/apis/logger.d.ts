export declare const colors: {
    Reset: string;
    Bright: string;
    Dim: string;
    Underscore: string;
    Blink: string;
    Reverse: string;
    Hidden: string;
    fg: {
        Black: string;
        Red: string;
        Green: string;
        Yellow: string;
        Blue: string;
        Magenta: string;
        Cyan: string;
        White: string;
        Crimson: string;
    };
    bg: {
        Black: string;
        Red: string;
        Green: string;
        Yellow: string;
        Blue: string;
        Magenta: string;
        Cyan: string;
        White: string;
        Crimson: string;
    };
};
export declare class Logger {
    static log: (message: any) => void;
    static info: (message: any) => void;
    static warn: (message: any) => void;
    static error: (message: any) => void;
    static green: (message: any) => void;
}
