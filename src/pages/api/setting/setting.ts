import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '@lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return
  }
  
  const session = await getSession({
      req,
  })

  console.log("session=", session)
  
  const { lang, modus, status, firstname, lastname, email, telephone, personalAnalysis } = req.body
  const client = await connectToDatabase()
  
  const usersCollection = client.db().collection('users')
  const settingsCollection = client.db().collection('settings')
  
  const user = await usersCollection.find({'email': session?.user?.email}).toArray()
  console.log(user[0]._id)
  const setting = await settingsCollection.updateOne(
    {'user_id': user[0]._id},
    {
      $set: {
        language: lang,
        modus: modus,
        status: status,
        show_firstname: firstname,
        show_lastname: lastname,
        show_email: email,
        show_telephone: telephone,
        show_analyse: personalAnalysis,
      }
    }
  )

  client.close()
  return res.json({ status: 200, setting: setting });
}

export default handler
