import { EquipmentItem } from '@/app/types/project.types';

// Mock equipment database for demonstration purposes
const knownEquipment = [
  {
    name: 'Solar Panel',
    models: [
      { model: 'SP-400W', manufacturer: 'SunPower', specifications: { wattage: '400W', dimensions: '1.7m x 1.0m', efficiency: '22.8%' } },
      { model: 'LG-350N', manufacturer: 'LG', specifications: { wattage: '350W', dimensions: '1.6m x 1.0m', efficiency: '21.7%' } },
      { model: 'Q.PEAK-G9', manufacturer: 'Q CELLS', specifications: { wattage: '385W', dimensions: '1.7m x 1.0m', efficiency: '20.6%' } },
    ]
  },
  {
    name: 'Inverter',
    models: [
      { model: 'SB-7.7', manufacturer: 'SMA', specifications: { capacity: '7.7kW', efficiency: '97.5%' } },
      { model: 'SE-7600H', manufacturer: 'SolarEdge', specifications: { capacity: '7.6kW', efficiency: '99.0%' } },
      { model: 'IQ7+', manufacturer: 'Enphase', specifications: { capacity: '295VA', efficiency: '97.0%' } },
    ]
  },
  {
    name: 'Mounting System',
    models: [
      { model: 'RailMount-S', manufacturer: 'IronRidge', specifications: { material: 'Aluminum', load: '175 lbs/ft' } },
      { model: 'FlashFoot', manufacturer: 'QuickMount PV', specifications: { material: 'Aluminum', load: '150 lbs/ft' } },
    ]
  },
  {
    name: 'Battery',
    models: [
      { model: 'Powerwall 2', manufacturer: 'Tesla', specifications: { capacity: '13.5kWh', power: '7kW peak' } },
      { model: 'LG RESU10H', manufacturer: 'LG', specifications: { capacity: '9.8kWh', power: '5kW' } },
    ]
  },
];

// Mock installation instruction URLs
const installationUrls = {
  'SunPower': 'https://us.sunpower.com/sites/default/files/media-library/manuals/mn-sunpower-x-series-residential-installation-guide-532618-revb.pdf',
  'LG': 'https://www.lg.com/global/business/download/resources/solar/LG_Solar_Installation_Manual.pdf',
  'Q CELLS': 'https://www.q-cells.com/en/service/downloads/installation-guides',
  'SMA': 'https://files.sma.de/downloads/SB-US-IA-en-36.pdf',
  'SolarEdge': 'https://www.solaredge.com/sites/default/files/se-hd-wave-single-phase-inverter-installation-guide-na.pdf',
  'Enphase': 'https://enphase.com/download/iq7-iq7-iq7x-installation-and-operation-manual',
  'IronRidge': 'https://www.ironridge.com/downloads/pdfs/XR/XR_Installation_Manual.pdf',
  'QuickMount PV': 'https://quickmountpv.com/support/technical-documentation.html',
  'Tesla': 'https://www.tesla.com/sites/default/files/pdfs/powerwall/Powerwall_2_AC_Installation_Manual_en_NA.pdf',
};

/**
 * Analyzes a PDF document to extract equipment data
 * In a real application, this would use OCR and AI to extract data from the PDF
 * For this demo, we'll simulate the extraction with mock data
 */
export async function analyzePdf(pdfUrl: string): Promise<EquipmentItem[]> {
  console.log('Analyzing PDF:', pdfUrl);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, randomly select 2-4 equipment items
  const extractedEquipment: EquipmentItem[] = [];
  const numItems = Math.floor(Math.random() * 3) + 2; // 2-4 items
  
  const usedIndices = new Set<number>();
  
  for (let i = 0; i < numItems; i++) {
    // Select a random equipment type
    let equipmentTypeIndex: number;
    do {
      equipmentTypeIndex = Math.floor(Math.random() * knownEquipment.length);
    } while (usedIndices.has(equipmentTypeIndex));
    
    usedIndices.add(equipmentTypeIndex);
    
    const equipmentType = knownEquipment[equipmentTypeIndex];
    // Select a random model for this equipment type
    const modelIndex = Math.floor(Math.random() * equipmentType.models.length);
    const model = equipmentType.models[modelIndex];
    
    // Generate a random quantity between 1 and 30
    const quantity = equipmentType.name === 'Solar Panel' 
      ? Math.floor(Math.random() * 25) + 5 // 5-30 panels
      : equipmentType.name === 'Inverter' 
        ? Math.floor(Math.random() * 2) + 1 // 1-2 inverters
        : Math.floor(Math.random() * 5) + 1; // 1-5 for other equipment
    
    // Get installation URL if available
    const installationUrl = installationUrls[model.manufacturer as keyof typeof installationUrls];
    
    extractedEquipment.push({
      id: `${i}-${Date.now()}`, // Temporary ID, will be replaced when added to store
      name: equipmentType.name,
      manufacturer: model.manufacturer,
      model: model.model,
      quantity,
      specifications: model.specifications,
      installationUrl,
    });
  }
  
  return extractedEquipment;
}

/**
 * Searches for installation instructions for a specific equipment
 */
export async function searchInstallationInstructions(equipment: EquipmentItem): Promise<string | null> {
  console.log('Searching for installation instructions:', equipment.name, equipment.manufacturer);
  
  // Simulate search delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check if we have a URL for this manufacturer
  const url = installationUrls[equipment.manufacturer as keyof typeof installationUrls];
  
  if (url) {
    return url;
  }
  
  // Simulate a generic search result
  return `https://example.com/search?q=${encodeURIComponent(`${equipment.manufacturer} ${equipment.name} ${equipment.model || ''} installation manual`)}`;
}

/**
 * Generates a bill of materials based on equipment items
 */
export function generateBillOfMaterials(equipment: EquipmentItem[]): { items: EquipmentItem[], totalPanels: number, totalInverters: number, additionalItems: number } {
  const totalPanels = equipment
    .filter(item => item.name === 'Solar Panel')
    .reduce((sum, item) => sum + item.quantity, 0);
  
  const totalInverters = equipment
    .filter(item => item.name === 'Inverter')
    .reduce((sum, item) => sum + item.quantity, 0);
  
  const additionalItems = equipment
    .filter(item => item.name !== 'Solar Panel' && item.name !== 'Inverter')
    .reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    items: equipment,
    totalPanels,
    totalInverters,
    additionalItems
  };
} 