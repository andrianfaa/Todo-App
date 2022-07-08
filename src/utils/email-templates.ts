import handlebars from "handlebars";
import fs from "fs";

const getEmailTemplate = <T>(templateName: string, data: T) => {
  const templateFolder = `${process.cwd()}/src/templates`;

  // Check if template folder exists
  if (!fs.existsSync(templateFolder)) {
    throw new Error(`Template folder ${templateFolder} does not exist`);
  }

  // Check if template file exists
  const templateFile = `${templateFolder}/${templateName}.html`;

  if (!fs.existsSync(templateFile)) {
    throw new Error(`Template file ${templateFile} does not exist`);
  }

  // Read template file
  const template = fs.readFileSync(templateFile, "utf8");

  // Compile template
  const compiledTemplate = handlebars.compile(template);

  // Return compiled template
  return compiledTemplate(data);
};

export default getEmailTemplate;
