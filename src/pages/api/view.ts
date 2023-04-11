import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;
  const filePath = `./uploads/${name}`;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(404).send('File not found');
    } else {
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(data);
    }
  });
}