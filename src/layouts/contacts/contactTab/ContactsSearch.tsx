import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ContactsSearchProps {
  value: string
  onSearch: (value: string) => void
}

export function ContactsSearch({ value, onSearch }: ContactsSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search contacts ..."
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}