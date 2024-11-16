import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ContactsBody from './contactTab/ContactsBody'
import RequestsBody from './requestsTab/RequestsBody'

export function ContactsTab() {
  const tabs = [
    {
      value: 'contacts',
      label: 'Contacts',
      content: <ContactsBody />,
    },
    {
      value: 'requests',
      label: 'Requests',
      content: <RequestsBody />,
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="contacts" className="flex-1">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1 overflow-auto">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0 h-full">
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}
