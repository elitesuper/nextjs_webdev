import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import RS from '@constants/ResponseStatus'
import { connectToDatabase } from '@lib/db'
var pos = require('pos');
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const filename = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  })
});

export const config = {
  api: {
    bodyParser: false,
  },
};


async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {

    const session = await getSession({
      req,
    })
  
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload file' });
      } else {
        const url:any = `/uploads/${req.file.filename}`
        updateprofile(url, session)
        res.status(200).json({ path: `/uploads/${req.file.filename}` });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

}

function updateprofile(path:any, session:any){
  updatepicpath(path, session);
}
async function updatepicpath(path:any, session:any){
  const client = await connectToDatabase()
  const usersCollection = client.db().collection('users')
  const profilepic = path;

  await usersCollection.updateOne(
    {
      email: session?.user?.email,
    },
    {
      $set: {
        profilepic
      },
    }
  )
}
export default handler
