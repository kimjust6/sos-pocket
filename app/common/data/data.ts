import React from "react";
import { AiFillHome } from "react-icons/ai";
import { BsFillBagFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { GiConverseShoe } from "react-icons/gi";
import { GoPasskeyFill } from "react-icons/go";
import { ImProfile } from "react-icons/im";
import { MdSpaceDashboard } from "react-icons/md";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";

// top navigation bar
export const navbarItemsGuest = [
  // {
  //   name: "Login",
  //   link: "/profile",
  //   key: "0619108817",
  // },
  // {
  //   name: "New Resole",
  //   link: "/resole-form",
  //   key: "7240448762",
  // },
];

export const navbarItemsUser = [
  // {
  //   name: "New Resole",
  //   link: "/resole-form",
  //   key: "7240448762",
  // },
];

// left side bar (admin)
export const adminSidebarItems = [
  { name: "Store", link: "/store", icon: React.createElement(AiFillHome) },
  {
    name: "Dashboard",
    link: "/admin/dashboard",
    icon: React.createElement(MdSpaceDashboard),
  },
  {
    name: "Products",
    link: "/admin/manage-products",
    icon: React.createElement(BsFillBagFill),
  },
  {
    name: "Users",
    link: "/admin/manage-users",
    icon: React.createElement(FaUser),
  },
];

// left side bar (user)
export const userSidebarItems = [
  { name: "Store", link: "/store", icon: React.createElement(AiFillHome) },
  { name: "Profile", link: "/profile", icon: React.createElement(FaUser) },
  {
    name: "My Orders",
    link: "/orders",
    icon: React.createElement(GiConverseShoe),
  },
  {
    name: "New Resole",
    link: "/resole-form",
    icon: React.createElement(TbSquareRoundedPlusFilled),
  },
];
// left side bar (user)
export const guestSidebarItems = [
  { name: "Store", link: "/store", icon: React.createElement(AiFillHome) },
  {
    name: "Login",
    link: "/auth/login",
    icon: React.createElement(GoPasskeyFill),
  },
  {
    name: "Register",
    link: "/auth/register",
    icon: React.createElement(ImProfile),
  },
  {
    name: "New Resole",
    link: "/resole-form",
    icon: React.createElement(TbSquareRoundedPlusFilled),
  },
];

// Columns for the initial admin dashboard desktop view
export const desktopAdminDashboardOrderTable = [
  { name: "Order No." },
  { name: "Name" },
  { name: "Status" },
  { name: "Email" },
  { name: "Phone" },
  { name: "Shoes" },
  { name: "Order Date" },
];

export const mobileAdminDashboardOrder = [
  { name: "Order No." },
  { name: "Shoes" },
  { name: "Status" },
  { name: "Order Date" },
];

export const adminDashboardOrderColsDetails = [
  { name: "Order No." },
  { name: "Status" },
  { name: "Email" },
  { name: "Phone" },
  { name: "Shoes" },
  { name: "Order Date" },
];

export const adminDashboardTabs = [
  { name: "View Orders" },
  { name: "Dashboard" },
];

export const provinces = [
  { name: "Alberta", code: "AB" },
  { name: "British Columbia", code: "BC" },
  { name: "Manitoba", code: "MB" },
  { name: "New Brunswick", code: "NB" },
  { name: "Newfoundland", code: "NL" },
  { name: "Northwest Territories", code: "NT" },
  { name: "Nova Scotia", code: "NS" },
  { name: "Nunavut", code: "NU" },
  { name: "Ontario", code: "ON" },
  { name: "Prince Edward Island", code: "PE" },
  { name: "Quebec", code: "QC" },
  { name: "Saskatchewan", code: "SK" },
  { name: "Yukon", code: "YT" },
];

export const shoeManufacturers = [
  { name: "Black Diamond" },
  { name: "Evolv" },
  { name: "Five Ten" },
  { name: "La Sportiva" },
  { name: "Madrock" },
  { name: "Scarpa" },
  { name: "Tenaya" },
  { name: "Other" },
];

export const resoleServices = [
  { name: "Resole" },
  { name: "Resole + Rand Repair" },
];

export const footerItems = [
  {
    name: "company",
    items: [
      { name: "About Us", link: "/about" },
      { name: "Contact Us", link: "/contact" },
      { name: "FAQ", link: "/faq" },
    ],
  },
  {
    name: "socials",
    items: [
      { name: "Mail", link: "mailto:" },
      {
        name: "Twitter",
        link: "https://www.facebook.com/Resole-100105232277163",
      },
      { name: "Instagram", link: "https://www.instagram.com/resole.ca/" },
    ],
    contact: [{ name: "Email", link: "mailto:" }],
  },
  {
    name: "policies",
    items: [
      { name: "Privacy Policy", link: "/privacy-policy" },
      { name: "Terms of Service", link: "/terms-of-service" },
      { name: "Shipping Policy", link: "/shipping-policy" },
    ],
  },
];
