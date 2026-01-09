import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simple hash function for deterministic "randomness"
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Generate deterministic status based on route, station, departure time
function getStatus(routeStopId, departureTime) {
  const timeWindow = Math.floor(departureTime.getTime() / (30 * 60 * 1000));
  const seed = `${routeStopId}-${timeWindow}`;
  const hash = simpleHash(seed);
  const rand = (hash % 1000) / 1000;
  
  if (rand < 0.80) {
    return { status: 'on-time', delayMinutes: null };
  } else if (rand < 0.95) {
    const delayHash = simpleHash(seed + '-delay');
    const delayMinutes = 3 + (delayHash % 13);
    return { status: 'delayed', delayMinutes };
  } else {
    return { status: 'cancelled', delayMinutes: null };
  }
}

// Parse time string "HH:MM" to minutes since midnight
function parseTime(timeStr) {
  const [hours, mins] = timeStr.split(':').map(Number);
  return hours * 60 + mins;
}

// Parse schedule pattern into periods
// Format: "HH:MM-HH:MM@freq,HH:MM-HH:MM@freq,..."
function parseSchedulePattern(pattern) {
  const periods = [];
  const segments = pattern.split(',');
  
  for (const segment of segments) {
    const [timeRange, freqStr] = segment.split('@');
    const [startStr, endStr] = timeRange.split('-');
    
    periods.push({
      startMins: parseTime(startStr),
      endMins: parseTime(endStr),
      frequencyMins: parseInt(freqStr, 10),
    });
  }
  
  return periods;
}

// Get the frequency for a given time of day
function getFrequencyForTime(periods, timeMins) {
  for (const period of periods) {
    // Handle overnight periods
    if (period.startMins > period.endMins) {
      // Overnight: e.g., 23:00-05:00
      if (timeMins >= period.startMins || timeMins < period.endMins) {
        return period;
      }
    } else {
      if (timeMins >= period.startMins && timeMins < period.endMins) {
        return period;
      }
    }
  }
  return null; // Outside service hours
}

// Generate upcoming departures for a route stop
function generateDepartures(routeStop, routePattern, count = 3) {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const offset = routeStop.offsetMinutes || 0;
  
  const periods = parseSchedulePattern(routePattern.schedulePattern);
  if (periods.length === 0) return [];
  
  const departures = [];
  let searchMins = currentMins;
  let daysAhead = 0;
  const maxIterations = 200; // Safety limit
  let iterations = 0;
  
  while (departures.length < count && iterations < maxIterations) {
    iterations++;
    
    // Find which period we're in
    const period = getFrequencyForTime(periods, searchMins);
    
    if (!period) {
      // Not in service, jump to next period start
      let nextStart = null;
      let minDistance = Infinity;
      
      for (const p of periods) {
        let distance = p.startMins - searchMins;
        if (distance <= 0) distance += 24 * 60; // Next day
        if (distance < minDistance) {
          minDistance = distance;
          nextStart = p.startMins;
        }
      }
      
      if (nextStart !== null) {
        if (nextStart <= searchMins) {
          daysAhead++;
        }
        searchMins = nextStart;
      } else {
        break;
      }
      continue;
    }
    
    // Calculate next departure in this period
    const periodStart = period.startMins;
    const freq = period.frequencyMins;
    
    // How many minutes since period start?
    let minsSincePeriodStart = searchMins - periodStart;
    if (minsSincePeriodStart < 0) minsSincePeriodStart += 24 * 60;
    
    // Next aligned departure
    const departuresSincePeriodStart = Math.ceil(minsSincePeriodStart / freq);
    let nextDepartureMins = periodStart + (departuresSincePeriodStart * freq) + offset;
    nextDepartureMins = nextDepartureMins % (24 * 60);
    
    // Check if this departure is still within the period
    let inPeriod = false;
    if (period.startMins > period.endMins) {
      // Overnight period
      inPeriod = nextDepartureMins >= period.startMins || nextDepartureMins < period.endMins;
    } else {
      inPeriod = nextDepartureMins >= period.startMins && nextDepartureMins < period.endMins;
    }
    
    if (!inPeriod) {
      // Move to next period
      searchMins = (period.endMins + 1) % (24 * 60);
      if (searchMins < currentMins && daysAhead === 0) {
        // We've wrapped to tomorrow
      }
      continue;
    }
    
    // Create departure time
    const departureTime = new Date(now);
    departureTime.setDate(departureTime.getDate() + daysAhead);
    departureTime.setHours(Math.floor(nextDepartureMins / 60), nextDepartureMins % 60, 0, 0);
    
    // If departure is in the past, try next one
    if (departureTime <= now) {
      searchMins = nextDepartureMins + 1;
      if (searchMins >= 24 * 60) {
        searchMins = 0;
        daysAhead++;
      }
      continue;
    }
    
    const statusInfo = getStatus(routeStop.id, departureTime);
    
    departures.push({
      id: `${routeStop.id}-${departureTime.getTime()}`,
      routeNumber: routePattern.routeNumber,
      routeType: routePattern.routeType,
      destination: routeStop.destination,
      direction: routeStop.direction,
      platform: routeStop.platform,
      headsign: routeStop.headsign,
      nextArrival: departureTime.toISOString(),
      ...statusInfo,
      stationId: routeStop.stationId,
    });
    
    // Move search forward for next departure
    searchMins = nextDepartureMins + freq;
    if (searchMins >= 24 * 60) {
      searchMins = searchMins % (24 * 60);
      daysAhead++;
    }
  }
  
  return departures;
}

// Get all stations
app.get('/api/stations', async (req, res) => {
  try {
    const stations = await prisma.station.findMany({
      orderBy: [
        { zone: 'asc' },
        { name: 'asc' },
      ],
    });
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

// Get departures for a station (generated dynamically)
app.get('/api/routes', async (req, res) => {
  try {
    const { type, status, stationId } = req.query;
    
    if (!stationId) {
      return res.status(400).json({ error: 'stationId is required' });
    }
    
    const routeStops = await prisma.routeStop.findMany({
      where: { stationId: parseInt(stationId) },
      include: { routePattern: true },
    });
    
    let allDepartures = [];
    for (const routeStop of routeStops) {
      const departures = generateDepartures(routeStop, routeStop.routePattern, 3);
      allDepartures.push(...departures);
    }
    
    // Apply filters
    if (type && type !== 'all') {
      allDepartures = allDepartures.filter(d => d.routeType === type);
    }
    if (status && status !== 'all') {
      allDepartures = allDepartures.filter(d => d.status === status);
    }
    
    // Sort by departure time
    allDepartures.sort((a, b) => new Date(a.nextArrival) - new Date(b.nextArrival));
    
    // Limit to reasonable number
    allDepartures = allDepartures.slice(0, 50);
    
    res.json(allDepartures);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Get single route pattern by ID
app.get('/api/routes/:id', async (req, res) => {
  try {
    const routePattern = await prisma.routePattern.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { routeStops: { include: { station: true } } },
    });
    
    if (!routePattern) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    res.json(routePattern);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// Get route pattern by route number (for detail page)
app.get('/api/route-patterns/:routeNumber', async (req, res) => {
  try {
    const routePattern = await prisma.routePattern.findFirst({
      where: { routeNumber: decodeURIComponent(req.params.routeNumber) },
      include: { 
        routeStops: { 
          include: { station: true },
          orderBy: { station: { name: 'asc' } }
        } 
      },
    });
    
    if (!routePattern) {
      return res.status(404).json({ error: 'Route not found' });
    }
    
    res.json(routePattern);
  } catch (error) {
    console.error('Error fetching route pattern:', error);
    res.status(500).json({ error: 'Failed to fetch route pattern' });
  }
});

app.listen(PORT, () => {
  console.log(`Cascadia Metro Transit API running on http://localhost:${PORT}`);
});
