// // layout/RootLayout.jsx (Public pages — with Navbar & Footer)
// // import { Outlet } from 'react-router-dom';
// // import Navbar from './NavBarComponent';
// // import Footer from './FooterComponent';
// // import NavbarHaveAcc from './NavbarHaveAcc';

// // const RootLayout = () => {
// //   return (
// //     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
// //       <header className="sticky top-0 z-50">
// //         <Navbar />
// //       </header>

// //       <main className="flex-grow">
// //         <Outlet />
// //       </main>

// //       <footer className="mt-auto">
// //         <Footer />
// //       </footer>
// //     </div>
// //   );
// // };

// // export default RootLayout;

// // layout/RootLayout.jsx

// import { Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import Navbar from './NavBarComponent';
// import NavbarHaveAcc from './NavbarHaveAcc';
// import Footer from './FooterComponent';

// const RootLayout = () => {
//   const user = useSelector((state) => state.auth.user);

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
//       <header className="sticky top-0 z-50">
//         {user ? <Navbar /> : <NavbarHaveAcc />}
//       </header>

//       <main className="flex-grow">
//         <Outlet />
//       </main>

//       <footer className="mt-auto">
//         <Footer />
//       </footer>
//     </div>
//   );
// };

// export default RootLayout;

import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './NavBarComponent';
import NavbarHaveAcc from './NavbarHaveAcc';
import Footer from './FooterComponent';

const RootLayout = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-50">
        {token ? <NavbarHaveAcc /> : <Navbar />}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default RootLayout;