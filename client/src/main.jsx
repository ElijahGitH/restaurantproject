import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './pages/LoginPage.jsx'
import AddCustomer from './pages/AddCustomer.jsx'
import AddAdmin from './pages/AddAdmin.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Navbar from './components/NavBar.jsx'
import Menu from './pages/Menu.jsx'

let root = createRoot(document.getElementById('root'));



/*console.log(signedIn);*/
export function login(){
  root.render(
  <StrictMode>
    <LoginPage/>
  </StrictMode>)
}

export function AddCust(){
  root.render(
    <StrictMode>
      <AddCustomer/>
    </StrictMode>
  )
}

export function AddAdministrator(){
  root.render(
    <StrictMode>
      <AddAdmin/>
    </StrictMode>
  )
}

export function CustomerDash(username){
  root.render(
    <StrictMode>
      <UserDashboard username = {username}/>
    </StrictMode>
  )

}

export function AdminDash(username){
  root.render(
    <StrictMode>
      <AdminDashboard username={username}/>
    </StrictMode>
  )

}

export function showMenu(username){
  root.render(
    <StrictMode>
      <Menu username = {username}/>
    </StrictMode>
  )
}

login();