// src/constants/serviceCategories.js
export const SERVICE_CATEGORIES = {
  "🏠 Home Improvement & Construction": [
    "Electricians", "Plumbers", "Carpenters", "Painters", "Tilers",
    "POP Ceiling Installers", "Welders", "Aluminium Fabricators",
    "Roofers", "Building Contractors", "Architects", "Interior Designers"
  ],
  "🔧 Installations & Repairs": [
    "Air Conditioner Installation & Repair", "Generator Repair",
    "Borehole Drilling", "Handyman Services", "Appliance Repairs"
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
  ]
};

export const FLAT_SERVICES = Object.values(SERVICE_CATEGORIES).flat();

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  "Abuja (FCT)"
];