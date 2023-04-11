import { MINIMAL_PASSWORD_LENGTH } from '@constants/UserSignup'
import { NextApiRequest, NextApiResponse } from 'next'
import { hashPassword } from '@lib/auth'
import { connectToDatabase } from '@lib/db'
import RS from '@constants/ResponseStatus'
import nodemailer, { Transporter } from 'nodemailer';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return
  }

  const data = req.body

  const { email, password, birthday, nickname, sex, language } = data
  
  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < MINIMAL_PASSWORD_LENGTH
  ) {
    res.status(RS.CERROR_UNPROCESSABLE).json({
      message:
        'Invalid input - password should also be at least 7 characters long.',
    })
    return
  }

   const client = await connectToDatabase()

   const db = client.db()

   const date = new Date()

   let day = date.getDate()
   let month = date.getMonth() + 1
   let year = date.getFullYear()
   let hour = date.getHours()
   let min = date.getMinutes()
   let sec = date.getSeconds()

   let processed_birthday = new Date(birthday)

   let day_birth = processed_birthday.getDate()
   let month_birth = processed_birthday.getMonth() + 1
   let year_birth = processed_birthday.getFullYear()
   let hour_birth = processed_birthday.getHours()
   let min_birth = processed_birthday.getMinutes()
   let sec_birth = processed_birthday.getSeconds()

   const existingUser = await db.collection('users').findOne({
     email,
   })

   if (existingUser) {
     res.status(RS.CERROR_UNPROCESSABLE).json({
       message: 'User exists already!',
     })
    client.close()
     return
   }

   const hashedPassword = await hashPassword(password)

  const enable = true
  const verify_code = (Math.floor(100000 + Math.random() * 900000)).toString()
  const code_send_time = Date.now()

  const user =  await db.collection('users').insertOne({
    email,
    password: hashedPassword,
    day_birth,
    month_birth,
    year_birth,
    nickname,
    sex,
    day,
    month,
    year,
    hour,
    min,
    sec,
    enable,
    verify_code,
    code_send_time
  })

  const setting = await db.collection('settings').insertOne({
    user_id: user.insertedId,
    language: language,
    modus: 0,
    status: 0,
    show_firstname: 0,
    show_lastname: 0,
    show_email: 0,
    show_telephone: 0,
    show_analyse: 0,
  })

  // sendCode(email, verify_code)

  res.status(RS.SUCCESS_CREATED).json({
    message: 'Created user!',
  })
  // client.close()
}
function sendCode(emailAddress: string, code: string) {

  console.log("Email Address", emailAddress)

  const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tonylobbin7712@gmail.com',
        pass: 'qkdcndquf'
    }
  });

  const mailOptions = {
    from: 'tonylobbin7712@gmail.com',
    to: emailAddress,
    subject: 'Email Verification Code',
    text: code
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("Email Log Here!")
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
  });
}

export default handler
