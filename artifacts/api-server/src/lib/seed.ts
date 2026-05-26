import { db } from "@workspace/db";
import { flightsTable } from "@workspace/db";
import { inArray } from "drizzle-orm";
import { logger } from "./logger";

const SEED_FLIGHTS = [
  // London → New York
  { flightNumber: "TT001",  origin: "London", originCode: "LHR", destination: "New York",     destinationCode: "JFK", departDate: "2026-07-10", departTime: "09:00", arriveTime: "11:45", duration: "7h 45m",  cabinClass: "economy", price: "425.00",  seatsAvailable: 120, aircraft: "Boeing 787-9",     imageUrl: "/images/dest-ny.png" },
  { flightNumber: "TT001P", origin: "London", originCode: "LHR", destination: "New York",     destinationCode: "JFK", departDate: "2026-07-10", departTime: "09:00", arriveTime: "11:45", duration: "7h 45m",  cabinClass: "premium", price: "1250.00", seatsAvailable: 28,  aircraft: "Boeing 787-9",     imageUrl: "/images/dest-ny.png" },
  { flightNumber: "TT001U", origin: "London", originCode: "LHR", destination: "New York",     destinationCode: "JFK", departDate: "2026-07-10", departTime: "09:00", arriveTime: "11:45", duration: "7h 45m",  cabinClass: "upper",   price: "4200.00", seatsAvailable: 14,  aircraft: "Boeing 787-9",     imageUrl: "/images/dest-ny.png" },
  // London → Dubai
  { flightNumber: "TT200",  origin: "London", originCode: "LHR", destination: "Dubai",        destinationCode: "DXB", departDate: "2026-07-18", departTime: "14:30", arriveTime: "00:30", duration: "7h 00m",  cabinClass: "economy", price: "489.00",  seatsAvailable: 90,  aircraft: "Airbus A350-1000", imageUrl: "/images/dest-dubai.png" },
  { flightNumber: "TT200P", origin: "London", originCode: "LHR", destination: "Dubai",        destinationCode: "DXB", departDate: "2026-07-18", departTime: "14:30", arriveTime: "00:30", duration: "7h 00m",  cabinClass: "premium", price: "1450.00", seatsAvailable: 24,  aircraft: "Airbus A350-1000", imageUrl: "/images/dest-dubai.png" },
  { flightNumber: "TT200U", origin: "London", originCode: "LHR", destination: "Dubai",        destinationCode: "DXB", departDate: "2026-07-18", departTime: "14:30", arriveTime: "00:30", duration: "7h 00m",  cabinClass: "upper",   price: "3800.00", seatsAvailable: 12,  aircraft: "Airbus A350-1000", imageUrl: "/images/dest-dubai.png" },
  // London → Los Angeles
  { flightNumber: "TT300",  origin: "London", originCode: "LHR", destination: "Los Angeles",  destinationCode: "LAX", departDate: "2026-08-02", departTime: "11:15", arriveTime: "14:00", duration: "10h 45m", cabinClass: "economy", price: "512.00",  seatsAvailable: 80,  aircraft: "Airbus A350-900",  imageUrl: "/images/dest-la.png" },
  { flightNumber: "TT300P", origin: "London", originCode: "LHR", destination: "Los Angeles",  destinationCode: "LAX", departDate: "2026-08-02", departTime: "11:15", arriveTime: "14:00", duration: "10h 45m", cabinClass: "premium", price: "1650.00", seatsAvailable: 22,  aircraft: "Airbus A350-900",  imageUrl: "/images/dest-la.png" },
  { flightNumber: "TT300U", origin: "London", originCode: "LHR", destination: "Los Angeles",  destinationCode: "LAX", departDate: "2026-08-02", departTime: "11:15", arriveTime: "14:00", duration: "10h 45m", cabinClass: "upper",   price: "5800.00", seatsAvailable: 10,  aircraft: "Airbus A350-900",  imageUrl: "/images/dest-la.png" },
  // London → Barbados
  { flightNumber: "TT400",  origin: "London", originCode: "LHR", destination: "Barbados",     destinationCode: "BGI", departDate: "2026-08-14", departTime: "10:00", arriveTime: "14:30", duration: "8h 30m",  cabinClass: "economy", price: "580.00",  seatsAvailable: 110, aircraft: "Boeing 787-9",     imageUrl: "/images/dest-barbados.png" },
  { flightNumber: "TT400P", origin: "London", originCode: "LHR", destination: "Barbados",     destinationCode: "BGI", departDate: "2026-08-14", departTime: "10:00", arriveTime: "14:30", duration: "8h 30m",  cabinClass: "premium", price: "1800.00", seatsAvailable: 20,  aircraft: "Boeing 787-9",     imageUrl: "/images/dest-barbados.png" },
  { flightNumber: "TT400U", origin: "London", originCode: "LHR", destination: "Barbados",     destinationCode: "BGI", departDate: "2026-08-14", departTime: "10:00", arriveTime: "14:30", duration: "8h 30m",  cabinClass: "upper",   price: "4500.00", seatsAvailable: 8,   aircraft: "Boeing 787-9",     imageUrl: "/images/dest-barbados.png" },
  // London → Miami
  { flightNumber: "TT500",  origin: "London", originCode: "LHR", destination: "Miami",        destinationCode: "MIA", departDate: "2026-09-05", departTime: "08:45", arriveTime: "13:00", duration: "9h 15m",  cabinClass: "economy", price: "450.00",  seatsAvailable: 95,  aircraft: "Boeing 787-9",     imageUrl: "/images/dest-miami.png" },
  { flightNumber: "TT500P", origin: "London", originCode: "LHR", destination: "Miami",        destinationCode: "MIA", departDate: "2026-09-05", departTime: "08:45", arriveTime: "13:00", duration: "9h 15m",  cabinClass: "premium", price: "1350.00", seatsAvailable: 26,  aircraft: "Boeing 787-9",     imageUrl: "/images/dest-miami.png" },
  // London → Mumbai
  { flightNumber: "TT600",  origin: "London", originCode: "LHR", destination: "Mumbai",       destinationCode: "BOM", departDate: "2026-09-20", departTime: "21:00", arriveTime: "10:30", duration: "9h 30m",  cabinClass: "economy", price: "550.00",  seatsAvailable: 70,  aircraft: "Airbus A350-1000", imageUrl: "/images/dest-mumbai.png" },
  { flightNumber: "TT600P", origin: "London", originCode: "LHR", destination: "Mumbai",       destinationCode: "BOM", departDate: "2026-09-20", departTime: "21:00", arriveTime: "10:30", duration: "9h 30m",  cabinClass: "premium", price: "1700.00", seatsAvailable: 18,  aircraft: "Airbus A350-1000", imageUrl: "/images/dest-mumbai.png" },
  // London → Hong Kong
  { flightNumber: "TT700",  origin: "London", originCode: "LHR", destination: "Hong Kong",    destinationCode: "HKG", departDate: "2026-10-08", departTime: "22:30", arriveTime: "17:45", duration: "11h 15m", cabinClass: "economy", price: "680.00",  seatsAvailable: 65,  aircraft: "Airbus A350-900",  imageUrl: "/images/dest-hongkong.png" },
  { flightNumber: "TT700U", origin: "London", originCode: "LHR", destination: "Hong Kong",    destinationCode: "HKG", departDate: "2026-10-08", departTime: "22:30", arriveTime: "17:45", duration: "11h 15m", cabinClass: "upper",   price: "6200.00", seatsAvailable: 8,   aircraft: "Airbus A350-900",  imageUrl: "/images/dest-hongkong.png" },
  // London → Johannesburg
  { flightNumber: "TT800",  origin: "London", originCode: "LHR", destination: "Johannesburg", destinationCode: "JNB", departDate: "2026-10-22", departTime: "18:30", arriveTime: "08:00", duration: "11h 30m", cabinClass: "economy", price: "620.00",  seatsAvailable: 75,  aircraft: "Boeing 787-9",     imageUrl: "/images/dest-johannesburg.png" },
  { flightNumber: "TT800P", origin: "London", originCode: "LHR", destination: "Johannesburg", destinationCode: "JNB", departDate: "2026-10-22", departTime: "18:30", arriveTime: "08:00", duration: "11h 30m", cabinClass: "premium", price: "1950.00", seatsAvailable: 16,  aircraft: "Boeing 787-9",     imageUrl: "/images/dest-johannesburg.png" },

  // London → Paris
  { flightNumber: "TT101",  origin: "London", originCode: "LHR", destination: "Paris",        destinationCode: "CDG", departDate: "2026-07-12", departTime: "07:30", arriveTime: "09:45", duration: "1h 15m",  cabinClass: "economy", price: "89.00",   seatsAvailable: 160, aircraft: "Airbus A320",      imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT101P", origin: "London", originCode: "LHR", destination: "Paris",        destinationCode: "CDG", departDate: "2026-07-12", departTime: "07:30", arriveTime: "09:45", duration: "1h 15m",  cabinClass: "premium", price: "320.00",  seatsAvailable: 30,  aircraft: "Airbus A320",      imageUrl: "/images/hero-bg.png" },
  // London → Amsterdam
  { flightNumber: "TT102",  origin: "London", originCode: "LHR", destination: "Amsterdam",    destinationCode: "AMS", departDate: "2026-07-14", departTime: "06:45", arriveTime: "09:00", duration: "1h 15m",  cabinClass: "economy", price: "95.00",   seatsAvailable: 150, aircraft: "Airbus A320",      imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT102P", origin: "London", originCode: "LHR", destination: "Amsterdam",    destinationCode: "AMS", departDate: "2026-07-14", departTime: "06:45", arriveTime: "09:00", duration: "1h 15m",  cabinClass: "premium", price: "280.00",  seatsAvailable: 28,  aircraft: "Airbus A320",      imageUrl: "/images/hero-bg.png" },
  // London → Barcelona
  { flightNumber: "TT103",  origin: "London", originCode: "LHR", destination: "Barcelona",    destinationCode: "BCN", departDate: "2026-07-16", departTime: "08:00", arriveTime: "11:15", duration: "2h 15m",  cabinClass: "economy", price: "115.00",  seatsAvailable: 140, aircraft: "Airbus A320",      imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT103P", origin: "London", originCode: "LHR", destination: "Barcelona",    destinationCode: "BCN", departDate: "2026-07-16", departTime: "08:00", arriveTime: "11:15", duration: "2h 15m",  cabinClass: "premium", price: "340.00",  seatsAvailable: 26,  aircraft: "Airbus A320",      imageUrl: "/images/hero-bg.png" },
  // London → Rome
  { flightNumber: "TT104",  origin: "London", originCode: "LHR", destination: "Rome",         destinationCode: "FCO", departDate: "2026-07-20", departTime: "07:15", arriveTime: "10:45", duration: "2h 30m",  cabinClass: "economy", price: "125.00",  seatsAvailable: 135, aircraft: "Airbus A320",      imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT104P", origin: "London", originCode: "LHR", destination: "Rome",         destinationCode: "FCO", departDate: "2026-07-20", departTime: "07:15", arriveTime: "10:45", duration: "2h 30m",  cabinClass: "premium", price: "360.00",  seatsAvailable: 24,  aircraft: "Airbus A320",      imageUrl: "/images/hero-bg.png" },
  // London → Lisbon
  { flightNumber: "TT105",  origin: "London", originCode: "LHR", destination: "Lisbon",       destinationCode: "LIS", departDate: "2026-08-06", departTime: "09:30", arriveTime: "11:45", duration: "2h 15m",  cabinClass: "economy", price: "105.00",  seatsAvailable: 145, aircraft: "Airbus A320",      imageUrl: "/images/hero-bg.png" },
  // London → Chicago
  { flightNumber: "TT106",  origin: "London", originCode: "LHR", destination: "Chicago",      destinationCode: "ORD", departDate: "2026-08-10", departTime: "10:30", arriveTime: "13:15", duration: "8h 45m",  cabinClass: "economy", price: "410.00",  seatsAvailable: 105, aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT106P", origin: "London", originCode: "LHR", destination: "Chicago",      destinationCode: "ORD", departDate: "2026-08-10", departTime: "10:30", arriveTime: "13:15", duration: "8h 45m",  cabinClass: "premium", price: "1200.00", seatsAvailable: 24,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  // London → Bali
  { flightNumber: "TT107",  origin: "London", originCode: "LHR", destination: "Bali",         destinationCode: "DPS", departDate: "2026-09-02", departTime: "00:30", arriveTime: "21:00", duration: "16h 30m", cabinClass: "economy", price: "760.00",  seatsAvailable: 75,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT107P", origin: "London", originCode: "LHR", destination: "Bali",         destinationCode: "DPS", departDate: "2026-09-02", departTime: "00:30", arriveTime: "21:00", duration: "16h 30m", cabinClass: "premium", price: "2200.00", seatsAvailable: 18,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT107U", origin: "London", originCode: "LHR", destination: "Bali",         destinationCode: "DPS", departDate: "2026-09-02", departTime: "00:30", arriveTime: "21:00", duration: "16h 30m", cabinClass: "upper",   price: "7200.00", seatsAvailable: 8,   aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  // London → Mexico City
  { flightNumber: "TT108",  origin: "London", originCode: "LHR", destination: "Mexico City",  destinationCode: "MEX", departDate: "2026-09-18", departTime: "11:00", arriveTime: "15:30", duration: "11h 30m", cabinClass: "economy", price: "560.00",  seatsAvailable: 90,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT108P", origin: "London", originCode: "LHR", destination: "Mexico City",  destinationCode: "MEX", departDate: "2026-09-18", departTime: "11:00", arriveTime: "15:30", duration: "11h 30m", cabinClass: "premium", price: "1650.00", seatsAvailable: 20,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  // London → Cancun
  { flightNumber: "TT109",  origin: "London", originCode: "LHR", destination: "Cancun",       destinationCode: "CUN", departDate: "2026-10-01", departTime: "09:30", arriveTime: "14:00", duration: "10h 30m", cabinClass: "economy", price: "490.00",  seatsAvailable: 110, aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT109P", origin: "London", originCode: "LHR", destination: "Cancun",       destinationCode: "CUN", departDate: "2026-10-01", departTime: "09:30", arriveTime: "14:00", duration: "10h 30m", cabinClass: "premium", price: "1400.00", seatsAvailable: 22,  aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  // London → Toronto
  { flightNumber: "TT110",  origin: "London", originCode: "LHR", destination: "Toronto",      destinationCode: "YYZ", departDate: "2026-07-30", departTime: "10:00", arriveTime: "12:30", duration: "8h 30m",  cabinClass: "economy", price: "395.00",  seatsAvailable: 100, aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT110P", origin: "London", originCode: "LHR", destination: "Toronto",      destinationCode: "YYZ", departDate: "2026-07-30", departTime: "10:00", arriveTime: "12:30", duration: "8h 30m",  cabinClass: "premium", price: "1100.00", seatsAvailable: 24,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  // London → Athens
  { flightNumber: "TT112",  origin: "London", originCode: "LHR", destination: "Athens",       destinationCode: "ATH", departDate: "2026-08-25", departTime: "06:30", arriveTime: "11:30", duration: "3h 00m",  cabinClass: "economy", price: "145.00",  seatsAvailable: 130, aircraft: "Airbus A321",      imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT112P", origin: "London", originCode: "LHR", destination: "Athens",       destinationCode: "ATH", departDate: "2026-08-25", departTime: "06:30", arriveTime: "11:30", duration: "3h 00m",  cabinClass: "premium", price: "420.00",  seatsAvailable: 24,  aircraft: "Airbus A321",      imageUrl: "/images/hero-bg.png" },
  // London → Istanbul
  { flightNumber: "TT113",  origin: "London", originCode: "LHR", destination: "Istanbul",     destinationCode: "IST", departDate: "2026-09-08", departTime: "08:30", arriveTime: "13:30", duration: "4h 00m",  cabinClass: "economy", price: "185.00",  seatsAvailable: 120, aircraft: "Boeing 737-900",   imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT113P", origin: "London", originCode: "LHR", destination: "Istanbul",     destinationCode: "IST", departDate: "2026-09-08", departTime: "08:30", arriveTime: "13:30", duration: "4h 00m",  cabinClass: "premium", price: "520.00",  seatsAvailable: 20,  aircraft: "Boeing 737-900",   imageUrl: "/images/hero-bg.png" },
  // London → Kuala Lumpur
  { flightNumber: "TT114",  origin: "London", originCode: "LHR", destination: "Kuala Lumpur", destinationCode: "KUL", departDate: "2026-11-05", departTime: "21:45", arriveTime: "17:00", duration: "13h 15m", cabinClass: "economy", price: "640.00",  seatsAvailable: 85,  aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT114P", origin: "London", originCode: "LHR", destination: "Kuala Lumpur", destinationCode: "KUL", departDate: "2026-11-05", departTime: "21:45", arriveTime: "17:00", duration: "13h 15m", cabinClass: "premium", price: "1850.00", seatsAvailable: 22,  aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  // London → Singapore
  { flightNumber: "TT120",  origin: "London", originCode: "LHR", destination: "Singapore",    destinationCode: "SIN", departDate: "2026-08-20", departTime: "23:30", arriveTime: "18:15", duration: "12h 45m", cabinClass: "economy", price: "650.00",  seatsAvailable: 90,  aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT120P", origin: "London", originCode: "LHR", destination: "Singapore",    destinationCode: "SIN", departDate: "2026-08-20", departTime: "23:30", arriveTime: "18:15", duration: "12h 45m", cabinClass: "premium", price: "1900.00", seatsAvailable: 22,  aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT120U", origin: "London", originCode: "LHR", destination: "Singapore",    destinationCode: "SIN", departDate: "2026-08-20", departTime: "23:30", arriveTime: "18:15", duration: "12h 45m", cabinClass: "upper",   price: "6500.00", seatsAvailable: 10,  aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  // London → Cape Town
  { flightNumber: "TT130",  origin: "London", originCode: "LHR", destination: "Cape Town",    destinationCode: "CPT", departDate: "2026-09-12", departTime: "19:00", arriveTime: "07:30", duration: "11h 30m", cabinClass: "economy", price: "590.00",  seatsAvailable: 80,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT130P", origin: "London", originCode: "LHR", destination: "Cape Town",    destinationCode: "CPT", departDate: "2026-09-12", departTime: "19:00", arriveTime: "07:30", duration: "11h 30m", cabinClass: "premium", price: "1750.00", seatsAvailable: 20,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  // London → Bangkok
  { flightNumber: "TT140",  origin: "London", originCode: "LHR", destination: "Bangkok",      destinationCode: "BKK", departDate: "2026-09-28", departTime: "22:00", arriveTime: "16:30", duration: "11h 30m", cabinClass: "economy", price: "530.00",  seatsAvailable: 95,  aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT140P", origin: "London", originCode: "LHR", destination: "Bangkok",      destinationCode: "BKK", departDate: "2026-09-28", departTime: "22:00", arriveTime: "16:30", duration: "11h 30m", cabinClass: "premium", price: "1600.00", seatsAvailable: 22,  aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  // London → Maldives
  { flightNumber: "TT150",  origin: "London", originCode: "LHR", destination: "Maldives",     destinationCode: "MLE", departDate: "2026-10-05", departTime: "08:00", arriveTime: "22:30", duration: "10h 30m", cabinClass: "economy", price: "780.00",  seatsAvailable: 60,  aircraft: "Airbus A350-1000", imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT150U", origin: "London", originCode: "LHR", destination: "Maldives",     destinationCode: "MLE", departDate: "2026-10-05", departTime: "08:00", arriveTime: "22:30", duration: "10h 30m", cabinClass: "upper",   price: "8200.00", seatsAvailable: 6,   aircraft: "Airbus A350-1000", imageUrl: "/images/hero-bg.png" },
  // London → New Delhi
  { flightNumber: "TT160",  origin: "London", originCode: "LHR", destination: "New Delhi",    destinationCode: "DEL", departDate: "2026-10-15", departTime: "21:30", arriveTime: "10:00", duration: "8h 30m",  cabinClass: "economy", price: "490.00",  seatsAvailable: 85,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT160P", origin: "London", originCode: "LHR", destination: "New Delhi",    destinationCode: "DEL", departDate: "2026-10-15", departTime: "21:30", arriveTime: "10:00", duration: "8h 30m",  cabinClass: "premium", price: "1400.00", seatsAvailable: 20,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  // London → Nairobi
  { flightNumber: "TT170",  origin: "London", originCode: "LHR", destination: "Nairobi",      destinationCode: "NBO", departDate: "2026-11-01", departTime: "20:00", arriveTime: "06:30", duration: "8h 30m",  cabinClass: "economy", price: "545.00",  seatsAvailable: 75,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT170P", origin: "London", originCode: "LHR", destination: "Nairobi",      destinationCode: "NBO", departDate: "2026-11-01", departTime: "20:00", arriveTime: "06:30", duration: "8h 30m",  cabinClass: "premium", price: "1600.00", seatsAvailable: 18,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  // London → São Paulo
  { flightNumber: "TT180",  origin: "London", originCode: "LHR", destination: "Sao Paulo",    destinationCode: "GRU", departDate: "2026-11-14", departTime: "22:30", arriveTime: "06:45", duration: "11h 15m", cabinClass: "economy", price: "670.00",  seatsAvailable: 80,  aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT180P", origin: "London", originCode: "LHR", destination: "Sao Paulo",    destinationCode: "GRU", departDate: "2026-11-14", departTime: "22:30", arriveTime: "06:45", duration: "11h 15m", cabinClass: "premium", price: "2000.00", seatsAvailable: 18,  aircraft: "Airbus A350-900",  imageUrl: "/images/hero-bg.png" },
  // London → Tokyo
  { flightNumber: "TT900",  origin: "London", originCode: "LHR", destination: "Tokyo",        destinationCode: "NRT", departDate: "2026-07-22", departTime: "13:00", arriveTime: "09:30", duration: "11h 30m", cabinClass: "economy", price: "720.00",  seatsAvailable: 85,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT900P", origin: "London", originCode: "LHR", destination: "Tokyo",        destinationCode: "NRT", departDate: "2026-07-22", departTime: "13:00", arriveTime: "09:30", duration: "11h 30m", cabinClass: "premium", price: "2100.00", seatsAvailable: 20,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT900U", origin: "London", originCode: "LHR", destination: "Tokyo",        destinationCode: "NRT", departDate: "2026-07-22", departTime: "13:00", arriveTime: "09:30", duration: "11h 30m", cabinClass: "upper",   price: "6800.00", seatsAvailable: 10,  aircraft: "Boeing 787-9",     imageUrl: "/images/hero-bg.png" },
  // London → Sydney
  { flightNumber: "TT950",  origin: "London", originCode: "LHR", destination: "Sydney",       destinationCode: "SYD", departDate: "2026-08-08", departTime: "21:00", arriveTime: "06:00", duration: "21h 00m", cabinClass: "economy", price: "890.00",  seatsAvailable: 70,  aircraft: "Airbus A350-1000", imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT950P", origin: "London", originCode: "LHR", destination: "Sydney",       destinationCode: "SYD", departDate: "2026-08-08", departTime: "21:00", arriveTime: "06:00", duration: "21h 00m", cabinClass: "premium", price: "2400.00", seatsAvailable: 18,  aircraft: "Airbus A350-1000", imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT950U", origin: "London", originCode: "LHR", destination: "Sydney",       destinationCode: "SYD", departDate: "2026-08-08", departTime: "21:00", arriveTime: "06:00", duration: "21h 00m", cabinClass: "upper",   price: "7500.00", seatsAvailable: 8,   aircraft: "Airbus A350-1000", imageUrl: "/images/hero-bg.png" },
  // London → Shanghai
  { flightNumber: "TT111",  origin: "London", originCode: "LHR", destination: "Shanghai",     destinationCode: "PVG", departDate: "2026-10-18", departTime: "14:00", arriveTime: "08:30", duration: "10h 30m", cabinClass: "economy", price: "700.00",  seatsAvailable: 80,  aircraft: "Airbus A350-1000", imageUrl: "/images/hero-bg.png" },
  { flightNumber: "TT111P", origin: "London", originCode: "LHR", destination: "Shanghai",     destinationCode: "PVG", departDate: "2026-10-18", departTime: "14:00", arriveTime: "08:30", duration: "10h 30m", cabinClass: "premium", price: "2000.00", seatsAvailable: 20,  aircraft: "Airbus A350-1000", imageUrl: "/images/hero-bg.png" },
];

export async function seedFlights() {
  const allNumbers = SEED_FLIGHTS.map((f) => f.flightNumber);
  const existing = await db
    .select({ flightNumber: flightsTable.flightNumber })
    .from(flightsTable)
    .where(inArray(flightsTable.flightNumber, allNumbers));

  const existingSet = new Set(existing.map((r) => r.flightNumber));
  const toInsert = SEED_FLIGHTS.filter((f) => !existingSet.has(f.flightNumber));

  if (toInsert.length === 0) {
    logger.info("All flights already seeded, skipping.");
    return;
  }

  await db.insert(flightsTable).values(toInsert);
  logger.info({ count: toInsert.length }, "Seeded new flights");
}