import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import RS from '@constants/ResponseStatus'
import { hashPassword, verifyPassword } from '@lib/auth'
import { connectToDatabase } from '@lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return
  }

  const session = await getSession({
    req,
  })

  if (!session) {
    res.status(RS.CERROR_UNAUTHORIZED).json({
      message: 'Not authenticated!',
    })
    return
  }

  const userEmail = session.user?.email
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword

  const client = await connectToDatabase()

  const usersCollection = client.db().collection('users')

  const user = await usersCollection.findOne({
    email: userEmail,
  })

  if (!user) {
    res.status(RS.CERROR_NOTFOUND).json({
      message: 'User not found.',
    })
    client.close()
    return
  }

  const currentPassword = user.password

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword)

  if (!passwordsAreEqual) {
    res.status(RS.CERROR_UNAUTHORIZED).json({
      message: 'Invalid password.',
    })
    client.close()
    return
  }

  const hashedPassword = await hashPassword(newPassword)

  /* const result = */ await usersCollection.updateOne(
    {
      email: userEmail,
    },
    {
      $set: {
        password: hashedPassword,
      },
    }
  )

  client.close()
  res.status(RS.SUCCESS_OK).json({
    message: 'Password updated!',
  })
}

export default handler
