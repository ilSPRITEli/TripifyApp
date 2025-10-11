'use client';
import { Compass, MapPin, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const NavItems = [
    { name: "TRIPS", href: "/", icon: MapPin },
    { name: "EXPLORE", href: "/explore", icon: Compass },
    { name: "PROFILE", href: "/profile", icon: User },
]

const Navbar = () => {
    const current_path = usePathname();
    return (
        <nav className="flex flex-row gap-4 absolute bottom-10 w-[90%] mx-auto left-0 right-0 text-secondary">
            <div className="relative mx-auto bg-primary w-full rounded-full">
                <div className="flex items-center justify-center gap-6 h-16 w-full pb-4 pt-2 text-white">
                    { NavItems.map((item) => (
                        <div key={item.name} id={item.href} className={`flex z-10 ${current_path === item.href ? "text-secondary" : "text-white"}`}>
                            <Link href={item.href} className="flex flex-col min-w-12 max-w-12 items-center justify-center text-sm hover:text-white">
                                <item.icon className="h-6 w-6 mb-1" />
                                <span className={`text-xs ${current_path === item.href ? "block" : "hidden"}`}>{item.name}</span>
                            </Link>
                        </div>
                    )) }
                </div>
                <div key={'cursor'} className="absolute w-16 h-16 bg-primary rounded-full bottom-4 left-8 pointer-events-none z-0"/>
            </div>
            <div>
                <button className="bg-primary p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <Plus className="text-secondary" />
                </button>
            </div>
        </nav>
    );
}

export default Navbar;