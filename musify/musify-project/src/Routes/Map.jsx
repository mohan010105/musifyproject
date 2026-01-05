import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicLayout from "../Navbar_Block/PublicLayout";
import AppLayout from "../Navbar_Block/AppLayout";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Resetpass from "../Pages/Resetpass";
import ProfileContainer from "../UserProfile/ProfileContainer";
import MyAccount from "../UserProfile/SidebarPages/MyAccount";
import AddProfile from "../UserProfile/SidebarPages/AddProfile";
import ChangePassword from "../UserProfile/SidebarPages/ChangePassword";
import Settings from "../UserProfile/SidebarPages/Settings";
import UploadPhoto from "../UserProfile/SidebarPages/UploadPhoto";
import AdminContainer from "../Admin/AdminContainer";
import CreateAlbum from "../Admin/AlbumPages/CreateAlbum";
import EditAlbum from "../Admin/AlbumPages/EditAlbum";
import CreateSong from "../Admin/SongPages/CreateSong";
import CreatePodcast from "../Admin/PodcastPages/CreatePodcast";
import HomeContainer from "../Pages/HomePages/HomeContainer";
import NewReleases from "../Pages/NewReleases";
import Playlists from "../UserProfile/MainPages/Playlists";
import Podcasts from "../Pages/HomePages/HomeSidebarPages/MainPages/Podcasts";
import Radio from "../Pages/HomePages/HomeSidebarPages/MainPages/Radio";
import TopCharts from "../Pages/HomePages/HomeSidebarPages/MainPages/TopCharts";
import LikedSongs from "../Pages/LikedSongs";
import History from "../Pages/History";
import Albums from "../Pages/Albums";
import Artists from "../Pages/Artists";
import MyPodcasts from "../Pages/My_Library/Podcasts";
import Payment from "../Pages/Payment";
import PaymentDashboard from "../Admin/PaymentPages/PaymentDashboard";
import PremiumRoute from "../components/PremiumRoute";
import PlaylistDetails from "../Pages/PlaylistDetails";
// import { Podcast } from "lucide-react";

export let MyMap = createBrowserRouter([
    // Public routes (no FooterPlayer)
    {
        path: "/",
        element: <PublicLayout />,
        children: [
            { index: true, element: <Navigate to="/home" replace /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "resetpass", element: <Resetpass /> },
        ],
    },
    // App routes (with FooterPlayer)
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "home",
                element: <HomeContainer/>,
                children: [
                    { index: true, element: <Navigate to="newreleases" replace /> },
                    { path: "newreleases", element: <NewReleases /> },
                    { path: "topcharts", element: <TopCharts/> },
                    { path: "playlists", element: <Playlists /> },
                    { path: "podcasts", element: <Podcasts/> },
                    { path: "radio", element: <Radio/> },
                    { path: "liked", element: <LikedSongs/> },
                    { path: "history", element: <History/> },
                    { path: "albums", element: <Albums/> },
                    { path: "artists", element: <Artists/> },
                    { path: "mypodcasts", element: <MyPodcasts/> },
                    { path: "playlist/:playlistId", element: <PlaylistDetails/> },

                ],
            },
            {
                path: "profile",
                element: <ProfileContainer />,
                children: [
                    { path: "myaccount", element: <MyAccount /> },
                    { path: "addprofile", element: <AddProfile /> },
                    { path: "changepassword", element: <ChangePassword /> },
                    { path: "uploadphoto", element: <UploadPhoto /> },
                    { path: "settings", element: <Settings /> },
                ],
            },
            {
                path: "payment",
                element: <Payment />,
            },
            {
                path: "admin",
                element: <AdminContainer />,
                children: [
                    { index: true, element: <Navigate to="/admin/createalbum" replace /> },

                    { path: "createalbum", element: <CreateAlbum /> },
                    { path: "createsong", element: <CreateSong /> },
                    { path: "editalbum", element: <EditAlbum /> },
                    { path: "createpodcast", element: <CreatePodcast /> },
                    { path: "paymentdashboard", element: <PaymentDashboard /> }
                ],
            },
        ],
    },
]);
