import './App.css';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserStore } from './store/Userstroe.jsx';

import { Layout } from './pages/Layout';
import HomePage from './Components/MainBox';
import Discussion from './Components/Disscusiono';
import Directory from './Components/Directory';
import Notes from './Components/Notes';
import Signup from './pages/Signup';
import Login from './pages/login';
import Loading from './pages/Loading.jsx';
import Collaborative from './Components/Collaborative.jsx';
import ProfilePage from './pages/profilepage.jsx';
import { ToastContainer } from 'react-toastify';
import AllDir from './Components/AllDir.jsx';
import Alluser from './Components/Alluser.jsx';

// export default function App() {
//   const { user, checkAuth, initializeUser, loading } = UserStore();

//   useEffect(() => {
//     // ✅ CRITICAL: Initialize user from localStorage first
//     initializeUser();
    
//     // ✅ Then check auth with backend
//     checkAuth();
//   }, [checkAuth, initializeUser]);

//   // ✅ Show loading screen while checking auth
//   if (loading) return <Loading />;

//   // return (
//   //   <div className="dark min-h-screen bg-background text-foreground">
//   //     <BrowserRouter>
//   //       <ToastContainer 
//   //         position="top-right"
//   //         autoClose={3000}
//   //         hideProgressBar={false}
//   //         newestOnTop={true}
//   //         closeOnClick
//   //         rtl={false}
//   //         pauseOnFocusLoss
//   //         draggable
//   //         pauseOnHover
//   //       />
        
//   //       <Routes>
//   //         {/* ✅ Public Routes - Only accessible when NOT logged in */}
//   //         <Route
//   //           path="/login"
//   //           element={!user ? <Login /> : <Navigate to="/" replace />}
//   //         />
//   //         <Route
//   //           path="/signup"
//   //           element={!user ? <Signup /> : <Navigate to="/" replace />}
//   //         />

//   //         {/* ✅ Protected Routes - Only accessible when logged in */}
//   //         {user && (
//   //           <>
//   //             <Route path="/" element={<Layout />}>
//   //               <Route index element={<HomePage />} />
//   //               <Route path="post" element={<Discussion />} />
//   //               <Route path="dir" element={<Directory />} />
//   //               <Route path="notes" element={<Notes />} />
//   //               <Route path="collab" element={<Collaborative />} />
//   //             </Route>
//   //             <Route path="/profile/:id" element={<ProfilePage />} />
//   //           </>
//   //         )}

//   //         {/* ✅ Redirect all unknown routes appropriately */}
//   //         <Route
//   //           path="*"
//   //           element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
//   //         />
//   //       </Routes>
//   //     </BrowserRouter>
//   //   </div>
//   // );

// }
export default function App() {
  const { user, checkAuth, initializeUser, loading } = UserStore();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      // restore local user first (sync)
      initializeUser();
      // then verify with backend (async)
      await checkAuth();
      if (mounted) setReady(true);
    };
    init();
    return () => {
      mounted = false;
    };
  }, [initializeUser, checkAuth]);

  return (
    <>
      {/* 👇 ToastContainer must stay OUTSIDE all conditionals */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* 👇 Now loading cannot hide ToastContainer */}
      {(!ready || loading) ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-background text-foreground">
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" replace />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" replace />}
              />

              {user && (
                <>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="post" element={<Discussion />} />
                    <Route path="dir" element={<Directory />} />
                    <Route path="collab" element={<Collaborative />} />
                                      <Route path="/notes/:id" element={<Notes />} />
                                      <Route path="/alldir" element={<AllDir></AllDir>}/>
                                       <Route path="/allusers" element={<Alluser></Alluser>}/>
                  </Route>
                  <Route path="/profile/:id" element={<ProfilePage />} />

                </>
              )}

              <Route
                path="*"
                element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
              />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}
