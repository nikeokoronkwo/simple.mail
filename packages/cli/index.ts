#!/usr/bin/env node

import { Command } from "commander";
import * as cmds from "./src/cmd";

const program = new Command("simple-mail");

program.version("0.1.0").description("A simple, powerful email builder");

for (const [name, cmd] of Object.entries(cmds)) {
  program.addCommand(cmd);
}

program.parseAsync();
