// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import PockBase from 'pocketbase'
import type {Record} from 'pocketbase'
const jwt = require("jsonwebtoken");
import Cookie from 'cookie'

const pb = new PockBase("http://localhost:8090");

type Data = {
    success:boolean,
    id?:string
}

export default async function verify(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    try {
        const jsonBody = JSON.parse(req.body)
        const token = jsonBody.token;

        const session = await pb.collection('sessions').getFirstListItem(`token = "${token}"`,{});
        const s = JSON.parse(JSON.stringify(session))
        
        const expires = new Date(s.expires);
        const now = new Date();
        if(expires.getTime() < now.getTime()){
            pb.collection('sessions').delete(session.id,{});
            res.setHeader('Set-Cookie', Cookie.serialize("authtoken", token,{
                httpOnly:true,
                sameSite:'strict',
                expires: new Date(0),
                path: '/'
            }))
            return res.status(400).json({ success: false })
        }
        
        return res.status(200).json({ success: true, id: s.userId })
    } catch (error:any) {
        return res.status(400).json({ success: false })
    }
}
