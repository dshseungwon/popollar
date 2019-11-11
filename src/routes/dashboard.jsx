// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import BlurOn from "@material-ui/icons/BlurOn";
// core components/views
import Test from "views/Test/Test.jsx";
import Portfolio from "../views/Port/Portfolio";
import Discover from "../views/Discover/Discover";

const dashboardRoutes = [

  {
    path: "/explore",
    sidebarName: "Explore",
    navbarName: "Explore",
    icon: Dashboard,
    component: Test
  },
  {
    path: "/mypoll",
    sidebarName: "My Poll",
    navbarName: "My Poll",
    icon: Person,
    component: Portfolio
  },
  //   path: "/discover",
  //   sidebarName: "Discover",
  //   navbarName: "Discover",
  //   icon: BlurOn,
  //   component: Discover
  // },

  { redirect: true, path: "/", to: "/explore", navbarName: "Redirect" }
];

export default dashboardRoutes;
