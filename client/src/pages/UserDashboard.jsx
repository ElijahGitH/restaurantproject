import {login, showMenu} from '../main'

function UserDashboard({username}) {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>User Dashboard</h1>
      <p>Welcome, {username}.</p>
      <button onClick={()=>showMenu(username)}>Show Food Menu</button>
      <button onClick={()=>login()}>Back to Login</button>
    </div>
  );
}

export default UserDashboard;