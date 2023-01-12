
interface userProps{
  user:string
}

export default function Menu({user} :userProps) {

    if(user === "") return<></>;
    return(
      <>
       <div>
          Username:
        </div>
        <div>
          <div>Rank:</div>
          <div>Rating:</div>
        </div>
        <br />
        <button>Find Ranked Match</button>
      </>
    )
  }