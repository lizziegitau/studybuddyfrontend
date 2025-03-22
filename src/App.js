import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './protectedRoute';
import Layout from './layout';
import SignUp from './authentication/signUp';
import SignUpVerification from './authentication/signUpVerify';
import LogIn from './authentication/logIn';
import SSOCallback from './authentication/ssoCallback';
import Dashboard from './dashboard/dashboard';
import Profile from './account/profile';
import FlashCards from './flashcards/flashcards';
import Planner from './planner/planner';
import Timer from './timer/timer';
import Tasks from './tasks/tasks';
import NotFoundPage from './components/404Page';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/verify-signup" element={<SignUpVerification />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/sso-callback" element={<SSOCallback />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/flashcards" element={<FlashCards />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/account" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
