"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trip } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    CalendarDays,
    Heart,
    MapPin,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type DateLike = string | Date | number;

export interface TripCardProps {
trip: Trip;
imageUrl: string;
favorite?: boolean;
defaultFavorite?: boolean;
onFavoriteToggle?: (next: boolean) => void;
onAction?: () => void
className?: string;
showAction?: boolean;
}

function formatDate(d: DateLike) {
const date = d instanceof Date ? d : new Date(d);
return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
});
}

export default function TripCard({
    trip,
    imageUrl,
    favorite,
    defaultFavorite,
    onFavoriteToggle,
    onAction,
    showAction = true,
    className,
    }: TripCardProps) {
    const isControlled = typeof favorite === "boolean";
    const [internalFav, setInternalFav] = useState<boolean>(defaultFavorite ?? false);
    const fav = isControlled ? (favorite as boolean) : internalFav;

    const dateRange = useMemo(
        () => `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`,
        [trip.startDate, trip.endDate]
    );

    const toggleFav = () => {
        const next = !fav;
        if (!isControlled) setInternalFav(next);
        onFavoriteToggle?.(next);
    };

    return (
        <Link href={`/trips/${trip.id}`}>
        <Card
        className={cn(
            "relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm",
            "dark:border-zinc-800 dark:bg-zinc-900",
            className
        )}
        >
            <div className="p-2 pb-0">
                <div className="relative overflow-hidden rounded-2xl">
                <AspectRatio ratio={16 / 9}>
                    <Image
                    src={imageUrl}
                    alt={trip.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 480px, 100vw"
                    priority={false}
                    />
                </AspectRatio>

                <button
                    type="button"
                    aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                    onClick={toggleFav}
                    className={cn(
                    "absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full",
                    "backdrop-blur bg-black/20 ring-1 ring-white/70 text-white",
                    "transition hover:bg-black/30"
                    )}
                >
                    <Heart
                    className={cn("h-4 w-4 drop-shadow", fav && "fill-current")}
                    />
                </button>
                </div>
            </div>
            <div className={`w-full flex flex-row items-center p-4 pb-6 ${showAction ? "justify-between":"justify-start"}`}>
                <div className="w-full">
                    <h3 className="text-base font-bold leading-6 text-zinc-900 dark:text-zinc-100">
                    {trip.title}
                    </h3>

                    <div className="mt-2 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">
                                {trip.destination && trip.destination.city && trip.destination.country
                                    ? `${trip.destination.city}, ${trip.destination.country}`
                                    : "unknown range"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>{dateRange}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{trip.travelers} Traveler{trip.travelers === 1 ? "" : "s"}</span>
                        </div>
                    </div>
                </div>

                <Button
                    size="icon"
                    onClick={onAction}
                    className={cn(
                    "h-16 w-16 rounded-full",
                    "bg-[#8E2C5A] text-white shadow-lg hover:bg-[#7e2750]",
                    !showAction && "hidden"
                    )}
                >
                    <ArrowRight className="h-6 w-6" />
                </Button>
            </div>
        </Card>
        </Link>
    );
}
