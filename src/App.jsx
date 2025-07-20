import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/auth';
import ForgotPassword from './pages/forgotpassword';
import ResetPassword from './pages/resetpassword';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import Films from './pages/Films';
import FilmDetails from './pages/FilmDetails';
import Chat from './pages/Chat';
import CinemaPage from './pages/CinemaPage';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Cinemas from './pages/Cinemas';
import Sessions from './pages/Sessions';
import Tickets from './pages/Tickets';
import Articles from './pages/Articles';
import Ratings from './pages/Ratings';
import FilmsA from './pages/FilmsA';

// Layout pour les routes publiques avec Header et Footer
const PublicLayout = () => (
  <>
    <Header />
    <main className="container my-4">
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques avec Header et Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path='/films' element={<Films />} />
          <Route path='/films/:id' element={<FilmDetails />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/cinema' element={<CinemaPage />} />
        </Route>

        {/* Routes admin SANS Header et Footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="films" element={<FilmsA />} />
          <Route path="cinemas" element={<Cinemas />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="articles" element={<Articles />} />
          <Route path="ratings" element={<Ratings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;