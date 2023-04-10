// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

const STATUS_SUCCESS = 200

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(STATUS_SUCCESS).json({
    name: 'John Doe',
  })
}
