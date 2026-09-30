import { StoreLocation } from '@/types';

export const STORES: StoreLocation[] = [
  {
    id: 'kolhapur-tarabai',
    name: 'Daddy Soda — Tarabai Park',
    city: 'Kolhapur',
    address: 'Shop 4 & 5, Crystal Plaza, Tarabai Park',
    pincode: '416003',
    distanceKm: 1.2,
    openHours: '11:00 AM – 11:30 PM',
    isOpen: true,
    phone: '+91 98220 12345',
    features: ['Drive-thru Window', 'Outdoor Patio', 'Late Night Fizz', 'Curbside Pickup'],
    lat: 16.705,
    lng: 74.243
  },
  {
    id: 'pune-koregaon-park',
    name: 'Daddy Soda — Koregaon Park',
    city: 'Pune',
    address: 'Lane 7, Near South Main Road, Koregaon Park',
    pincode: '411001',
    distanceKm: 3.8,
    openHours: '11:00 AM – 1:00 AM',
    isOpen: true,
    phone: '+91 98230 54321',
    features: ['Late Night (Till 1 AM)', 'Soda DJ Booth', 'Outdoor Seating', 'Pet Friendly'],
    lat: 18.536,
    lng: 73.894
  },
  {
    id: 'mumbai-bandra',
    name: 'Daddy Soda — Bandra West',
    city: 'Mumbai',
    address: 'Pali Hill Road, Near Union Park, Bandra West',
    pincode: '400050',
    distanceKm: 5.4,
    openHours: '11:00 AM – 1:30 AM',
    isOpen: true,
    phone: '+91 98200 98765',
    features: ['Walk-up Counter', 'Late Night', 'Flash Drops Only', 'Delivery Express'],
    lat: 19.065,
    lng: 72.825
  },
  {
    id: 'bengaluru-indiranagar',
    name: 'Daddy Soda — Indiranagar',
    city: 'Bengaluru',
    address: '100ft Road, 12th Main Junction, Indiranagar',
    pincode: '560038',
    distanceKm: 7.1,
    openHours: '10:30 AM – 12:00 AM',
    isOpen: true,
    phone: '+91 98450 11223',
    features: ['Draft Fountain Bar', 'Workspace WiFi', 'Drive-thru', 'Limited Merch'],
    lat: 12.978,
    lng: 77.640
  },
  {
    id: 'delhi-cyberhub',
    name: 'Daddy Soda — CyberHub',
    city: 'Delhi NCR',
    address: 'Ground Floor, DLF CyberHub, Gurugram',
    pincode: '122002',
    distanceKm: 12.0,
    openHours: '11:00 AM – 12:00 AM',
    isOpen: true,
    phone: '+91 98110 33445',
    features: ['High-Speed Pickup', 'Indoor Chill Zone', 'Late Night Delivery'],
    lat: 28.495,
    lng: 77.088
  }
];
