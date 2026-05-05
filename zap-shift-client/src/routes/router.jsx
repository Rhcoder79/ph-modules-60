import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import Coverage from "../pages/Coverage/Coverage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "./PrivateRoute";
import Rider from "../pages/Rider/Rider";
import SendParcel from "../pages/Home/sendParcel/SendParcel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentSuccss from "../pages/Dashboard/Payment/PaymentSuccss";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";

export const router = createBrowserRouter([
  {
    path: "/",
   Component:RootLayout,
   children:[
    {
        index:true,
        Component:Home
    },
    {
path:'rider',
element:<PrivateRoute><Rider></Rider> </PrivateRoute>
    },
    {
    path:'send-parcel',
    element:<PrivateRoute><SendParcel></SendParcel></PrivateRoute> , 
    loader:()=>fetch('/serverCenter.json').then(res=>res.json())

    }
    ,
    {
      path:'coverage',
      Component:Coverage,
      loader:()=>fetch('/serverCenter.json').then(res=>res.json())
    }
   ]
  },
  {
    path:'/',
    Component:AuthLayout,
    children:[
      {
        path:'login',
        Component:Login
      },
      {
        path:'register',
        Component:Register
      }
    ]
  },
  {
   path:'dashboard',
   element:<PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
   children:[
    {
      path:'my-parcels',
      Component:MyParcels
    },
    {
     path:'payment/:parcelId',
Component:Payment
    },
    {
    path:'payment-success',
    Component:PaymentSuccss
    },
    {
      path:'payment-cancelled',
      Component:PaymentCancelled
    }
   ] 
  }
]);