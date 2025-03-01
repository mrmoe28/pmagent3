"use client";

import { useState } from "react";
import { useProjectStore } from "@/app/lib/store/projectStore";
import { Project, EquipmentItem } from "@/app/types/project.types";
import { FileUpload } from "@/app/components/ui/file-upload";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { analyzePdf, searchInstallationInstructions, generateBillOfMaterials } from "@/app/lib/services/pdfAnalyzer";
import { Loader2, FileText, Search, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

interface PlanSetUploaderProps {
  project?: Project;
}

export function PlanSetUploader({ project }: PlanSetUploaderProps) {
  const { addAttachment, markAttachmentAnalyzed, addEquipment, generateBillOfMaterials: generateBOM } = useProjectStore();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedAttachmentId, setAnalyzedAttachmentId] = useState<string | null>(null);
  const [extractedEquipment, setExtractedEquipment] = useState<EquipmentItem[]>([]);
  const [searchingInstallation, setSearchingInstallation] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !project) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      // In a real app, you would upload the file to a server
      // For this demo, we'll create a data URL
      const reader = new FileReader();
      
      reader.onload = async () => {
        const fileUrl = reader.result as string;
        
        // Add the attachment to the project
        addAttachment(project.id, {
          name: selectedFile.name,
          url: fileUrl,
          type: 'pdf',
          size: selectedFile.size,
        });
        
        setSuccess(`Successfully uploaded ${selectedFile.name}`);
        setSelectedFile(null);
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        setError("Failed to read the file. Please try again.");
        setIsUploading(false);
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("An error occurred while uploading the file. Please try again.");
      setIsUploading(false);
    }
  };
  
  const handleAnalyze = async (attachmentId: string, url: string) => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    setAnalyzedAttachmentId(attachmentId);
    setError(null);
    setSuccess(null);
    setExtractedEquipment([]);
    
    try {
      // Analyze the PDF to extract equipment data
      const equipment = await analyzePdf(url);
      
      // Update the attachment with the extracted equipment
      markAttachmentAnalyzed(project!.id, attachmentId, equipment);
      
      // Store the extracted equipment for display
      setExtractedEquipment(equipment);
      
      setSuccess("Successfully analyzed the plan set and extracted equipment data");
    } catch (err) {
      console.error("Error analyzing PDF:", err);
      setError("An error occurred while analyzing the plan set. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleSearchInstallation = async (equipmentId: string) => {
    const equipment = extractedEquipment.find(e => e.id === equipmentId);
    if (!equipment) return;
    
    setSearchingInstallation(prev => ({ ...prev, [equipmentId]: true }));
    
    try {
      const url = await searchInstallationInstructions(equipment);
      
      // Update the equipment with the installation URL
      if (url) {
        const updatedEquipment = extractedEquipment.map(e => 
          e.id === equipmentId ? { ...e, installationUrl: url } : e
        );
        setExtractedEquipment(updatedEquipment);
      }
    } catch (err) {
      console.error("Error searching for installation instructions:", err);
    } finally {
      setSearchingInstallation(prev => ({ ...prev, [equipmentId]: false }));
    }
  };
  
  const handleAddToProject = () => {
    if (!project || extractedEquipment.length === 0) return;
    
    // Add each equipment item to the project
    extractedEquipment.forEach(equipment => {
      addEquipment(project.id, {
        name: equipment.name,
        manufacturer: equipment.manufacturer,
        model: equipment.model,
        quantity: equipment.quantity,
        specifications: equipment.specifications,
        installationUrl: equipment.installationUrl,
      });
    });
    
    // Generate a bill of materials
    generateBOM(project.id);
    
    setSuccess("Equipment added to project and bill of materials generated");
    setExtractedEquipment([]);
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Calculate totals for the bill of materials
  const bomSummary = generateBillOfMaterials(extractedEquipment);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Plan Set</CardTitle>
          <CardDescription>
            Upload PDF plan sets to analyze equipment and generate a bill of materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept=".pdf,application/pdf"
              label="Upload Plan Set PDF"
              buttonText="Select PDF"
              maxSizeMB={20}
              allowedFileTypes={["application/pdf"]}
            />
            
            {selectedFile && (
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">{selectedFile.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <p>{success}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {project && project.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analyze Plan Sets</CardTitle>
            <CardDescription>
              Analyze uploaded plan sets to extract equipment data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.attachments
                .filter(attachment => attachment.type === 'pdf')
                .map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">{attachment.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.size)} • {new Date(attachment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(attachment.url, '_blank')}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => handleAnalyze(attachment.id, attachment.url)}
                        disabled={isAnalyzing && analyzedAttachmentId === attachment.id}
                        size="sm"
                        className={attachment.analyzed ? "bg-green-500 hover:bg-green-600 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}
                      >
                        {isAnalyzing && analyzedAttachmentId === attachment.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : attachment.analyzed ? (
                          "Re-analyze"
                        ) : (
                          "Analyze"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {extractedEquipment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Equipment</CardTitle>
            <CardDescription>
              Equipment data extracted from the plan set
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Solar Panels</h3>
                  <p className="text-2xl font-bold">{bomSummary.totalPanels}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Inverters</h3>
                  <p className="text-2xl font-bold">{bomSummary.totalInverters}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-1">Additional Items</h3>
                  <p className="text-2xl font-bold">{bomSummary.additionalItems}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {extractedEquipment.map(equipment => (
                  <div key={equipment.id} className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b">
                      <h3 className="font-medium">{equipment.name}</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Manufacturer</p>
                          <p className="font-medium">{equipment.manufacturer}</p>
                        </div>
                        {equipment.model && (
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
                            <p className="font-medium">{equipment.model}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                          <p className="font-medium">{equipment.quantity}</p>
                        </div>
                      </div>
                      
                      {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Specifications</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(equipment.specifications).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-medium">{key}: </span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        {equipment.installationUrl ? (
                          <a
                            href={equipment.installationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Installation Instructions
                          </a>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSearchInstallation(equipment.id)}
                            disabled={searchingInstallation[equipment.id]}
                          >
                            {searchingInstallation[equipment.id] ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching...
                              </>
                            ) : (
                              <>
                                <Search className="mr-2 h-4 w-4" />
                                Find Installation Instructions
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleAddToProject}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Add to Project & Generate Bill of Materials
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 