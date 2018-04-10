import fs from 'fs';

import { tableOfContents, template } from './template';

export default function ({ args, data }) {
  return new Promise((resolve, reject) => {
    // write to dest stream
    let writeStream;
    try {
      writeStream = fs.createWriteStream(args.dest, { flags: 'w' });
    } catch (err) {
      reject(err);
    }
    writeStream.on('error', (err) => {
      reject(err);
    });
    writeStream.on('finish', () => {
      resolve();
    });
    // build the table of contents
    if (!args.notoc) {
      writeStream.write(`# ${data[0].name}\n`);
      writeStream.write(`${data.map(tableOfContents).join('')}\n`);
    }

    // create docs for each contract from template
    writeStream.write(data.map(template).join('\n'));

    writeStream.end();
  });
}
