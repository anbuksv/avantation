import Command, { flags } from '@oclif/command';
declare class Avantation extends Command {
    static description: string;
    static flags: {
        "har": flags.IOptionFlag<string>;
        "host": flags.IOptionFlag<string>;
        "base-path": flags.IOptionFlag<string>;
        "template": flags.IOptionFlag<string | undefined>;
        "out": flags.IOptionFlag<string | undefined>;
        "path-param-regex": flags.IOptionFlag<string | undefined>;
        "pipe": import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        "json": import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        "disable-tag": import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        "security-headers": flags.IOptionFlag<string | undefined>;
        "disable-static-ui": import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        "static-ui-logo": flags.IOptionFlag<string | undefined>;
        "man": import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
export = Avantation;
