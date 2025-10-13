'use client';
import { Compass, MapPin, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const NavItems:NavItem[] = [
    { name: "MY TRIPS", href: "/", icon: MapPin },
    { name: "EXPLORE", href: "/explore", icon: Compass },
    { name: "PROFILE", href: "/profile", icon: User },
]

const Navbar = () => {
    const current_path = usePathname();

    // Refs to measure container and each nav item for cursor positioning
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [cursorLeft, setCursorLeft] = useState<number>(0);

    const activeIndex = useMemo(
        () => Math.max(0, NavItems.findIndex((i) => i.href === current_path)),
        [current_path]
    );

    const hiddenNavPaths = ["/login", "/register", "/profile/edit", "/trips/create"];

    useEffect(() => {
        const updateCursor = () => {
            const container = containerRef.current;
            const activeEl = itemRefs.current[activeIndex] ?? null;
            if (!container || !activeEl) return;

            const containerRect = container.getBoundingClientRect();
            const itemRect = activeEl.getBoundingClientRect();

            const cursorSize = 64; // tailwind h-16 w-16 => 4rem => ~64px
            const centerX = itemRect.left + itemRect.width / 2;
            const left = centerX - containerRect.left - cursorSize / 2;
            setCursorLeft(left);
        };

        // Use requestAnimationFrame to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            updateCursor();
        }, 0);

        window.addEventListener('resize', updateCursor);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateCursor);
        };
    }, [activeIndex]);

    if (hiddenNavPaths.some(path => current_path.startsWith(path))) return null;
    return (
        <nav className={`flex-row gap-4 fixed bottom-4 w-[90%] mx-auto left-0 right-0 text-secondary flex items-center justify-between z-10`}>
            <div ref={containerRef} className="relative mx-auto bg-primary w-full rounded-full">
                <div className="flex items-center justify-center gap-6 h-16 w-full pb-4 pt-2 text-white">
                    { NavItems.map((item, index) => (
                        <div
                            key={item.name}
                            id={item.href}
                            ref={(el) => { itemRefs.current[index] = el; }}
                            className={`flex z-10 ${current_path === item.href ? "text-secondary" : "text-white"} transition-all duration-150`}
                        >
                            <Link href={item.href} className="flex flex-col min-w-12 max-w-12 items-center justify-center text-sm transition-all duration-150">
                                <item.icon className="h-6 w-6 mb-1" />
                                <span className={`text-xs truncate transition-all duration-300 ease-in-out overflow-hidden ${current_path === item.href ? "max-h-6 opacity-100" : "max-h-0 opacity-0"}`}>{item.name}</span>
                            </Link>
                        </div>
                    )) }
                </div>
                <div
                    key={'cursor'}
                    className="absolute w-16 h-16 bg-transparent bottom-4 pointer-events-none z-0 transition-all duration-300 ease-out"
                    style={{ left: `${cursorLeft}px` }}
                >
                    <img src="/cursor.svg" alt="cursor" className="w-full h-full object-contain" />
                </div>
            </div>
            <div>
                <Link href="/trips/create">
                    <button className="bg-primary p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Plus className="text-secondary" />
                    </button>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
