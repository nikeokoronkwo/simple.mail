import nodemailer from "nodemailer";

export async function sendEMLEmail(smtp: {
  host: string;
  port: string;
  secure?: boolean;
  user: string;
  password: string;
}, email: {
  eml: Buffer,
  to: string[];
}) {
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
    envelope: {
      from: smtp.user,
      to: email.to,
    },
    raw: {
      content: email.eml
    }
  });

  return {
    response: info.response,
    accepted: info.accepted,
    rejected: info.rejected,
    errors: info.rejectedErrors,
  };
}

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
    sourceFormat?: {
      contentType: string;
      raw: string
    }
    body: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
    attachments?: {
      name: string;
      content: Buffer;
    }[];
    calendar?: {
      content: Buffer;
      name: string;
      kind: 'REQUEST' | 'REPLY' | 'CANCEL' | 'PUBLISJ';
    }
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
    icalEvent: {
      ...email.calendar,
      filename: email.calendar?.name
    },
    alternatives: email.sourceFormat ? [{
      contentType: email.sourceFormat.contentType,
      content: email.sourceFormat.raw
    }] : undefined,
    attachments: email.attachments?.map(a => ({ ...a, filename: a.name }))
  });

  return {
    response: info.response,
    accepted: info.accepted,
    rejected: info.rejected,
    errors: info.rejectedErrors,
  };
}
