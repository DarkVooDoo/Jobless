// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
  console.log(req.headers["accept"])
  if(req.headers["accept"] === "application/json"){
    res.setHeader('Cache-Control', `max-age=${60*2}`)
    res.status(200).json({ name: 'John Doe' })
    return
  }
  res.status(403)
}
