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

  //   const { message } = req.body
  const client = await connectToDatabase()
  
  const usersCollection = client.db().collection('users')
  
  const currentUser = await usersCollection.find({'email': session?.user?.email}).toArray()

  client.close()
  return res.json({ status: 200, data: currentUser });
}

export default handler
