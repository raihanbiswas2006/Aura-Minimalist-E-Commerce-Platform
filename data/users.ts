import { DemoUser } from "@/types";

export const DEMO_USERS: DemoUser[] = [
  {
    id: "user-arif",
    email: "arif@demo.aura",
    name: "Arif Rahman (Demo)",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    savedAddresses: [
      {
        fullName: "Arif Rahman",
        email: "arif@demo.aura",
        phone: "01711000001",
        division: "Dhaka",
        district: "Dhaka",
        area: "Gulshan-2",
        streetAddress: "Road 71, House 14 (Sample Address)",
        apartment: "Apt 4B",
        city: "Dhaka",
        state: "Dhaka",
        postalCode: "1212",
        country: "Bangladesh",
      },
    ],
  },
  {
    id: "user-nusrat",
    email: "nusrat@demo.aura",
    name: "Nusrat Jahan (Demo)",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    savedAddresses: [
      {
        fullName: "Nusrat Jahan",
        email: "nusrat@demo.aura",
        phone: "01819000002",
        division: "Chattogram",
        district: "Chattogram",
        area: "Panchlaish",
        streetAddress: "GEC Circle, Nasirabad (Sample Address)",
        apartment: "Suite 3A",
        city: "Chattogram",
        state: "Chattogram",
        postalCode: "4000",
        country: "Bangladesh",
      },
    ],
  },
];
