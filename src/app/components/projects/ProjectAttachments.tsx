"use client";

import { useState, useRef } from "react";
import { useProjectStore } from "@/app/lib/store/projectStore";
import { Project } from "@/app/types/project.types";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { FileIcon, TrashIcon, DownloadIcon, PlusIcon } from "lucide-react";

interface ProjectAttachmentsProps {
  project: Project;
}

export function ProjectAttachments({ project }: ProjectAttachmentsProps) {
  const { addAttachment, deleteAttachment } = useProjectStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // In a real app, you would upload the file to a server here
      // For this demo, we'll simulate a file upload with a local URL
      const fileType = file.type.includes('pdf') 
        ? 'pdf' 
        : file.type.includes('image') 
          ? 'image' 
          : 'other';
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a local URL for the file (in a real app, this would be a server URL)
      const fileUrl = URL.createObjectURL(file);
      
      // Add the attachment to the project
      addAttachment(project.id, {
        name: file.name,
        url: fileUrl,
        type: fileType,
        size: file.size,
      });
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    deleteAttachment(project.id, attachmentId);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Attachments</CardTitle>
        <CardDescription>
          Upload and manage documents related to this project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="max-w-sm"
              disabled={isUploading}
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          
          {isUploading && (
            <div className="text-sm text-muted-foreground">
              Uploading file...
            </div>
          )}
          
          {project.attachments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No attachments yet. Upload files to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {project.attachments.map((attachment) => (
                <div 
                  key={attachment.id} 
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{attachment.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)} • {new Date(attachment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => window.open(attachment.url, '_blank')}
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteAttachment(attachment.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 