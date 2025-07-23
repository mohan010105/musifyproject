import { createBrowserRouter } from "react-router-dom";
import Layout from "../Navbar_Block/Layout";
// import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Resetpass from "../Pages/Resetpass";
import ProfileContainer from "../UserProfile/ProfileContainer";
import Myaccount from "../UserProfile/SidebarPages/Myaccount";
import AddProfile from "../UserProfile/SidebarPages/AddProfile";
import ChangePassword from "../UserProfile/SidebarPages/ChangePassword";
import Settings from "../UserProfile/SidebarPages/Settings";
import UploadPhoto from "../UserProfile/SidebarPages/UploadPhoto";
import AdminContainer from "../Admin/AdminContainer";
import CreateAlbum from "../Admin/AlbumPages/CreateAlbum";
import EditAlbum from "../Admin/AlbumPages/EditAlbum";
import HomeContainer from "../Pages/HomePages/HomeContainer";
import NewReleases from "../Pages/HomePages/HomeSidebarPages/MainPages/NewReleases";
import Playlists from "../Pages/HomePages/HomeSidebarPages/MainPages/Playlists";
import Podcasts from "../Pages/HomePages/HomeSidebarPages/MainPages/Podcasts";
import Radio from "../Pages/HomePages/HomeSidebarPages/MainPages/Radio";
import TopCharts from "../Pages/HomePages/HomeSidebarPages/MainPages/TopCharts";

export let MyMap = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "home",
                element: <HomeContainer/>,
                children: [
                    { path: "newreleases", element: <NewReleases /> },
                    { path: "topcharts", element: <TopCharts/> },
                    { path: "playlists", element: <Playlists /> },
                    { path: "podcasts", element: <Podcasts/> },
                    { path: "radio", element: <Radio/> },
                ],
            },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "resetpass", element: <Resetpass /> },

            {
                path: "profile",
                element: <ProfileContainer />,
                children: [
                    { path: "myaccount", element: <Myaccount /> },
                    { path: "addprofile", element: <AddProfile /> },
                    { path: "changepassword", element: <ChangePassword /> },
                    { path: "uploadphoto", element: <UploadPhoto /> },
                    { path: "settings", element: <Settings /> },
                ],
            },
            {
                path: "admin",
                element: <AdminContainer />,
                children: [
                    { path: "createalbum", element: <CreateAlbum /> },
                    { path: "editalbum", element: <EditAlbum /> }
                ],
            },
        ],
    },
]);
