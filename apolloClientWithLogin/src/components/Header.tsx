import {
  NavLink,
  useHistory
} from "react-router-dom";

import { makeClient } from "./App"

type addHeaderProps = {
  isLoggedIn: boolean
  loginMsg: string
  setLoginStatus: Function
}

export default function Header({ isLoggedIn, loginMsg, setLoginStatus }: addHeaderProps) {
  const logOut = () => {
    localStorage.removeItem("base64AuthString")
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    setLoginStatus(false)
    makeClient()
  }
  console.log("isLoggedIn", isLoggedIn, loginMsg)
  const history = useHistory()
  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-3 pb-0 px-md- mb-4 bg-white border-bottom shadow-sm">
      <div className="h5 my-0 me-md-auto fw-normal">
        <ul className="header" style={{ marginBottom: 10 }}>
          <li>
            <NavLink exact activeClassName="selected" to="/">Home</NavLink>
          </li>
          <li>
            <NavLink exact activeClassName="selected" to="/allFriends">All Friends</NavLink>
          </li>
          <li>
            <NavLink exact activeClassName="selected" to="/findFriend">Find Friend</NavLink>
          </li>
          <li>
            <NavLink exact activeClassName="selected" to="/addFriend">Add Friend</NavLink>
          </li>
        </ul>
      </div>
      <nav className="my-2 my-md-0 me-md-3"></nav>
      <div>
        {isLoggedIn && <p style={{ marginRight: 15 }}> User: {localStorage.getItem("user")} ({localStorage.getItem("role")}) </p>}
      </div>
      <div>
        {!isLoggedIn && <button className="btn btn-dark" onClick={(event: React.MouseEvent<HTMLElement>) => { history.push("/login") }}>Login</button>}
        {isLoggedIn && <button className="btn btn-secondary" onClick={(event: React.MouseEvent<HTMLElement>) => logOut()}>Logout</button>}
      </div>
    </div>
  )
}