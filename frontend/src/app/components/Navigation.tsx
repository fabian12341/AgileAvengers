"use client";
import React, { useState } from "react";
import Link from "next/link";
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
        <Link href="/">
          <Image
            src={myLogo}
            alt="Logo"
            width={100}
            height={40}
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4">
        <Link href="/">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Home
          </Button>
        </Link>
        <Link href="/Upload">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Uploads
          </Button>
        </Link>
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
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-gray-300">
              Home
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="ghost" className="text-white hover:text-gray-300">
              Uploads
            </Button>
          </Link>
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
