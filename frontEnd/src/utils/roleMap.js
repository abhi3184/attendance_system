export const roleMap = {
  "Hr": "hr",
  "Manager": "manager",
  "Employee": "employee",
};

export const roleHomePath = {
  hr: "/home/ppreview",
  employee: "/home/ppreview",
  manager: "/mhome",
};

export const sidebarTabs = [
  //Manger
  { key: "home", path:'mhome', label: "Home", roles: ["manager"], icon: "HomeIcon" },
  { key: "overview", path:'overview', label: "Overview", roles: ["manager"], icon: "UserGroupIcon" },
  { key: "attendance", path:'mattendance', label: "Attendance", roles: ["manager"], icon: "CheckCircleIcon" },
  { key: "manager-leave", path:'mleave', label: "Leave Tracker", roles: ["manager"], icon: "CalendarDaysIcon" },


  //Hr
  { key: "home", path:'hrdashboard', label: "Home", roles: ["hr"], icon: "HomeIcon" },
  { key: "employeemanagement", path:'emanagement', label: "Employee", roles: ["hr"], icon: "UserGroupIcon" },
  { key: "leaverequest", path:'eleave', label: "Leave Tracker", roles: ["hr"], icon: "CalendarDaysIcon" },
  { key: "hrattendance", path:'hattendance', label: "Attendance", roles: ["hr"], icon: "ClockIcon" },
  { key: "holiday", path:'holiday', label: "Holidays", roles: ["hr"], icon: "CalendarIcon" },
  // { key: "payroll", path:'payroll', label: "Payroll", roles: ["hr"], icon: "CurrencyDollarIcon" },

  //Employee
  { key: "home", path:'home', label: "Home", roles: ["employee"], icon: "HomeIcon" },
  { key: "leave", path:'leave',  label: "Leave Tracker", roles: ["employee"], icon: "CalendarDaysIcon" },
  { key: "attendance", path:'attendance', label: "Attendance", roles: ["employee"], icon: "CheckCircleIcon" },
];
