import { Argument, Command, Option } from "commander";
import z from "zod";

const optionsSchema = z.object({
    username: z.email("Username has to be an email address you will send emails to").min(1, "Username cannot be empty").optional(),
    password: z.string().min(1, "Username cannot be empty").optional(),
    port: z.number().max(49151, "Port cannot be more than 49151").optional()
})

const serverSchema = z.string()
.transform((server) => {
    return new URL(
        !server.startsWith('smtp://') ? `smtp://${server}` : server
    );
});

/**
 * @todo Show provider select
 * @todo Show login interface via TUI
 */
export default new Command("login")
    .description("Logs on user into email service")
    .option('-U --username <name>', 'The username to use to log onto the SMTP service')
    .addOption(new Option('-p --password <password>', 'The password to use to log onto the SMTP service. It is recommended to use an environment variable to pass the password, or set the SMTP_PASS environment variable on this command').env("SMTP_PASS"))
    .addOption(new Option('--port <port>', 'The port to use for the SMTP server').env('SMTP_PORT'))
    .addArgument(new Argument('<server>', 'The SMTP service to use, in the format <host>[:<port>]').argRequired())
    .action(async (server: string, options, command) => {
        // check which options have been passed
        const { username, password, port: specificPort } = optionsSchema.parse(options);

        const url = serverSchema.parse(server);

        console.log(url, username, password, specificPort);

        const port = url.port.length === 0 ? specificPort : url.port;

        // check for vars that do not exist
    })
    ;
