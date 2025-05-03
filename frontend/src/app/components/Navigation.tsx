"use client";
import React, { useState } from "react";
import Link from "next/link";
import Button from "./ui/button";
import { UserCircle, Menu } from "lucide-react";
import Image from "next/image";
import myLogo from "./ui/assets/NEORISlogolight.png";

interface Props {
  name: string;
  role: string;
  id_team: string;
}

const Navigation = ({ name, role, id_team }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const query = `?name=${encodeURIComponent(name)}&role=${encodeURIComponent(
    role
  )}&id_team=${encodeURIComponent(id_team)}`;

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center">
        <Link href={`/Home${query}`}>
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
        <Link href={`/Home${query}`}>
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Home
          </Button>
        </Link>
        <Link href={`/Upload${query}`}>
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Uploads
          </Button>
        </Link>
        <Link href={`/Reports${query}`}>
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Reports
          </Button>
        </Link>
        <Link href={`/User${query}`}>
          <UserCircle
            size={24}
            className="text-white mx-auto mt-2"
            data-testid="user-circle-mobile"
          />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="menu-button"
      >
        <Menu size={24} className="text-white" data-testid="menu-icon" />
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 right-4 bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-2 md:hidden">
          <Link href={`/Home${query}`}>
            <Button variant="ghost" className="text-white hover:text-gray-300">
              Home
            </Button>
          </Link>
          <Link href={`/Upload${query}`}>
            <Button variant="ghost" className="text-white hover:text-gray-300">
              Uploads
            </Button>
          </Link>
          <Link href={`/Reports${query}`}>
            <Button variant="ghost" className="text-white hover:text-gray-300">
              Reports
            </Button>
          </Link>
          <Link href={`/User${query}`}>
            <UserCircle
              size={24}
              className="text-white mx-auto mt-2"
              data-testid="user-circle-mobile"
            />
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
