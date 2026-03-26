import {login} from '../main'

function AdminDashboard({username}){
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {username}.</p>
      <button onClick={()=>login()}>Back to Login</button>
    </div>
  );
}

export default AdminDashboard;