import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import RS from '@constants/ResponseStatus'
import { connectToDatabase } from '@lib/db'
var pos = require('pos');

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return
  }

  var today = new Date()
  var Y = today.getFullYear()
  var M = today.getMonth() + 1
  var D = today.getDate()
  var h = today.getHours()
  var m = today.getMinutes()
  var s = today.getSeconds()
  
  var current_date = Y + '/' + M + '/' + D
  var current_time = h + ':' + m + ':' + s
  
  const session = await getSession({
      req,
  })

  console.log(session)

//   const { message } = req.body
  const client = await connectToDatabase()

  const usersCollection = client.db().collection('users')

  const user = await usersCollection.findOne({
    email: session?.user?.email,
  })

  const messageCollection = client.db().collection('messagestagger')

  let message = req.body.message

  console.log("words=", message)
  let words = new pos.Lexer().lex(message)
  console.log("words=", words)
  var tagger = new pos.Tagger()
  console.log("tagger=", tagger)
  var taggedWords = tagger.tag(words)
  console.log("tagger=", taggedWords)
  let messageObj: any = {}
  
  for (let i in taggedWords) {
    var taggedWord = taggedWords[i]
    var word = taggedWord[0]
    var tag = taggedWord[1]
    messageObj[tag] = word  
  }

  messageObj['user_id'] = user?._id
  messageObj['current_date'] = current_date
  messageObj['current_time'] = current_time
  messageObj['author'] = user?.firstName + ' ' + user?.lastName
  messageObj['length_of_firstname'] = user?.firstName?.length ?? 0
  messageObj['length_of_lastname'] = user?.lastName?.length ?? 0
  
  await messageCollection.insertOne(messageObj)

  client.close()
  return res.status(RS.SUCCESS_OK).json({
    message: 'Success',
  })
}

export default handler
