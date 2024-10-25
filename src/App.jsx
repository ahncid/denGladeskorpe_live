import { useRoutes, Navigate} from "react-router-dom";
import { useAuth } from "./hooks/useAuth"; 

// Common Pages.
import HomePage from "./pages/home/HomePage";
import Navigation from "./components/common/Navigation/Navigation";
import Footer from "./components/common/Footer/Footer";
import DetailsPage from "./pages/details/DetailsPage";
import BasketPage from "./pages/basket/BasketPage";
import EmployeePage from "./pages/employees/EmployeePage";
import ContactPage from "./pages/contact/ContactPage";

// BackOffice Pages.
import SignInPage from "./pages/backoffice/signin/SignInPage";
import BackOfficePage from "./pages/backoffice/BackOfficePage";
import BackOfficeEmployeePage from "./pages/backoffice/employees/BackOfficeEmployeePage";
import BackOfficeMessagesPage from "./pages/backoffice/messages/BackOfficeMessagesPage";
import BackOfficeOrdersPage from "./pages/backoffice/orders/BackOfficeOrdersPage";
import BackOfficeDishesPage from "./pages/backoffice/dishes/BackOfficeDishesPage";


const App = () => {
  const { signedIn } = useAuth(); 
  const isBackoffice = location.pathname.startsWith("/backoffice"); 


  const routes = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/details/:id",
      element: <DetailsPage />,
    },
    {
      path: "/employees",
      element: <EmployeePage />,
    },
    {
      path: "/contact",
      element: <ContactPage />,
    },
    {
      path: "/basket",
      element: <BasketPage />,
    },
    // Beskyttede backoffice routes
    {
      path: "/backoffice",
      element: signedIn ? <BackOfficePage /> : <Navigate to="/backoffice/signin" />, 
    },
    {
      path: "/backoffice/employees",
      element: signedIn ? <BackOfficeEmployeePage /> : <Navigate to="/backoffice/signin" />, 
    },
    {
      path: "/backoffice/signin",
      element: <SignInPage/>, 
    },
    {
      path: "/backoffice/dishes",
      element: signedIn ? <BackOfficeDishesPage/> : <Navigate to="/backoffice/signin" />, 
    },
    {
      path: "/backoffice/messages",
      element: signedIn ? <BackOfficeMessagesPage/> : <Navigate to="/backoffice/signin" />, 
    },
    {
      path: "/backoffice/orders",
      element: signedIn ? <BackOfficeOrdersPage/> : <Navigate to="/backoffice/signin" />, 
    },
    {
      path: "*",
      element: <div>NOT 404 FOUND</div>,
    },
  ]);

  return (
    <>
    <div>
        {!isBackoffice && <Navigation />} 
        <div className="globale-page-wrapper">{routes}</div>
        <Footer />
      </div>
    </>
  );
};

export default App;
