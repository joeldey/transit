import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// CASCADIA METRO TRANSIT AUTHORITY
// Static Schedule Data with Variable Frequencies
// ============================================

const stations = [
  // Downtown Core
  { name: 'Central Station', code: 'CTR', zone: 'Downtown' },
  { name: 'Waterfront Terminal', code: 'WFT', zone: 'Downtown' },
  { name: 'City Hall', code: 'CTH', zone: 'Downtown' },
  { name: 'Convention Center', code: 'CVC', zone: 'Downtown' },
  
  // North
  { name: 'Northgate Transit Center', code: 'NGT', zone: 'North' },
  { name: 'Hillcrest Village', code: 'HCV', zone: 'North' },
  { name: 'Maplewood Station', code: 'MPW', zone: 'North' },
  
  // South  
  { name: 'Willowdale Station', code: 'WLD', zone: 'South' },
  { name: 'Riverside Park & Ride', code: 'RVS', zone: 'South' },
  { name: 'Cascadia International Airport', code: 'YCA', zone: 'South' },
  
  // East
  { name: 'Eastridge Mall', code: 'ERM', zone: 'East' },
  { name: 'University District', code: 'UNV', zone: 'East' },
  { name: 'Pacific Tech Campus', code: 'PTC', zone: 'East' },
  { name: 'Cedarbrook Station', code: 'CDB', zone: 'East' },
  
  // West
  { name: 'Harborview Business Park', code: 'HBV', zone: 'West' },
  { name: 'Lakeshore Beach', code: 'LKS', zone: 'West' },
  
  // Suburban
  { name: 'Fairview Heights', code: 'FVH', zone: 'Suburban' },
  { name: 'Pinewood Estates', code: 'PWE', zone: 'Suburban' },
  { name: 'Mountainview Heights', code: 'MVH', zone: 'Suburban' },
];

// Schedule pattern format: "HH:MM-HH:MM@freq,..."
// freq is in minutes, can be any value (not just multiples of 5)
const routePatterns = [
  // TRAIN LINES - frequent all day, extra frequent at peaks
  { 
    routeNumber: 'Evergreen Line', 
    routeType: 'train', 
    schedulePattern: '05:00-06:30@12,06:30-09:15@6,09:15-15:30@8,15:30-18:45@6,18:45-22:00@10,22:00-00:30@15'
  },
  { 
    routeNumber: 'Harborview Line', 
    routeType: 'train', 
    schedulePattern: '05:30-07:00@10,07:00-09:30@7,09:30-16:00@10,16:00-18:30@7,18:30-21:30@12,21:30-00:00@18'
  },
  { 
    routeNumber: 'Cascade Line', 
    routeType: 'train', 
    schedulePattern: '04:30-06:00@15,06:00-22:00@12,22:00-23:45@20'
  },
  { 
    routeNumber: 'Mountainview Line', 
    routeType: 'train', 
    schedulePattern: '06:00-07:30@12,07:30-09:30@8,09:30-16:00@12,16:00-19:00@8,19:00-23:00@15'
  },
  
  // RAPID BUS - frequent service
  { 
    routeNumber: 'R1', 
    routeType: 'rapid', 
    schedulePattern: '05:30-07:00@12,07:00-09:30@7,09:30-15:30@10,15:30-18:30@7,18:30-21:00@12,21:00-23:30@18'
  },
  { 
    routeNumber: 'R3', 
    routeType: 'rapid', 
    schedulePattern: '05:45-06:45@15,06:45-09:15@8,09:15-15:45@12,15:45-18:45@8,18:45-23:00@15'
  },
  { 
    routeNumber: 'R5', 
    routeType: 'rapid', 
    schedulePattern: '06:00-07:30@10,07:30-09:30@6,09:30-16:00@10,16:00-18:30@6,18:30-22:30@12'
  },
  
  // EXPRESS - peak hours focused
  { 
    routeNumber: 'X1', 
    routeType: 'express', 
    schedulePattern: '06:30-09:30@12,09:30-15:30@25,15:30-19:00@12,19:00-20:00@20'
  },
  { 
    routeNumber: 'X2', 
    routeType: 'express', 
    schedulePattern: '07:00-09:15@15,09:15-15:45@30,15:45-18:30@15,18:30-19:30@25'
  },
  { 
    routeNumber: 'X5', 
    routeType: 'express', 
    schedulePattern: '05:00-07:00@20,07:00-21:00@15,21:00-23:00@25'
  },
  
  // LOCAL BUS - varied frequencies throughout day
  { 
    routeNumber: '4', 
    routeType: 'bus', 
    schedulePattern: '05:30-06:30@18,06:30-09:00@10,09:00-15:00@15,15:00-18:30@10,18:30-21:30@15,21:30-23:30@22'
  },
  { 
    routeNumber: '14', 
    routeType: 'bus', 
    schedulePattern: '06:00-07:30@15,07:30-09:30@8,09:30-15:30@12,15:30-18:30@8,18:30-23:00@18'
  },
  { 
    routeNumber: '22', 
    routeType: 'bus', 
    schedulePattern: '06:00-07:00@25,07:00-09:00@12,09:00-15:30@20,15:30-18:00@12,18:00-22:00@25'
  },
  { 
    routeNumber: '33', 
    routeType: 'bus', 
    schedulePattern: '05:30-07:00@12,07:00-09:30@7,09:30-15:30@10,15:30-18:30@7,18:30-22:00@12,22:00-00:00@20'
  },
  { 
    routeNumber: '49', 
    routeType: 'bus', 
    schedulePattern: '06:30-09:00@17,09:00-15:30@22,15:30-18:30@17,18:30-21:30@25'
  },
  { 
    routeNumber: '55', 
    routeType: 'bus', 
    schedulePattern: '06:00-07:30@22,07:30-09:15@13,09:15-15:45@20,15:45-18:15@13,18:15-22:00@25'
  },
  { 
    routeNumber: '72', 
    routeType: 'bus', 
    schedulePattern: '05:45-07:00@18,07:00-09:15@11,09:15-15:30@15,15:30-18:30@11,18:30-23:15@20'
  },
  { 
    routeNumber: '88', 
    routeType: 'bus', 
    schedulePattern: '06:30-09:00@18,09:00-15:30@28,15:30-18:30@18,18:30-21:00@30'
  },
  { 
    routeNumber: '95', 
    routeType: 'bus', 
    schedulePattern: '05:30-07:00@15,07:00-09:30@9,09:30-15:30@12,15:30-18:30@9,18:30-21:30@15,21:30-23:30@22'
  },
  { 
    routeNumber: '104', 
    routeType: 'bus', 
    schedulePattern: '06:00-09:00@22,09:00-15:30@35,15:30-18:30@22,18:30-22:00@40'
  },
  { 
    routeNumber: '116', 
    routeType: 'bus', 
    schedulePattern: '06:30-09:45@17,09:45-17:00@24,17:00-22:30@19'
  },
  { 
    routeNumber: '143', 
    routeType: 'bus', 
    schedulePattern: '06:00-08:30@20,08:30-15:00@35,15:00-18:00@20,18:00-20:00@30'
  },
  { 
    routeNumber: '215', 
    routeType: 'bus', 
    schedulePattern: '06:30-08:30@25,08:30-15:30@45,15:30-18:30@25,18:30-19:30@40'
  },
  { 
    routeNumber: 'N10', 
    routeType: 'bus', 
    schedulePattern: '00:00-01:30@30,01:30-04:00@45,04:00-05:00@30'
  },
];

// Route stops with offset minutes to stagger arrivals
const routeStopDefinitions = [
  // EVERGREEN LINE (North-South)
  { route: 'Evergreen Line', station: 'Central Station', destination: 'Northgate Transit Center', direction: 'Northbound', platform: 'A', offset: 0 },
  { route: 'Evergreen Line', station: 'Central Station', destination: 'Willowdale Station', direction: 'Southbound', platform: 'B', offset: 3 },
  { route: 'Evergreen Line', station: 'City Hall', destination: 'Northgate Transit Center', direction: 'Northbound', platform: 'A', offset: 4 },
  { route: 'Evergreen Line', station: 'City Hall', destination: 'Willowdale Station', direction: 'Southbound', platform: 'B', offset: 7 },
  { route: 'Evergreen Line', station: 'Northgate Transit Center', destination: 'Willowdale Station', direction: 'Southbound', platform: '1', offset: 0 },
  { route: 'Evergreen Line', station: 'Willowdale Station', destination: 'Northgate Transit Center', direction: 'Northbound', platform: '2', offset: 0 },

  // HARBORVIEW LINE (East-West)
  { route: 'Harborview Line', station: 'Central Station', destination: 'Waterfront Terminal', direction: 'Westbound', platform: 'C', offset: 0 },
  { route: 'Harborview Line', station: 'Central Station', destination: 'Eastridge Mall', direction: 'Eastbound', platform: 'D', offset: 2 },
  { route: 'Harborview Line', station: 'Waterfront Terminal', destination: 'Eastridge Mall', direction: 'Eastbound', platform: '1', offset: 0 },
  { route: 'Harborview Line', station: 'Convention Center', destination: 'Waterfront Terminal', direction: 'Westbound', platform: 'A', offset: 5 },
  { route: 'Harborview Line', station: 'Convention Center', destination: 'Eastridge Mall', direction: 'Eastbound', platform: 'B', offset: 8 },
  { route: 'Harborview Line', station: 'Eastridge Mall', destination: 'Waterfront Terminal', direction: 'Westbound', platform: '3', offset: 0 },
  { route: 'Harborview Line', station: 'Harborview Business Park', destination: 'Eastridge Mall', direction: 'Eastbound', platform: '1', offset: 3 },

  // CASCADE LINE (Airport)
  { route: 'Cascade Line', station: 'Central Station', destination: 'Cascadia International Airport', direction: 'Southbound', platform: 'E', offset: 0 },
  { route: 'Cascade Line', station: 'Cascadia International Airport', destination: 'Central Station', direction: 'Northbound', platform: '1', offset: 0 },

  // MOUNTAINVIEW LINE (University/Tech)
  { route: 'Mountainview Line', station: 'Central Station', destination: 'Pacific Tech Campus', direction: 'Eastbound', platform: 'F', offset: 0 },
  { route: 'Mountainview Line', station: 'University District', destination: 'Central Station', direction: 'Westbound', platform: 'A', offset: 6 },
  { route: 'Mountainview Line', station: 'University District', destination: 'Pacific Tech Campus', direction: 'Eastbound', platform: 'B', offset: 9 },
  { route: 'Mountainview Line', station: 'Pacific Tech Campus', destination: 'Central Station', direction: 'Westbound', platform: '1', offset: 0 },

  // RAPID BUS R1
  { route: 'R1', station: 'Central Station', destination: 'Cedarbrook Station', direction: 'Eastbound', platform: 'Bay 1', offset: 0 },
  { route: 'R1', station: 'Central Station', destination: 'Waterfront Terminal', direction: 'Westbound', platform: 'Bay 2', offset: 4 },
  { route: 'R1', station: 'Waterfront Terminal', destination: 'Cedarbrook Station', direction: 'Eastbound', platform: 'Bay 5', offset: 0 },
  { route: 'R1', station: 'Cedarbrook Station', destination: 'Waterfront Terminal', direction: 'Westbound', platform: 'Bay 1', offset: 0 },

  // RAPID BUS R3
  { route: 'R3', station: 'Central Station', destination: 'Northgate Transit Center', direction: 'Northbound', platform: 'Bay 3', offset: 0 },
  { route: 'R3', station: 'Central Station', destination: 'Riverside Park & Ride', direction: 'Southbound', platform: 'Bay 4', offset: 3 },
  { route: 'R3', station: 'Northgate Transit Center', destination: 'Riverside Park & Ride', direction: 'Southbound', platform: 'Bay 2', offset: 0 },
  { route: 'R3', station: 'Riverside Park & Ride', destination: 'Northgate Transit Center', direction: 'Northbound', platform: 'Bay 1', offset: 0 },

  // RAPID BUS R5
  { route: 'R5', station: 'Central Station', destination: 'University District', direction: 'Eastbound', platform: 'Bay 5', offset: 0 },
  { route: 'R5', station: 'University District', destination: 'Central Station', direction: 'Westbound', platform: 'Bay 3', offset: 0 },

  // EXPRESS X1
  { route: 'X1', station: 'Northgate Transit Center', destination: 'Central Station', direction: 'Inbound', platform: 'Bay 10', offset: 0 },
  { route: 'X1', station: 'Hillcrest Village', destination: 'Central Station', direction: 'Inbound', platform: null, offset: 7 },

  // EXPRESS X2
  { route: 'X2', station: 'Central Station', destination: 'Pacific Tech Campus', direction: 'Outbound', platform: 'Bay 11', offset: 0 },

  // EXPRESS X5 (Airport)
  { route: 'X5', station: 'Central Station', destination: 'Cascadia International Airport', direction: 'Outbound', platform: 'Bay 12', offset: 0 },
  { route: 'X5', station: 'Cascadia International Airport', destination: 'Central Station', direction: 'Inbound', platform: 'Bay 1', offset: 0 },

  // LOCAL BUS ROUTES
  { route: '4', station: 'Central Station', destination: 'Cedarbrook Station', direction: 'Eastbound', platform: null, offset: 0 },
  { route: '4', station: 'Central Station', destination: 'Waterfront Terminal', direction: 'Westbound', platform: null, offset: 5 },
  { route: '4', station: 'Waterfront Terminal', destination: 'Cedarbrook Station', direction: 'Eastbound', platform: null, offset: 0 },
  { route: '4', station: 'Cedarbrook Station', destination: 'Waterfront Terminal', direction: 'Westbound', platform: null, offset: 0 },

  { route: '14', station: 'Central Station', destination: 'University District', direction: 'Eastbound', platform: null, offset: 0 },
  { route: '14', station: 'University District', destination: 'Central Station', direction: 'Westbound', platform: null, offset: 0 },

  { route: '22', station: 'Central Station', destination: 'Hillcrest Village', direction: 'Northbound', platform: null, offset: 0 },
  { route: '22', station: 'City Hall', destination: 'Hillcrest Village', direction: 'Northbound', platform: null, offset: 4 },
  { route: '22', station: 'Hillcrest Village', destination: 'Central Station', direction: 'Southbound', platform: null, offset: 0 },

  { route: '33', station: 'Central Station', destination: 'Eastridge Mall', direction: 'Eastbound', platform: null, offset: 0 },
  { route: '33', station: 'Central Station', destination: 'Maplewood Station', direction: 'Westbound', platform: null, offset: 3 },
  { route: '33', station: 'Maplewood Station', destination: 'Eastridge Mall', direction: 'Eastbound', platform: null, offset: 0 },
  { route: '33', station: 'Eastridge Mall', destination: 'Maplewood Station', direction: 'Westbound', platform: null, offset: 0 },

  { route: '49', station: 'Northgate Transit Center', destination: 'Lakeshore Beach', direction: 'Southbound', platform: null, offset: 0 },
  { route: '49', station: 'Lakeshore Beach', destination: 'Northgate Transit Center', direction: 'Northbound', platform: null, offset: 0 },

  { route: '55', station: 'Central Station', destination: 'Fairview Heights', direction: 'Eastbound', platform: null, offset: 0 },
  { route: '55', station: 'Convention Center', destination: 'Fairview Heights', direction: 'Eastbound', platform: null, offset: 6 },
  { route: '55', station: 'Fairview Heights', destination: 'Central Station', direction: 'Westbound', platform: null, offset: 0 },

  { route: '72', station: 'Northgate Transit Center', destination: 'Willowdale Station', direction: 'Southbound', platform: null, offset: 0 },
  { route: '72', station: 'Willowdale Station', destination: 'Northgate Transit Center', direction: 'Northbound', platform: null, offset: 0 },

  { route: '88', station: 'Central Station', destination: 'Fairview Heights', direction: 'Outbound', platform: null, offset: 0 },
  { route: '88', station: 'Fairview Heights', destination: 'Central Station', direction: 'Inbound', platform: null, offset: 0 },

  { route: '95', station: 'Central Station', destination: 'Riverside Park & Ride', direction: 'Southbound', platform: null, offset: 0 },
  { route: '95', station: 'City Hall', destination: 'Riverside Park & Ride', direction: 'Southbound', platform: null, offset: 5 },
  { route: '95', station: 'Riverside Park & Ride', destination: 'City Hall', direction: 'Northbound', platform: null, offset: 0 },

  { route: '104', station: 'Central Station', destination: 'Cedarbrook Station', direction: 'Outbound', platform: null, offset: 0 },
  { route: '104', station: 'Cedarbrook Station', destination: 'Central Station', direction: 'Inbound', platform: null, offset: 0 },

  { route: '116', station: 'Waterfront Terminal', destination: 'Hillcrest Village', direction: 'Northbound', platform: null, offset: 0 },
  { route: '116', station: 'Hillcrest Village', destination: 'Waterfront Terminal', direction: 'Southbound', platform: null, offset: 0 },

  { route: '143', station: 'Central Station', destination: 'Pinewood Estates', direction: 'Outbound', platform: null, offset: 0 },
  { route: '143', station: 'Pinewood Estates', destination: 'Central Station', direction: 'Inbound', platform: null, offset: 0 },

  { route: '215', station: 'Central Station', destination: 'Mountainview Heights', direction: 'Outbound', platform: null, offset: 0 },
  { route: '215', station: 'Mountainview Heights', destination: 'Central Station', direction: 'Inbound', platform: null, offset: 0 },

  { route: 'N10', station: 'Central Station', destination: 'Northgate Transit Center', direction: 'Northbound', platform: null, offset: 0 },
  { route: 'N10', station: 'Central Station', destination: 'Willowdale Station', direction: 'Southbound', platform: null, offset: 4 },
  { route: 'N10', station: 'Northgate Transit Center', destination: 'Willowdale Station', direction: 'Southbound', platform: null, offset: 0 },
  { route: 'N10', station: 'Willowdale Station', destination: 'Northgate Transit Center', direction: 'Northbound', platform: null, offset: 0 },
];

async function main() {
  console.log('Seeding Cascadia Metro Transit database...');
  console.log('==========================================');
  
  // Clear existing data
  await prisma.routeStop.deleteMany();
  await prisma.routePattern.deleteMany();
  await prisma.station.deleteMany();
  
  // Create stations
  const createdStations = {};
  for (const station of stations) {
    const created = await prisma.station.create({ data: station });
    createdStations[station.name] = created;
  }
  console.log(`Created ${stations.length} stations`);
  
  // Create route patterns
  const createdRoutes = {};
  for (const route of routePatterns) {
    const created = await prisma.routePattern.create({ data: route });
    createdRoutes[route.routeNumber] = created;
  }
  console.log(`Created ${routePatterns.length} route patterns`);
  
  // Create route stops
  let stopCount = 0;
  for (const def of routeStopDefinitions) {
    const routePattern = createdRoutes[def.route];
    const station = createdStations[def.station];
    
    if (!routePattern || !station) {
      console.warn(`Skipping: ${def.route} at ${def.station} - not found`);
      continue;
    }
    
    await prisma.routeStop.create({
      data: {
        routePatternId: routePattern.id,
        stationId: station.id,
        destination: def.destination,
        direction: def.direction || null,
        platform: def.platform || null,
        headsign: `${def.route} to ${def.destination}`,
        offsetMinutes: def.offset || 0,
      }
    });
    stopCount++;
  }
  
  console.log(`Created ${stopCount} route stops`);
  console.log('==========================================');
  console.log('');
  console.log('Schedule patterns support variable frequencies throughout the day.');
  console.log('Example: Route 116 runs every 17 min (AM peak), 24 min (midday), 19 min (evening)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
