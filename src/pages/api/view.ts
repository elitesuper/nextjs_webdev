import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import mime from 'mime';

export const config = {
  api: {
    responseLimit: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;
  const filePath = `./uploads/${name}`;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(404).send('File not found');
    } else {
      const contentType = mime.getType(name as string);

      if (!contentType) {
        console.error('Unknown file type');
        res.status(415).send('Unsupported Media Type');
      } else {
        res.setHeader('Content-Type', contentType);
        res.send(data);
      }
    }
  });
}