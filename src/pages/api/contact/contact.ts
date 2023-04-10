import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import RS from '@constants/ResponseStatus'
import { connectToDatabase } from '@lib/db'
var pos = require('pos');

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return
  }

  const session = await getSession({
      req,
  })

  const client = await connectToDatabase()

  const usersCollection = client.db().collection('users')

  const user = await usersCollection.findOne({
    email: session?.user?.email,
  })

  const contactCollection = client.db().collection('contacts')

  for (let index in req.body) {
    let contact = req.body[index]
    contact['contact_owner'] = user?._id
    await contactCollection.insertOne(contact)  
    console.log(contact)
  }
  

  client.close()
  return res.status(RS.SUCCESS_OK).json({
    message: 'Success',
  })
}

export default handler
