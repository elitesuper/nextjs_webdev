import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '@lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return
  }
  
  const {verificationCode, tempEmail} = req.body
  console.log(verificationCode)

  const client = await connectToDatabase()
  
  const usersCollection = client.db().collection('users')
  
  const user = await usersCollection.find({'email': tempEmail}).toArray()

  client.close()
  console.log(user[0].verify_code)
  if (user[0].verify_code == verificationCode) {
    console.log('success')
    return res.json({ status: 200, msg: 'success' });
  } else {
    console.log('fail')
    return res.json({ status: 404, msg: 'fail' });
  }
}

export default handler
