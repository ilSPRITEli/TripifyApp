'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppLogo from "../../../public/logo.svg";

const Header = () => {

    const current_path = usePathname();
    const hiddenNavPaths = ["/login", "/register", "/profile/edit", "/trips/create"]
    if (hiddenNavPaths.includes(current_path)) return null;
    return (
        <header className="bg-white text-black shadow-md w-full px-5 py-4 fixed top-0 left-0 z-10 flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-3">
            <Link href="/">
                <Image src={AppLogo} alt="Tripify Logo" className="h-12 w-12" />
            </Link>
            <div>
                <h1 className="text-xl font-bold">Hello, Sprite</h1>
                <p className="text-sm">Welcome to the Tripify App</p>
            </div>
        </div>
        <div>
            <Avatar className="h-12 w-12 aspect-square">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
        </header>
    );
    }

export default Header;
