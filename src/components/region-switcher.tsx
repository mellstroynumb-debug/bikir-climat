'use client';

import { useStore } from '@/store/useStore';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function RegionSwitcher() {
  const { region, setRegion } = useStore();

  const handleSwitch = (checked: boolean) => {
    setRegion(checked ? 'MD' : 'PMR');
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="region-switch" className={region === 'PMR' ? 'text-primary font-bold' : 'text-muted-foreground'}>
        PMR
      </Label>
      <Switch
        id="region-switch"
        checked={region === 'MD'}
        onCheckedChange={handleSwitch}
        aria-label="Region switcher"
      />
      <Label htmlFor="region-switch" className={region === 'MD' ? 'text-primary font-bold' : 'text-muted-foreground'}>
        MD
      </Label>
    </div>
  );
}
