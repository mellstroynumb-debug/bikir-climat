'use client';

import { useStore } from '@/store/useStore';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// PMR Flag (Simplified)
const PmrFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 10 6" className="rounded-sm border border-muted/50">
        <rect width="10" height="6" fill="#DE0000"/>
        <rect y="2" width="10" height="2" fill="#009A00"/>
    </svg>
);

// MD Flag (Simplified)
const MdFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 9 6" className="rounded-sm border border-muted/50">
        <rect width="3" height="6" fill="#003DA5"/>
        <rect x="3" width="3" height="6" fill="#FFD100"/>
        <rect x="6" width="3" height="6" fill="#DE2110"/>
    </svg>
);


export function RegionSwitcher() {
  const { region, setRegion } = useStore();

  const handleSwitch = (checked: boolean) => {
    setRegion(checked ? 'MD' : 'PMR');
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="region-switch" className={cn("cursor-pointer transition-opacity", region !== 'PMR' && 'opacity-50 hover:opacity-100')}>
        <PmrFlag />
      </Label>
      <Switch
        id="region-switch"
        checked={region === 'MD'}
        onCheckedChange={handleSwitch}
        aria-label="Region switcher"
      />
      <Label htmlFor="region-switch" className={cn("cursor-pointer transition-opacity", region !== 'MD' && 'opacity-50 hover:opacity-100')}>
        <MdFlag />
      </Label>
    </div>
  );
}
