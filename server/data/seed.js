import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Rescuer from '../models/Rescuer.js';

dotenv.config();

const contacts = [
  {
    name: 'Wildlife SOS - Bangalore',
    phone: '+91-9920864278',
    whatsapp: '+91-9920864278',
    city: 'bangalore',
    specialties: ['mammals', 'birds', 'reptiles'],
    available24hr: true,
    lat: 12.9352,
    lng: 77.6245,
    address: 'Bannerghatta Road, Bangalore',
    type: 'contact',
    verified: true
  },
  {
    name: 'BBMP Animal Helpline',
    phone: '+91-80-22943834',
    city: 'bangalore',
    specialties: ['mammals', 'birds'],
    available24hr: true,
    lat: 12.9716,
    lng: 77.5946,
    address: 'BBMP Head Office, Bangalore',
    type: 'contact',
    verified: true
  },
  {
    name: 'CUPA Animal Helpline',
    phone: '+91-80-22947317',
    whatsapp: '+91-80-22947317',
    city: 'bangalore',
    specialties: ['mammals', 'birds'],
    available24hr: true,
    lat: 13.0012,
    lng: 77.5764,
    address: 'Hebbal, Bangalore',
    type: 'contact',
    verified: true
  },
  {
    name: 'Cessna Lifeline Vet',
    phone: '+91-9844015557',
    whatsapp: '+91-9844015557',
    city: 'bangalore',
    specialties: ['mammals'],
    available24hr: false,
    lat: 12.9279,
    lng: 77.6271,
    address: 'Koramangala, Bangalore',
    type: 'contact',
    verified: true
  },
  {
    name: 'Karuna Animal Society',
    phone: '+91-9741093397',
    city: 'bangalore',
    specialties: ['all'],
    available24hr: false,
    lat: 12.9592,
    lng: 77.6974,
    address: 'Whitefield, Bangalore',
    type: 'contact',
    verified: true
  },
  {
    name: 'Sanjay Gandhi NP Rescue',
    phone: '+91-22-28860362',
    city: 'mumbai',
    specialties: ['mammals', 'reptiles'],
    available24hr: true,
    lat: 19.2147,
    lng: 72.9101,
    address: 'Borivali East, Mumbai',
    type: 'contact',
    verified: true
  },
  {
    name: 'PETA India - Mumbai',
    phone: '+91-9820122602',
    whatsapp: '+91-9820122602',
    city: 'mumbai',
    specialties: ['all'],
    available24hr: true,
    lat: 19.0760,
    lng: 72.8777,
    address: 'Andheri, Mumbai',
    type: 'contact',
    verified: true
  },
  {
    name: 'Bombay SPCA',
    phone: '+91-22-24130451',
    city: 'mumbai',
    specialties: ['mammals', 'birds'],
    available24hr: false,
    lat: 18.9750,
    lng: 72.8258,
    address: 'Parel, Mumbai',
    type: 'contact',
    verified: true
  },
  {
    name: 'Mumbai Bird Line',
    phone: '+91-9820599375',
    whatsapp: '+91-9820599375',
    city: 'mumbai',
    specialties: ['birds'],
    available24hr: true,
    lat: 19.1136,
    lng: 72.8697,
    address: 'Goregaon, Mumbai',
    type: 'contact',
    verified: true
  },
  {
    name: 'Wildlife SOS - Delhi',
    phone: '+91-9871963535',
    whatsapp: '+91-9871963535',
    city: 'delhi',
    specialties: ['mammals', 'reptiles'],
    available24hr: true,
    lat: 28.6139,
    lng: 77.2090,
    address: 'Hauz Khas, Delhi',
    type: 'contact',
    verified: true
  },
  {
    name: 'Friendicoes SECA',
    phone: '+91-11-24316300',
    city: 'delhi',
    specialties: ['mammals', 'birds'],
    available24hr: false,
    lat: 28.5672,
    lng: 77.2100,
    address: 'Jangpura, Delhi',
    type: 'contact',
    verified: true
  },
  {
    name: 'Delhi Zoo Emergency',
    phone: '+91-11-24694380',
    city: 'delhi',
    specialties: ['all'],
    available24hr: true,
    lat: 28.6089,
    lng: 77.2441,
    address: 'Mathura Road, Delhi',
    type: 'contact',
    verified: true
  },
  {
    name: 'Blue Cross of India',
    phone: '+91-44-22354959',
    whatsapp: '+91-44-22354959',
    city: 'chennai',
    specialties: ['mammals', 'birds'],
    available24hr: true,
    lat: 13.0827,
    lng: 80.2707,
    address: 'Guindy, Chennai',
    type: 'contact',
    verified: true
  },
  {
    name: 'PAWS Chennai',
    phone: '+91-9444405205',
    whatsapp: '+91-9444405205',
    city: 'chennai',
    specialties: ['all'],
    available24hr: false,
    lat: 13.0569,
    lng: 80.2425,
    address: 'Adyar, Chennai',
    type: 'contact',
    verified: true
  },
  {
    name: 'Hyderabad for Animals',
    phone: '+91-9246366638',
    whatsapp: '+91-9246366638',
    city: 'hyderabad',
    specialties: ['all'],
    available24hr: true,
    lat: 17.3850,
    lng: 78.4867,
    address: 'Banjara Hills, Hyderabad',
    type: 'contact',
    verified: true
  },
  {
    name: 'GHMC Animal Helpline',
    phone: '+91-40-21111119',
    city: 'hyderabad',
    specialties: ['mammals', 'birds'],
    available24hr: true,
    lat: 17.4065,
    lng: 78.4772,
    address: 'Secunderabad, Hyderabad',
    type: 'contact',
    verified: true
  },
  {
    name: 'Wildlife Rescue & Rehabilitation Centre',
    city: 'mysore',
    phone: '+91-821-2548074',
    specialties: ['mammals', 'birds', 'reptiles'],
    available24hr: true,
    lat: 12.2958,
    lng: 76.6394,
    address: 'Mysore Zoo Campus, Mysore',
    type: 'contact',
    verified: true
  },
  {
    name: 'CUPA - Mysore',
    city: 'mysore',
    phone: '+91-9845926312',
    whatsapp: '+91-9845926312',
    specialties: ['mammals', 'birds'],
    available24hr: false,
    lat: 12.3052,
    lng: 76.6552,
    address: 'Kuvempunagar, Mysore',
    type: 'contact',
    verified: true
  },
  {
    name: 'Pilikula Biological Park Rescue',
    city: 'mangalore',
    phone: '+91-824-2295601',
    specialties: ['all'],
    available24hr: true,
    lat: 12.9141,
    lng: 74.8560,
    address: 'Pilikula, Mangalore',
    type: 'contact',
    verified: true
  },
  {
    name: 'Wildlife Trust of India - Mangalore',
    city: 'mangalore',
    phone: '+91-9448009639',
    specialties: ['mammals', 'reptiles'],
    available24hr: false,
    lat: 12.8698,
    lng: 74.8427,
    address: 'Bejai, Mangalore',
    type: 'contact',
    verified: true
  },
  {
    name: 'SPCA Hubli',
    city: 'hubli',
    phone: '+91-836-2256262',
    specialties: ['mammals', 'birds'],
    available24hr: false,
    lat: 15.3647,
    lng: 75.1240,
    address: 'Vidyanagar, Hubli',
    type: 'contact',
    verified: true
  },
  {
    name: 'Bhadra Wildlife Rescue',
    city: 'shimoga',
    phone: '+91-9448500877',
    specialties: ['mammals', 'reptiles'],
    available24hr: true,
    lat: 13.9299,
    lng: 75.5681,
    address: 'Shimoga',
    type: 'contact',
    verified: true
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Rescuer.deleteMany({ type: 'contact' });
    const inserted = await Rescuer.insertMany(contacts);
    console.log(`Seeded ${inserted.length} contact rescuers`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
