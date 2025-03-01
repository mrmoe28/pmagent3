"use client";

import { useState } from "react";
import { Project, EquipmentItem } from "@/app/types/project.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Download, Printer, ExternalLink, Search, Loader2 } from "lucide-react";
import { searchInstallationInstructions } from "@/app/lib/services/pdfAnalyzer";
import { useProjectStore } from "@/app/lib/store/projectStore";

interface BillOfMaterialsProps {
  project: Project;
}

export function BillOfMaterials({ project }: BillOfMaterialsProps) {
  const { updateEquipment } = useProjectStore();
  const [searchingInstallation, setSearchingInstallation] = useState<Record<string, boolean>>({});
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadCSV = () => {
    if (!project.equipment || project.equipment.length === 0) return;
    
    // Create CSV content
    const headers = ["Name", "Manufacturer", "Model", "Quantity", "Specifications"];
    const rows = project.equipment.map(item => [
      item.name,
      item.manufacturer,
      item.model || "",
      item.quantity.toString(),
      item.specifications ? Object.entries(item.specifications).map(([key, value]) => `${key}: ${value}`).join("; ") : ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${project.title.replace(/\s+/g, "_")}_BOM.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSearchInstallation = async (equipment: EquipmentItem) => {
    if (!equipment.id) return;
    
    setSearchingInstallation(prev => ({ ...prev, [equipment.id]: true }));
    
    try {
      const url = await searchInstallationInstructions(equipment);
      
      if (url) {
        updateEquipment(project.id, equipment.id, { installationUrl: url });
      }
    } catch (err) {
      console.error("Error searching for installation instructions:", err);
    } finally {
      setSearchingInstallation(prev => ({ ...prev, [equipment.id]: false }));
    }
  };
  
  // Group equipment by type
  const equipmentByType: Record<string, EquipmentItem[]> = {};
  
  if (project.equipment && project.equipment.length > 0) {
    project.equipment.forEach(item => {
      if (!equipmentByType[item.name]) {
        equipmentByType[item.name] = [];
      }
      equipmentByType[item.name].push(item);
    });
  }
  
  // Calculate totals
  const totalItems = project.equipment?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPanels = project.equipment?.filter(item => item.name === 'Solar Panel').reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  if (!project.equipment || project.equipment.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bill of Materials</CardTitle>
          <CardDescription>
            No equipment data available. Upload and analyze plan sets to generate a bill of materials.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold">Bill of Materials</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadCSV}>
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
      </div>
      
      <div className="print:hidden">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Total Items</h3>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Solar Panels</h3>
                <p className="text-2xl font-bold">{totalPanels}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-1">Equipment Types</h3>
                <p className="text-2xl font-bold">{Object.keys(equipmentByType).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="print:text-black">
        <div className="print:block print:mb-4 hidden">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-gray-600">{project.description}</p>
          <div className="mt-2 flex justify-between">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p>Total Items: {totalItems}</p>
          </div>
          <hr className="my-4" />
        </div>
        
        {Object.entries(equipmentByType).map(([type, items]) => (
          <Card key={type} className="mb-4 print:border print:shadow-none">
            <CardHeader className="print:py-2">
              <CardTitle className="print:text-lg">{type}</CardTitle>
            </CardHeader>
            <CardContent className="print:pt-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 print:px-2">Manufacturer</th>
                      <th className="text-left py-2 px-4 print:px-2">Model</th>
                      <th className="text-left py-2 px-4 print:px-2">Quantity</th>
                      <th className="text-left py-2 px-4 print:px-2 print:hidden">Specifications</th>
                      <th className="text-left py-2 px-4 print:px-2 print:hidden">Installation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-4 print:px-2">{item.manufacturer}</td>
                        <td className="py-2 px-4 print:px-2">{item.model || "-"}</td>
                        <td className="py-2 px-4 print:px-2">{item.quantity}</td>
                        <td className="py-2 px-4 print:px-2 print:hidden">
                          {item.specifications ? (
                            <div className="text-sm">
                              {Object.entries(item.specifications).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span> {value}
                                </div>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-2 px-4 print:px-2 print:hidden">
                          {item.installationUrl ? (
                            <a
                              href={item.installationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Instructions
                            </a>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSearchInstallation(item)}
                              disabled={searchingInstallation[item.id]}
                            >
                              {searchingInstallation[item.id] ? (
                                <>
                                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                  Searching...
                                </>
                              ) : (
                                <>
                                  <Search className="mr-1 h-3 w-3" />
                                  Find
                                </>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="print:block print:mt-8 hidden">
        <p className="text-sm text-gray-500">
          This bill of materials was generated automatically based on the plan set analysis.
          Please verify all quantities and specifications before ordering materials.
        </p>
      </div>
    </div>
  );
} 