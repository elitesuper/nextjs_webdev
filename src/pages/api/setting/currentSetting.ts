import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '@lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return
  }
  
  const session = await getSession({
      req,
  })
  const client = await connectToDatabase()
  
  const usersCollection = client.db().collection('users')
  const settingsCollection = client.db().collection('settings')
  
  const currentUser = await usersCollection.find({'email': session?.user?.email}).toArray()
  const currentSetting = await settingsCollection.find({'user_id': currentUser[0]._id}).toArray()
  client.close()
  return res.json({ status: 200, data: currentSetting });
}

export default handler
