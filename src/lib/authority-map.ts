export type AuthorityInfo = {
  name: string;
  contact: string;
  jurisdiction: string;
};

const MAP: Record<string, AuthorityInfo> = {
  pothole: { name: "GHMC Roads Department", contact: "040-2111-1111", jurisdiction: "Roads & Potholes" },
  road: { name: "GHMC Roads Department", contact: "040-2111-1111", jurisdiction: "Roads & Potholes" },
  garbage: { name: "GHMC Sanitation Wing", contact: "040-2111-1111", jurisdiction: "Solid Waste Management" },
  waste: { name: "GHMC Sanitation Wing", contact: "040-2111-1111", jurisdiction: "Solid Waste Management" },
  sewage: { name: "HMWSSB", contact: "155313", jurisdiction: "Water & Sewerage" },
  water: { name: "HMWSSB", contact: "155313", jurisdiction: "Water & Sewerage" },
  drainage: { name: "HMWSSB", contact: "155313", jurisdiction: "Water & Drainage" },
  streetlight: { name: "TSSPDCL", contact: "1912", jurisdiction: "Street Lighting & Power" },
  electricity: { name: "TSSPDCL", contact: "1912", jurisdiction: "Electricity" },
  power: { name: "TSSPDCL", contact: "1912", jurisdiction: "Electricity" },
  traffic: { name: "Hyderabad Traffic Police", contact: "9010203626", jurisdiction: "Traffic Management" },
  signal: { name: "Hyderabad Traffic Police", contact: "9010203626", jurisdiction: "Traffic Signals" },
  parking: { name: "Hyderabad Traffic Police", contact: "9010203626", jurisdiction: "Parking Violations" },
  tree: { name: "GHMC Urban Biodiversity", contact: "040-2111-1111", jurisdiction: "Trees & Parks" },
  park: { name: "GHMC Urban Biodiversity", contact: "040-2111-1111", jurisdiction: "Trees & Parks" },
  noise: { name: "Telangana Pollution Control Board", contact: "040-2335-9415", jurisdiction: "Noise Pollution" },
  pollution: { name: "Telangana Pollution Control Board", contact: "040-2335-9415", jurisdiction: "Pollution Control" },
  encroachment: { name: "GHMC Town Planning", contact: "040-2111-1111", jurisdiction: "Encroachments" },
  building: { name: "GHMC Town Planning", contact: "040-2111-1111", jurisdiction: "Illegal Construction" },
  stray: { name: "GHMC Veterinary Wing", contact: "040-2111-1111", jurisdiction: "Stray Animals" },
};

export function detectAuthority(issueType: string, description: string): AuthorityInfo {
  const haystack = `${issueType} ${description}`.toLowerCase();
  for (const key of Object.keys(MAP)) {
    if (haystack.includes(key)) return MAP[key];
  }
  return { name: "GHMC Citizen Services", contact: "040-2111-1111", jurisdiction: "General Civic Issues" };
}