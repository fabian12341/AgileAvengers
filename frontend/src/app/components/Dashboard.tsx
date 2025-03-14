import React from "react";
import Card, { CardContent } from "./ui/card";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mt-6">Welcome, Agent</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="bg-gray-800 p-4 rounded-lg shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold">Total Calls</h3>
            <p className="text-2xl">2,200</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 p-4 rounded-lg shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold">Sentiment Score</h3>
            <p className="text-2xl">86</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 p-4 rounded-lg shadow-md">
          <CardContent>
            <h3 className="text-lg font-semibold">Average Call Length</h3>
            <p className="text-2xl">4:32</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
