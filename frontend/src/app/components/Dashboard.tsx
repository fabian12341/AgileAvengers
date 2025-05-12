// components/Dashboard.tsx
"use client";
import React, { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  const [dashboardURL, setDashboardURL] = useState<string>(
    "https://lookerstudio.google.com/embed/reporting/db935019-a2d3-4196-86fb-b19bd5d9fe0b/page/PA8FF" // default desktop
  );

  const updateDashboardURL = () => {
    const isMobile = window.innerWidth < 768;
    const mobileURL =
      "https://lookerstudio.google.com/embed/reporting/108aef0b-9c46-4ace-bbdc-2f8b693f72da/page/PA8FF"; // dashboard móvil
    const desktopURL =
      "https://lookerstudio.google.com/embed/reporting/db935019-a2d3-4196-86fb-b19bd5d9fe0b/page/PA8FF"; // dashboard escritorio

    setDashboardURL(isMobile ? mobileURL : desktopURL);
  };

  useEffect(() => {
    updateDashboardURL();
    window.addEventListener("resize", updateDashboardURL);
    return () => window.removeEventListener("resize", updateDashboardURL);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-80px)] md:h-auto md:pt-[56.25%] relative">
      <iframe
        data-testid="dashboard-iframe"
        className="absolute top-0 left-0 w-full h-full"
        src={dashboardURL}
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  );
};

export default Dashboard;
