'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Activity, Trip } from '@/lib/type';
import { format } from 'date-fns';
import { ArrowLeft, CalendarDays, ExternalLink, MoreVertical, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';


function dayKey(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
}

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params?.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  // Create Activity form state
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    description: '',
    latitude: '',
    longitude: '',
    location: '',
    budget: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/trips/${tripId}`);
        if (!res.ok) throw new Error('Failed to load trip');
        const data = await res.json();
        if (!ignore) setTrip(data.trip);
      } catch (e: unknown) {
        if (!ignore) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (tripId) load();
    return () => { ignore = true; };
  }, [tripId]);

  const days = useMemo(() => {
    if (!trip) return [] as { date: Date; key: string }[];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const result: { date: Date; key: string }[] = [];
    for (
      let d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      d <= end;
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    ) {
      result.push({ date: d, key: dayKey(d) });
    }
    return result;
  }, [trip]);

  const activitiesByDay = useMemo(() => {
    const map: Record<string, Activity[]> = {};
    if (!trip || !trip.activities) return map;
    for (const act of trip.activities) {
      const d = new Date(act.date);
      const key = dayKey(d);
      if (!map[key]) map[key] = [];
      map[key].push(act);
    }
    
    // sort by time ascending within each day (assuming HH:mm)
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [trip]);

  // open first day by default when days are available
  useEffect(() => {
    if (openKeys.length === 0 && days.length > 0) {
      setOpenKeys([days[0].key]);
    }
  }, [days]);

  async function togglePublish(next: boolean) {
    if (!trip) return;
    try {
      const res = await fetch(`/api/trips/${trip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTemplate: next }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setTrip({ ...trip, isTemplate: next });
    } catch (e: unknown) {
      console.error(e instanceof Error ? e.message : e);
    }
  }

  function googleMapsLink(act: Activity) {
    return `https://maps.google.com/?q=${act.latitude},${act.longitude}`;
  }

  function openMaps(act: Activity) {
    const url = googleMapsLink(act);
    window.open(url, '_blank');
  }

  function onChange<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function saveActivity() {
    if (!trip) return;
    setSaving(true);
    try {
      const payload = {
        tripId: trip.id,
        name: form.name,
        description: form.description,
        date: form.date,
        time: form.time,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        location: form.location,
        budget: Number(form.budget || 0),
      };

      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create activity');
      const { activity } = await res.json();
      setTrip({ 
        ...trip, 
        activities: [...(trip.activities ?? []), activity] 
      });
      setShowAdd(false);
      // expand corresponding day
      const key = dayKey(new Date(activity.date));
      setOpenKeys((prev) => Array.from(new Set([...(prev || []), key])));
      // reset form
      setForm({ name: '', date: '', time: '', description: '', latitude: '', longitude: '', location: '', budget: '' });
    } catch (e: unknown) {
      console.error(e instanceof Error ? e.message : e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingAct/>
  if (error) {
    return (
      <div className="w-full h-dvh px-5 pb-30 gap-16 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Trips</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href={'/'}>
          <Button variant="outline">
            Try Again
          </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return <NotfoundTrips />;
  }

  return (
    <div className="p-4 pb-24 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} aria-label="Back" className="p-2 rounded-full hover:bg-muted/50"><ArrowLeft /></button>
        <div>
          <div className="text-xl font-semibold">{trip.title}</div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(trip.startDate), 'dd MMM yyyy')} - {format(new Date(trip.endDate), 'dd MMM yyyy')}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button onClick={() => setShowAdd(true)} className="rounded-full px-5"><Plus /> Add</Button>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Publish this trip and activities</span>
          <Switch checked={trip.isTemplate} onCheckedChange={togglePublish} />
        </label>
      </div>

      <Accordion type="multiple" value={openKeys} onValueChange={(v) => setOpenKeys(v as string[])} className="space-y-3">
        {days.map((d, idx) => {
          const key = d.key;
          const acts = activitiesByDay[key] || [];
          return (
            <AccordionItem key={key} value={key} className="bg-white rounded-2xl shadow px-4">
              <AccordionTrigger className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-secondary rounded-full w-10 h-10 flex items-center justify-center font-semibold">{idx + 1}</div>
                  <div className="text-lg font-medium">Day {idx + 1}</div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-1 space-y-3">
                  {acts.length === 0 && (
                    <div className="text-sm text-muted-foreground">No activities</div>
                  )}
                  {acts.map((a) => (
                    <div key={a.id} className="rounded-2xl border p-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.time}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openMaps(a)} aria-label="Open in Maps">
                          <ExternalLink />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="More">
                              <MoreVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { /* TODO: implement edit */ }}>Edit</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => { /* TODO: implement delete */ }}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Input placeholder="Name" value={form.name} onChange={(e) => onChange('name', e.target.value)} />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {form.date ? format(new Date(form.date), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={form.date ? new Date(form.date) : undefined}
                  onSelect={(d) => d && onChange('date', format(d, 'yyyy-MM-dd'))}
                  disabled={(date) => {
                    const start = new Date(trip.startDate);
                    start.setHours(0,0,0,0);
                    const end = new Date(trip.endDate);
                    end.setHours(23,59,59,999);
                    const cmp = new Date(date);
                    cmp.setHours(0,0,0,0);
                    return cmp < start || cmp > end;
                  }}
                />
              </PopoverContent>
            </Popover>
            <Input type="time" value={form.time} onChange={(e) => onChange('time', e.target.value)} />
            <Input placeholder="Description" value={form.description} onChange={(e) => onChange('description', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Latitude" value={form.latitude} onChange={(e) => onChange('latitude', e.target.value)} />
              <Input placeholder="Longitude" value={form.longitude} onChange={(e) => onChange('longitude', e.target.value)} />
            </div>
            <Input placeholder="Location (address)" value={form.location} onChange={(e) => onChange('location', e.target.value)} />
            <Input type="number" placeholder="Budget" value={form.budget} onChange={(e) => onChange('budget', e.target.value)} />
            <Button variant="link" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.name || 'place')}`, '_blank')}>
              Search in Google Maps
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={saveActivity} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const LoadingAct = () => (
  <div className="w-full min-h-dvh flex flex-col items-center justify-center animate-pulse gap-4">
    <div className="h-6 bg-gray-300 rounded w-1/2 mb-2 mx-auto"></div>
    <div className="h-12 bg-gray-200 rounded w-5/6 mx-auto"></div>
    <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
    <div className="h-32 bg-gray-100 rounded w-full mx-auto"></div>
    <div className="flex flex-row gap-2 w-full mx-auto">
      <div className="h-6 w-1/4 bg-gray-200 rounded mx-auto"></div>
      <div className="h-6 w-1/4 bg-gray-200 rounded mx-auto"></div>
    </div>
    <div className="h-8 w-1/3 bg-gray-300 rounded mx-auto"></div>
  </div>
);

const NotfoundTrips = () => {
  return (
    <div className="w-full h-dvh px-5 pb-30 gap-16 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Trips</h1>
        <p className="text-gray-600 mb-4">Not found</p>
        <Link href={'/'}>
        <Button variant="outline">
          Try Again
        </Button>
        </Link>
      </div>
    </div>
  )
}
