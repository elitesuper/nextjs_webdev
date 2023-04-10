import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import RS from '@constants/ResponseStatus'
import { connectToDatabase } from '@lib/db'
import { getDigitalRoot } from '@lib/utils'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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

  console.log(user)
  const sex = user?.sex
  // const time_birth = user?.time_birth
  const day_birth = user?.day_birth
  const month_birth = user?.month_birth
  const year_birth = user?.year_birth
  
  
  var today = new Date()
  var Y = today.getFullYear()
  var M = today.getMonth() + 1
  var D = today.getDate()
  var h = today.getHours()
  var m = today.getMinutes()
  var s = today.getSeconds()
  
  var t0 = h + ':' + m + ':' + s
  var timestamp0 = h * 3600 + m * 60 + s
    
  // dc, mc, yc means day, month, year of current date
  var dc1 = D.toString().length == 2 ? parseInt(D.toString()[0]) : 0
  var dc2 = D.toString().length == 2 ? parseInt(D.toString()[1]) : parseInt(D.toString()[0])
  var mc1 = M.toString().length == 2 ? parseInt(M.toString()[0]) : 0
  var mc2 = M.toString().length == 2 ? parseInt(M.toString()[1]) : parseInt(M.toString()[0])
  var yc1 = parseInt(Y.toString()[0])
  var yc2 = parseInt(Y.toString()[1])
  var yc3 = parseInt(Y.toString()[2])
  var yc4 = parseInt(Y.toString()[3])

  // db, mb, yb means day, month, year of birth date
  var db1 = day_birth.toString().length == 2 ? parseInt(day_birth.toString()[0]) : 0
  var db2 = day_birth.toString().length == 2 ? parseInt(day_birth.toString()[1]) : parseInt(day_birth.toString()[0])
  var mb1 = month_birth.toString().length == 2 ? parseInt(month_birth.toString()[0]) : 0
  var mb2 = month_birth.toString().length == 2 ? parseInt(month_birth.toString()[1]) : parseInt(month_birth.toString()[0])
  var yb1 = parseInt(year_birth.toString()[0])
  var yb2 = parseInt(year_birth.toString()[1])
  var yb3 = parseInt(year_birth.toString()[2])
  var yb4 = parseInt(year_birth.toString()[3])

  var sex_as_number = sex == 'male' ? 1 : sex == 'female' ? 2 : 3
  
  var age = Y - year_birth

  var sdc = dc1 + dc2
  var smc = mc1 + mc2
  var syc = yc1 + yc2 + yc3 + yc4
  var ac = sdc + smc + syc

  var sdb = db1 + db2
  var smb = mb1 + mb2
  var syb = yb1 + yb2 + yb3 + yb4
  var ab = sdb + smb + syb

  var DRsdc = Math.floor(sdc / 10) == 0 ? sdc : Math.floor(sdc / 10) + sdc % 10
  var DRsmc = Math.floor(smc / 10) == 0 ? smc : Math.floor(smc / 10) + smc % 10
  var DRsyc = Math.floor(syc / 10) == 0 ? syc : Math.floor(syc / 10) + syc % 10
  var DRac = Math.floor(ac / 10) == 0 ? ac : Math.floor(ac / 10) + ac % 10

  var DRsdb = Math.floor(sdb / 10) == 0 ? sdb : Math.floor(sdb / 10) + sdb % 10
  var DRsmb = Math.floor(smb / 10) == 0 ? smb : Math.floor(smb / 10) + smb % 10
  var DRsyb = Math.floor(syb / 10) == 0 ? syb : Math.floor(syb / 10) + syb % 10
  var DRab = Math.floor(ab / 10) == 0 ? ab : Math.floor(ab / 10) + ac % 10

  var Mc = DRsdc * DRsmc * DRsyc
  var Mc1 = Math.floor(Mc / 100) == 0 ? Mc % 10 : Mc % 100 % 10
  var Mc2 = Math.floor(Mc / 100) == 0 ? Math.floor(Mc / 10) : Math.floor(Mc % 100 / 10) 
  var Mc3 = Math.floor(Mc / 100)

  var Mb = DRsdb * DRsmb * DRsyb
  var Mb1 = Math.floor(Mb / 100) == 0 ? Mb % 10 : Mb % 100 % 10
  var Mb2 = Math.floor(Mb / 100) == 0 ? Math.floor(Mb / 10) : Math.floor(Mb % 100 / 10) 
  var Mb3 = Math.floor(Mc / 100)

  var DRMc = getDigitalRoot(Mc)
  var DRMb = getDigitalRoot(Mb)

  let personal_id: string = 
    sex_as_number.toString() + 
    DRsdb.toString() + 
    DRsmb.toString() + 
    DRsyb.toString() + 
    DRab.toString() + 
    DRsdc.toString() + 
    DRsmc.toString() +
    DRsyc.toString() +
    DRac.toString() +
    DRMc.toString() +
    DRMb.toString()

  let s_first = personal_id.substring(0, 1)
  let s_fifth = personal_id.substring(4, 5)

  let chat_id: string = 
    DRMc.toString() +
    DRac.toString() +
    DRsyc.toString() +
    DRsmc.toString() +
    DRsdc.toString() +
    '-' +
    DRac.toString() +
    s_fifth +
    '-' +
    s_first +
    s_first

  const numbersColletion = client.db().collection('numbers')
  
  await numbersColletion.insertOne({
    user_id: user?._id,
    dc1,
    dc2,
    mc1,
    mc2,
    yc1,
    yc2,
    yc3,
    yc4,
    db1,
    db2,
    mb1,
    mb2,
    yb1,
    yb2,
    yb3,
    yb4,
    sex_as_number,
    age,
    sdc,
    smc,
    syc,
    ac,
    sdb,
    smb,
    syb,
    ab,
    DRsdc,
    DRsmc,
    DRsyc,
    DRac,
    DRsdb,
    DRsmb,
    DRsyb,
    DRab,
    Mc,
    Mc1,
    Mc2,
    Mc3,
    Mb,
    Mb1,
    Mb2,
    Mb3,
    DRMc,
    DRMb,
    personal_id,
    chat_id
  })

  client.close()
  return res.status(RS.SUCCESS_OK).json({
    message:
      'success'
  })
}

export default handler
