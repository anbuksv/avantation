export const colors = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',
    fg: {
        Black: '\x1b[30m',
        Red: '\x1b[31m',
        Green: '\x1b[32m',
        Yellow: '\x1b[33m',
        Blue: '\x1b[34m',
        Magenta: '\x1b[35m',
        Cyan: '\x1b[36m',
        White: '\x1b[37m',
        Crimson: '\x1b[38m'
    },
    bg: {
        Black: '\x1b[40m',
        Red: '\x1b[41m',
        Green: '\x1b[42m',
        Yellow: '\x1b[43m',
        Blue: '\x1b[44m',
        Magenta: '\x1b[45m',
        Cyan: '\x1b[46m',
        White: '\x1b[47m',
        Crimson: '\x1b[48m'
    }
};
// console.log(colors.bg.Blue, colors.fg.White , "I am white message with blue background", colors.Reset); example
export class Logger {
    static log = function(message: any): void {
        console.log(message);
    };

    static info = function(message: any): void {
        console.log(colors.Bright, message, colors.Reset);
    };

    static warn = function(message: any): void {
        console.log(colors.fg.White, message, colors.Reset);
    };

    static error = function(message: any): void {
        console.log(colors.fg.Red, message, colors.Reset);
    };

    static green = function(message: any): void {
        console.log(colors.fg.Green, message, colors.Reset);
    };
}
