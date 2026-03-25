import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './pages/LoginPage.jsx'
import AddCustomer from './pages/AddCustomer.jsx'
import AddAdmin from './pages/AddAdmin.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

let root = createRoot(document.getElementById('root'));

export function login(){
  root.render(
  <StrictMode>
    <LoginPage/>
    <button onClick={()=>AddCust()}>Add Customer</button>
    <button onClick={()=>AddAdministrator()}>Add Administrator</button>
  </StrictMode>)
}

function AddCust(){
  root.render(
    <StrictMode>
      <AddCustomer/>
      <button onClick={()=>login()}>Return to Login</button>
    </StrictMode>
  )
}

function AddAdministrator(){
  root.render(
    <StrictMode>
      <AddAdmin/>
      <button onClick={()=>login()}>Return to Login</button>
    </StrictMode>
  )
}

export function CustomerDash(){
  root.render(
    <StrictMode>
      <UserDashboard/>
    </StrictMode>
  )

}

export function AdminDash(){
  root.render(
    <StrictMode>
      <AdminDashboard/>
    </StrictMode>
  )

}

login();