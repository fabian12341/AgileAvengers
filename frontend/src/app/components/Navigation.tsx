"use client";
import React, { useState } from "react";
import Link from "next/link";
import Button from "./ui/button";
import { UserCircle, Menu } from "lucide-react";
import Image from "next/image";
import myLogo from "./ui/assets/NEORISlogolight.png";

interface NavigationProps {
  name?: string;
  role?: string;
  id_team?: string;
}

const Navigation: React.FC<NavigationProps> = ({ name, role, id_team }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-900 text-white">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link href="/Home">
          <Image
            src={myLogo}
            alt="Logo"
            width={100}
            height={40}
            className="cursor-pointer"
          />
        </Link>
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="menu-button"
        >
          <Menu size={24} className="text-white" />
        </button>
      </div>

      <div className={`mt-4 md:mt-0 ${isOpen ? "block" : "hidden"} md:flex gap-4`}>
        <Link href={`/Home?name=${name}&role=${role}&id_team=${id_team}`}>
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Home
          </Button>
        </Link>
        <Link href={`/Upload?name=${name}&role=${role}&id_team=${id_team}`}>
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Uploads
          </Button>
        </Link>
        <Link href={`/User?name=${name}&role=${role}&id_team=${id_team}`}>
          <UserCircle size={24} className="text-white mt-2" />
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
