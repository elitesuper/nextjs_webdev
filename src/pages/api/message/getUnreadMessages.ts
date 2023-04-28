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

  const email = session?.user?.email
  
  
  const messagesCollection = client.db().collection('messages')
  
  const unreadCount = await messagesCollection.countDocuments({
    to: email,
    read: false
  });

  const unreadMessages = await messagesCollection.find({ 
    to: email,
    read: false
  }).toArray();

  const data = {
    count: unreadCount,
    messages: unreadMessages,
  }


  client.close()
  return res.json({ status: 200, data: data });
}

export default handler
