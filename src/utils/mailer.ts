import nodemailer from "nodemailer";
import getEmailTemplate from "./email-templates";

interface MailerOptions<T> {
  from?: string;
  to: string;
  template: string;
  subject?: string;
  data: T;
}

async function Mailer<T>({
  from = "noreply@mail.andriann.co",
  to,
  template,
  subject,
  data,
}: MailerOptions<T>): Promise<boolean> {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE as string,
    //
    // If you are using smtp, you can uncomment the following line and remove the `service` object
    //
    // secure: true,
    // host: process.env.MAILER_HOST as string,
    // port: process.env.MAILER_PORT as number,
    auth: {
      user: process.env.MAILER_USER as string,
      pass: process.env.MAILER_PASS as string,
    },
  });

  // Create email options
  const mailOptions = {
    from,
    to,
    subject,
    html: getEmailTemplate<T>(template, data),
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);

  if (info.accepted.length === 0) {
    return false;
  }

  return true;
}

export default Mailer;
