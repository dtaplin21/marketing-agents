import { FC, useState } from 'react';
import { Command } from 'cmdk';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import * as React from 'react';

export const CommandPalette: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Type a command or search..."
          />
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Actions">
            <Command.Item>Analyze Customer Segment</Command.Item>
            <Command.Item>Generate Social Post</Command.Item>
            <Command.Item>Run Health Check</Command.Item>
          </Command.Group>
          <Command.Group heading="Navigation">
            <Command.Item>Go to Segments</Command.Item>
            <Command.Item>Go to Communications</Command.Item>
            <Command.Item>Go to Analytics</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </Dialog>
  );
}; 