
import { SyntheticEvent, useState } from "react"

export default function Login() {
    const [username, changeUsername] = useState<string>("");
    const [password, changePassword] = useState<string>("")

    async function handleLogin(e:SyntheticEvent){
        e.preventDefault();
        if(username === "" || password === ""){

        }

        const res = await fetch("api/auth/login", {
            method:'POST',
            body:JSON.stringify({
                username:username,
                password:password
            })
        })
        
        console.log(await res.json())
        changeUsername("")
        changePassword("")

    }

    return(
      <form onSubmit={handleLogin}>
        <span>Username: </span>
            <input type="text" onChange={(e)=>changeUsername(e.target.value)} value={username}/>
        <br />
        <span>Password: </span>
            <input type="text" onChange={(e)=>changePassword(e.target.value)} value={password}/>
        <br />
            <input type='submit' value='Log In'/>
        <button>Sign Up</button>
    </form>
    )
  }