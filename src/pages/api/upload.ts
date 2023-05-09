import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import RS from '@constants/ResponseStatus'
import { connectToDatabase } from '@lib/db'
var pos = require('pos');
// import multer from 'multer';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


// const upload = multer({
//   storage: multer.diskStorage({
//     destination: './public/uploads',
//     filename: (req, file, cb) => {
//       const filename = `${uuidv4()}${path.extname(file.originalname)}`;
//       cb(null, filename);
//     },
//   })
// });

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    },
  },
};


async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {


    const session = await getSession({
      req,
    })
  
    const { name, type, data } = req.body;

    const picpath = `${uuidv4()}${path.extname(name)}`;
    const filepath = `./uploads/${picpath}`;
    

    const buffer = Buffer.from(data)

    fs.writeFile(filepath, buffer, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error uploading file');
      } else {
        prepare(picpath, session, type)
        res.status(200).send({data:picpath});
      }
    });
  } else {
    res.status(405).send('Method not allowed');
  }
  
}
export default handler

function prepare (picpath, session, type) {
  if(type == 'profile'){
    savetodb(picpath, session);
  }
}
async function savetodb (picpath, session) {
  
  const client = await connectToDatabase()

  const usersCollection = client.db().collection('users')

  await usersCollection.updateOne(
    {
      email: session?.user?.email,
    },
    {
      $set: {
        picpath
      },
    }
  )
}