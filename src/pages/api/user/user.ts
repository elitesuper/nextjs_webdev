import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import RS from '@constants/ResponseStatus'
import { connectToDatabase } from '@lib/db'
var pos = require('pos');

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return
  }
  
  const session = await getSession({
      req,
  })

  console.log("session=", session)
  
  //   const { message } = req.body
  const client = await connectToDatabase()
  
  const usersCollection = client.db().collection('users')
  
  const users = await usersCollection.find({'email': {$ne : session?.user?.email}}).toArray()

  client.close()
  return res.json({ status: 200, data: users });
}

export default handler
