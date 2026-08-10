// src/constants/serviceCategories.js - UPDATED with new categories
//
// Nigerian state/LGA data used to live here as a hardcoded object. It's now
// served by the backend (single source of truth, also used for server-side
// validation) and fetched via the useLocations() hook instead — see
// src/hooks/useLocations.js.

export const SERVICE_CATEGORIES = {
  "🏠 Home Improvement & Construction": [
    "Electricians", "Plumbers", "Carpenters", "Painters", "Tilers",
    "POP Ceiling Installers", "Welders", "Aluminium Fabricators",
    "Roofers", "Building Contractors", "Architects", "Interior Designers",
    "Solar Panel Installation"
  ],
  "🔧 Installations & Repairs": [
    "Air Conditioner Installation & Repair", "Generator Repair",
    "Borehole Drilling", "Handyman Services", "Appliance Repairs",
    "Solar Inverter Installation & Repair"
  ],
  "🧹 Cleaning & Maintenance": [
    "Home Cleaning", "Office Cleaning", "Post-Construction Cleaning",
    "Laundry & Dry Cleaning", "Fumigation", "Pest Control"
  ],
  "🚗 Automotive Services": [
    "Mechanics", "Auto Electricians", "Car Diagnostics", "Panel Beaters",
    "Spray Painting", "Vulcanizer", "Car Detailing", "Towing Services"
  ],
  "💄 Beauty & Personal Care": [
    "Hair Stylists", "Barbers", "Makeup Artists", "Nail Technicians", "Spa & Massage"
  ],
  "🎉 Events & Entertainment": [
    "Event Planners", "Caterers", "MCs", "DJs", "Photographers",
    "Videographers", "Event Decorators", "Event Rentals"
  ],
  "💼 Business Services": [
    "Accountants", "Lawyers", "CAC Registration", "Branding & Graphic Design",
    "Printing Services", "Signage"
  ],
  "📚 Education & Tutoring": [
    "Primary School Tutors", "Secondary School Tutors", "University Tutors",
    "WAEC Tutors", "JAMB Tutors", "Mathematics Tutors", "English Tutors",
    "Science Tutors", "Coding Tutors", "Language Tutors", "Music Tutors",
    "Exam Preparation Tutors", "Computer Training", "Vocational Training",
    "Driving Schools", "Coding & Programming", "Language Training",
    "Music Training", "Adult Education"
  ],
  "🧵 Tailoring & Fashion": [
    "Fashion Designers", "Tailors", "Native Wear", "Corporate & English Wear",
    "Bridal Wear", "Children's Clothing", "Embroidery"
  ],
  "🪑 Furniture Making & Woodwork": [
    "Kitchen Cabinets", "Wardrobes", "TV Consoles", "Office Furniture",
    "Bedroom Furniture", "Dining Furniture", "Shelving", "Upholstery",
    "Furniture Repairs & Restoration"
  ]
};

export const FLAT_SERVICES = Object.values(SERVICE_CATEGORIES).flat();