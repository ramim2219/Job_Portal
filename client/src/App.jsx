import React, { useContext } from 'react'
import {Route , Routes} from 'react-router-dom'
import ApplyJob from './pages/ApplyJob';
import Home from './pages/Home';
import Application from './pages/Application';
import RecruiterLogin from './components/RecruiterLogin';
import { AppContext } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import ManageJobs from './pages/ManageJobs';
import Addjob from './pages/Addjob';
import ViewApplication from './pages/ViewApplication';
const App = () => {
  const {showRecruiterLogin}= useContext(AppContext);
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/apply-job/:id' element={<ApplyJob/>} />
        <Route path='/applications' element={<Application/>} />
        {<Route path='/dashboard' element={<Dashboard />}>
          <Route path='manage-jobs' element={<ManageJobs />}  />
          <Route path='add-jobs' element={<Addjob />}  />
          <Route path='view-applications' element={<ViewApplication/>}  />
        </Route>}
      </Routes>
    </div>
  )
}
export default App