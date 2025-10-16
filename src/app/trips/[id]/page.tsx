'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Activity, Trip } from '@/lib/type';
import { format } from 'date-fns';
import { ArrowLeft, ChevronDown, ChevronRight, ExternalLink, MoreVertical, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
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
      } catch (e: any) {
        if (!ignore) setError(e?.message ?? 'Failed to load');
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
    } catch (e) {
      console.error(e);
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
      setExpanded((e) => ({ ...e, [key]: true }));
      // reset form
      setForm({ name: '', date: '', time: '', description: '', latitude: '', longitude: '', location: '', budget: '' });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!trip) return <div className="p-6">Trip not found</div>;

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

      <div className="space-y-3">
        {days.map((d, idx) => {
          const key = d.key;
          const open = expanded[key] ?? idx === 0; // open first by default
          const acts = activitiesByDay[key] || [];
          return (
            <Collapsible key={key} open={open} onOpenChange={(val) => setExpanded((e) => ({ ...e, [key]: val }))}>
              <div className="bg-white rounded-2xl shadow p-4">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-secondary rounded-full w-10 h-10 flex items-center justify-center font-semibold">{idx + 1}</div>
                      <div className="text-lg font-medium">Day {idx + 1}</div>
                    </div>
                    {open ? <ChevronDown /> : <ChevronRight />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 space-y-3">
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
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Input placeholder="Name" value={form.name} onChange={(e) => onChange('name', e.target.value)} />
            <Input type="date" value={form.date} onChange={(e) => onChange('date', e.target.value)} />
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
