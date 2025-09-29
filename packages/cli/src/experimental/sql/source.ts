import { homedir } from "os";
import { join } from "path";

export default join(homedir(), "simple.mail", "config.db");
