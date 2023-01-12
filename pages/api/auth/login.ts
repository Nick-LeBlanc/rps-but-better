// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import PockBase from 'pocketbase'
import type {Record} from 'pocketbase'
const jwt = require("jsonwebtoken");
import Cookie from 'cookie'

const pb = new PockBase("http://localhost:8090");

type Data = {
    success?:string,
    error?: string
}

export default async function Login(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    try {
        const jsonBody = JSON.parse(req.body)
        const username = jsonBody.username;
        const password = jsonBody.password;

        const user = await pb.collection('users').authWithPassword(username, password,{},{});
        const token = jwt.sign({ 
            id:user.record.id,

        }, process.env.TOKEN_SECRET);
        
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate()+1);
        await pb.collection('sessions').create({
            token:token,
            userId:user.record.id,
            expires:tomorrow
        },{});
        
        res.setHeader('Set-Cookie', Cookie.serialize("authtoken", token,{
            httpOnly:true,
            sameSite:'strict',
            maxAge:60*60*24,
            path: '/'
        }))
        return res.status(200).json({ success: 'Logged In' })
    } catch (error:any) {
        return res.status(400).json({ error: error })
    }
}
