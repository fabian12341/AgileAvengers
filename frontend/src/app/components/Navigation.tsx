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
    <nav className="relative flex items-center justify-between p-4 bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/Home">
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
        <Link href="/Home">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Home
          </Button>
        </Link>
        <Link href="/Upload">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Uploads
          </Button>
        </Link>
        <Link href="/Reports">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Reports
          </Button>
        </Link>
        <Link href="/User">
          <UserCircle
            size={24}
            className="text-white mx-auto mt-2"
            data-testid="user-circle-desktop"
          />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        data-testid="menu-button"
        aria-label="Toggle menu"
      >
        <Menu size={24} className="text-white" data-testid="menu-icon" />
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 right-4 z-[100] bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-2 md:hidden min-w-[150px]">
          <Link
            href="/Home"
            className="block px-6 py-3 rounded text-white hover:text-gray-300 hover:bg-gray-700 w-full text-left"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/Upload"
            className="block px-6 py-3 rounded text-white hover:text-gray-300 hover:bg-gray-700 w-full text-left"
            onClick={() => setIsOpen(false)}
          >
            Uploads
          </Link>
          <Link
            href="/Reports"
            className="block px-6 py-3 rounded text-white hover:text-gray-300 hover:bg-gray-700 w-full text-left"
            onClick={() => setIsOpen(false)}
          >
            Reports
          </Link>
          <Link
            href="/User"
            className="flex justify-center items-center p-3 rounded text-white hover:text-gray-300 hover:bg-gray-700 w-full"
            onClick={() => setIsOpen(false)}
          >
            <UserCircle size={24} data-testid="user-circle-mobile" />
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
