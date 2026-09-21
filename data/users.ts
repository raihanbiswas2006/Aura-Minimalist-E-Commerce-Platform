import { DemoUser } from "@/types";

export const DEMO_USERS: DemoUser[] = [
  {
    id: "user-marcus",
    email: "marcus@demo.aura",
    name: "Marcus Vance",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    savedAddresses: [
      {
        fullName: "Marcus Vance",
        email: "marcus@demo.aura",
        phone: "4155552671",
        streetAddress: "742 Montgomery St",
        apartment: "Penthouse 4B",
        city: "San Francisco",
        state: "CA",
        postalCode: "94111",
        country: "United States",
      },
    ],
  },
  {
    id: "user-elena",
    email: "elena@demo.aura",
    name: "Elena Rostova",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    savedAddresses: [
      {
        fullName: "Elena Rostova",
        email: "elena@demo.aura",
        phone: "2125559820",
        streetAddress: "128 Mercer Street",
        apartment: "Suite 3A",
        city: "New York",
        state: "NY",
        postalCode: "10012",
        country: "United States",
      },
    ],
  },
];
