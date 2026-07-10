import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import Rescuer from '../models/Rescuer.js';

dotenv.config();
dns.setServers(['1.1.1.1', '8.8.8.8']);

const contacts = [
  {
    name: 'People For Animals - Wildlife Rescue & Conservation Centre',
    city: 'bangalore',
    phone: '080-28611986, 080-28612767, +91-9980339880, +91-9900025370',
    whatsapp: '+91-9980339880',
    email: 'info@peopleforanimalsbangalore.org',
    specialties: ['wildlife', 'mammals', 'birds', 'reptiles'],
    available24hr: false,
    lat: 12.9020,
    lng: 77.5300,
    address: 'No. 67, Uttarahalli Main Road, next to BGS Global Hospital, Kengeri, Bengaluru - 560060. District: Bengaluru Urban. Website/social: PfA Wildlife Hospital',
    type: 'contact',
    verified: true
  },
  {
    name: 'People For Animals - Hubli',
    city: 'hubli',
    phone: '+91-9242239565, +91-9845799978',
    whatsapp: '+91-9242239565',
    email: 'pfahubballidharwad@gmail.com',
    specialties: ['all'],
    available24hr: false,
    lat: 15.3640,
    lng: 74.1090,
    address: 'Shelter: At-pale, old Karuna gaushala, behind Shell Petrol Pump, NH-4, Pale, Hubli - 580028. District: Dharwad',
    type: 'contact',
    verified: true
  },
  {
    name: 'People For Animals - Mysuru',
    city: 'mysore',
    phone: '+91-9845654429',
    whatsapp: '+91-9845654429',
    email: 'mysorepfa2016@gmail.com',
    specialties: ['dogs', 'cats', 'birds', 'wildlife'],
    available24hr: true,
    lat: 12.3526,
    lng: 76.6055,
    address: 'Survey No. 280, Roopanagar, Bogadi Village, Mysore - 570026. District: Mysore. Website: pfamysore.org',
    type: 'contact',
    verified: true
  },
  {
    name: 'Karuna Animal Welfare Association of Karnataka',
    city: 'bangalore',
    phone: '080-23411181',
    email: 'karunaaw@yahoo.com',
    specialties: ['dogs', 'cats'],
    available24hr: false,
    lat: 12.9716,
    lng: 77.6011,
    address: 'Kasturba Road, opposite Queens Statue, Bengaluru - 560001. District: Bengaluru Urban. Website: karunaanimalwelfare.org',
    type: 'contact',
    verified: true
  },
  {
    name: 'Wildlife Rescue & Rehabilitation Centre (WRRC India)',
    city: 'bangalore',
    phone: 'Not listed',
    specialties: ['wildlife', 'mammals', 'birds', 'reptiles'],
    available24hr: false,
    lat: 12.9770,
    lng: 77.6290,
    address: 'Flat A4, Kensington Apts, 18/1 Ulsoor Cross Road, Off Bazaar St, Ulsoor, Bengaluru - 560008. District: Bengaluru Urban. Website: wrrcindia.org',
    type: 'contact',
    verified: true
  },
  {
    name: 'Bannerghatta Rescue Center (BBRC)',
    city: 'bangalore',
    phone: '080-29776466, 080-29776467',
    email: 'pro@bannerughattabiopark.org',
    specialties: ['wildlife', 'mammals'],
    available24hr: false,
    lat: 12.8080,
    lng: 77.5752,
    address: 'Bannerghatta Biological Park, Bannerghatta, Bengaluru - 560083. District: Bengaluru Urban. Website/social: Bannerghatta Biological Park',
    type: 'contact',
    verified: true
  },
  {
    name: 'Compassion Unlimited Plus Action (CUPA)',
    city: 'bangalore',
    phone: 'Not listed',
    email: 'communications@cupaindia.org',
    specialties: ['all'],
    available24hr: true,
    lat: 12.9770,
    lng: 77.6290,
    address: 'Kensington Apartments, Flat A-3, 18/1 Ulsoor Cross Road, Off Bazaar Street, Ulsoor, Bengaluru - 560008. District: Bengaluru Urban. Website/social: CUPA Bangalore',
    type: 'contact',
    verified: true
  },
  {
    name: 'CUPA Trauma & Rescue Centre',
    city: 'bangalore',
    phone: '+91-9845425678, 080-22947301',
    whatsapp: '+91-9845425678',
    specialties: ['dogs', 'cats'],
    available24hr: true,
    lat: 13.0473,
    lng: 77.6119,
    address: 'KVAFSU Veterinary College Campus, Bellary Road (Hebbal), Bengaluru - 560024. District: Bengaluru Urban. Website/social: part of CUPA',
    type: 'contact',
    verified: true
  },
  {
    name: 'CUPA Large Animal Rescue & Rehabilitation Centre',
    city: 'bangalore',
    phone: 'Not listed',
    email: 'communications@cupaindia.org',
    specialties: ['cattle'],
    available24hr: false,
    lat: 12.9162,
    lng: 77.4469,
    address: '32/1 Upadhayaya Layout, Nagadevanahalli, Kengeri New Town, Bangalore University Campus, Bengaluru - 560060. District: Bengaluru Urban. Website/social: part of CUPA',
    type: 'contact',
    verified: true
  },
  {
    name: 'CUPA Spay & Neuter Centre (Dogs)',
    city: 'bangalore',
    phone: 'Not listed',
    email: 'cupasncdogs@cupaindia.org',
    specialties: ['dogs'],
    available24hr: false,
    lat: 12.8239,
    lng: 77.7111,
    address: '229/1 Muthanallur Cross, Sarjapura Road, Opp. BB Jewellers, Dommasandra, Bengaluru - 562125. District: Bangalore Urban. Website/social: part of CUPA',
    type: 'contact',
    verified: true
  },
  {
    name: 'CUPA Cat Sterilization Centre',
    city: 'bangalore',
    phone: 'Not listed',
    email: 'cupaprojects@cupaindia.org',
    specialties: ['cats'],
    available24hr: false,
    lat: 12.9770,
    lng: 77.6290,
    address: 'Kensington Apartments, Flat A-3, 18/1 Ulsoor Cross Road, Off Bazaar Street, Ulsoor, Bengaluru - 560008. District: Bangalore Urban. Website/social: part of CUPA',
    type: 'contact',
    verified: true
  },
  {
    name: 'CUPA Small Animal Specialty Hospital',
    city: 'bangalore',
    phone: '+91-9108855888, 080-22947312, 080-22947313',
    whatsapp: '+91-9108855888',
    specialties: ['dogs', 'cats'],
    available24hr: true,
    lat: 13.0198,
    lng: 77.5889,
    address: '#11/3 Sri Ram Elite, RT Nagar Main Road, HMT Layout, Bengaluru - 560032. District: Bangalore Urban. Website/social: part of CUPA',
    type: 'contact',
    verified: true
  },
  {
    name: "Let's Live Together Charitable Trust",
    city: 'bangalore',
    phone: '+91-9513146699',
    whatsapp: '+91-9513146699',
    specialties: ['dogs', 'cats'],
    available24hr: false,
    lat: 13.0100,
    lng: 77.5698,
    address: 'Malleswaram, Bengaluru - exact address not public; fosters and adoptions via social media. District: Bangalore Urban. Website: letslivetogether.org',
    type: 'contact',
    verified: true
  },
  {
    name: 'Animal Care Trust (ACT)',
    city: 'mangalore',
    phone: '+91-821-7580842',
    email: 'actmangalore@gmail.com',
    specialties: ['dogs', 'cats'],
    available24hr: true,
    lat: 12.8878,
    lng: 74.8556,
    address: 'Vatsalya Animal Shelter, Near Shaktinagar Water Tank, Shaktinagar, Mangalore - 575016. District: Dakshina Kannada. Website: animalcaretrustindia.org',
    type: 'contact',
    verified: true
  },
  {
    name: 'Belagavi Animal Rescue & Care (BARC)',
    city: 'belagavi',
    phone: '+91-8147306360',
    whatsapp: '+91-8147306360',
    specialties: ['dogs'],
    available24hr: false,
    lat: 15.8497,
    lng: 74.4977,
    address: 'Govt. Veterinary Hospital campus, near Sanman Hotel, Belagavi - 590001. District: Belagavi. Website/social: Facebook page',
    type: 'contact',
    verified: true
  },
  {
    name: 'Animal Caring Trust (R)',
    city: 'chikkamagaluru',
    phone: 'Not listed',
    specialties: ['dogs', 'cats'],
    available24hr: false,
    lat: 13.3152,
    lng: 75.7777,
    address: 'Sahyadri Institute of Paramedical Sciences, AIT Circle, Beekanahalli, Chikkamagaluru - 577102. District: Chikkamagaluru. Instagram: @animalcareckm',
    type: 'contact',
    verified: true
  },
  {
    name: 'Coorg Wildlife Society',
    city: 'madikeri',
    phone: '+91-8762686125, +91-7483677514',
    whatsapp: '+91-8762686125',
    email: 'cws.wildlife@gmail.com',
    specialties: ['wildlife'],
    available24hr: false,
    lat: 12.4237,
    lng: 75.7382,
    address: 'PB No 111, Opp. DFO Quarters, Madikeri - 571201, Kodagu, Karnataka. District: Kodagu (Coorg). Website: cws.in',
    type: 'contact',
    verified: true
  }
];

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');

    await mongoose.connect(process.env.MONGODB_URI);

    let created = 0;
    let updated = 0;

    for (const contact of contacts) {
      const existing = await Rescuer.findOne({
        type: 'contact',
        name: contact.name
      });

      if (existing) {
        existing.set(contact);
        await existing.save();
        updated += 1;
      } else {
        await Rescuer.create(contact);
        created += 1;
      }
    }

    console.log(`Seeded Karnataka contacts: ${created} created, ${updated} updated`);
    process.exit(0);
  } catch (err) {
    console.error('Karnataka seed error:', err.message);
    process.exit(1);
  }
};

seed();
