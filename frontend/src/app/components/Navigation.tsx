"use client";
import React, { useState } from "react";
import Button from "./ui/button";
import { UserCircle, Menu } from "lucide-react";
import Image from "next/image";
import myLogo from "./ui/assets/NEORISlogolight.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center">
        <Image src={myLogo} alt="Logo" width={100} height={40} />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4">
        <Button variant="ghost" className="text-white hover:text-gray-300">
          Home
        </Button>
        <Button variant="ghost" className="text-white hover:text-gray-300">
          Uploads
        </Button>
        <Button variant="ghost" className="text-white hover:text-gray-300">
          Reports
        </Button>
        <UserCircle size={24} className="text-white" />
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        <Menu size={24} className="text-white" />
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 right-4 bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-2 md:hidden">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Home
          </Button>
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Uploads
          </Button>
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Reports
          </Button>
          <UserCircle size={24} className="text-white mx-auto mt-2" />
        </div>
      )}
    </nav>
  );
};

export default Navigation;
