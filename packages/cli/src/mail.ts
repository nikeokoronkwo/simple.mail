import nodemailer from "nodemailer";

/** @todo Body formatting and all that */
export async function sendEmail(
  smtp: {
    host: string;
    port: string;
    secure?: boolean;
    user: string;
    password: string;
  },
  email: {
    type: "text" | "html";
    body: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
  },
) {
  const transport = nodemailer.createTransport({
    // @ts-ignore
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.password,
    },
  });

  const info = await transport.sendMail({
    from: smtp.user,
    to: email.to,
    cc: email.cc,
    bcc: email.bcc,
    text: email.type === "text" ? email.body : undefined,
    html: email.type === "html" ? email.body : undefined,
  });

  return {
    response: info.response,
    accepted: info.accepted,
    rejected: info.rejected,
    errors: info.rejectedErrors,
  };
}
