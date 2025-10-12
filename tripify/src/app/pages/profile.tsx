"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  MapPin,
  Globe2,
  Share2,
  Trophy,
  Rocket,
  Mountain,
  Sun,
  Compass,
  Bell,
  Shield,
  Info,
  ChevronRight,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="flex flex-col items-center sm:items-start w-full">
      <header
        className="w-full flex flex-col items-center justify-end gap-4 pt-10 pb-8 px-5"
        style={{
          backgroundImage: 'url("/images/profile_bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Avatar className="h-28 w-28 ring-4 ring-white rounded-full shadow-md">
          <AvatarImage src={""} alt="Profile" />
          <AvatarFallback className="text-3xl">S</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sprite</h1>
          <div className="mt-3 flex items-center justify-center">
            <Badge
              variant="secondary"
              className="rounded-full bg-[#8E2C5A] text-white px-4 py-2 text-sm font-medium"
            >
              <Crown className="h-4 w-4 mr-2" /> World Traveler
            </Badge>
          </div>
        </div>
      </header>

      <section className="w-full px-6 py-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <Stat icon={<MapPin className="h-5 w-5 text-[#8E2C5A]" />} value="120" label={"Trip\nPlanned"} />
          <Stat icon={<Globe2 className="h-5 w-5 text-[#8E2C5A]" />} value="30" label={"Countries\nvisited"} />
          <Stat icon={<Share2 className="h-5 w-5 text-[#8E2C5A]" />} value="201" label={"Trips\nShared"} />
        </div>
      </section>

      <section className="w-full bg-zinc-100/80 dark:bg-zinc-900/40 rounded-t-3xl px-6 pt-6 pb-28 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Achievements</h2>
          <button className="text-primary text-sm font-medium">View All</button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pr-2">
          {[
            <Globe2 key="g" />,
            <Rocket key="r" />,
            <Trophy key="t" />,
            <Mountain key="m" />,
            <Sun key="s" />,
            <Compass key="c" />,
          ].map((IconEl, i) => (
            <div
              key={i}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-white shadow"
            >
              {IconEl}
            </div>
          ))}
        </div>

        <Card className="w-full p-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-[#8E2C5A] grid place-items-center">
              <Trophy />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Your traveler achievements</div>
              <div className="text-sm text-muted-foreground">2 unlocked • 8 to discover</div>
            </div>
            <ChevronRight className="text-muted-foreground" />
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <div className="space-y-3">
            <SettingsItem icon={<Bell className="h-5 w-5" />} label="Notification" />
            <SettingsItem icon={<Shield className="h-5 w-5" />} label="Privacy" />
            <SettingsItem icon={<Info className="h-5 w-5" />} label="About Tripify" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div>{icon}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs leading-tight text-zinc-600 whitespace-pre-line">{label}</div>
    </div>
  );
}

function SettingsItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Card className="w-full p-4 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-full bg-zinc-100 grid place-items-center text-zinc-700">
          {icon}
        </div>
        <div className="flex-1 font-medium">{label}</div>
        <ChevronRight className="text-zinc-400" />
      </div>
    </Card>
  );
}
