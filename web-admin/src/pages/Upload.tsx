import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, FileSpreadsheet, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

interface UploadedFile {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  message?: string;
}

export function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadType, setUploadType] = useState("schools");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      status: "pending" as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") continue;

      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" as const, progress: 0 } : f))
      );

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, progress } : f))
        );
      }

      // Simulate success/error
      const success = Math.random() > 0.2;
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i
            ? {
                ...f,
                status: success ? "success" : "error",
                message: success ? "Uploaded successfully" : "Failed to process file",
              }
            : f
        )
      );
    }
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Data</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Import school data from CSV or Excel files
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Type</CardTitle>
              <CardDescription>Select the type of data you're uploading</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                <option value="schools">Schools</option>
                <option value="reviews">Reviews</option>
                <option value="fees">Fee Structure</option>
                <option value="facilities">Facilities</option>
                <option value="staff">Staff Information</option>
              </Select>
            </CardContent>
          </Card>

          {/* Dropzone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Files</CardTitle>
              <CardDescription>Drag and drop files or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5"
                    : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50"
                }`}
              >
                <input {...getInputProps()} />
                <UploadIcon className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
                {isDragActive ? (
                  <p className="text-[hsl(var(--primary))] font-medium">Drop files here...</p>
                ) : (
                  <>
                    <p className="font-medium mb-1">Drag & drop files here</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      or click to browse (CSV, XLS, XLSX - Max 10MB)
                    </p>
                  </>
                )}
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  {files.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border bg-white"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileSpreadsheet className="h-8 w-8 text-green-600 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{item.file.name}</p>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            {(item.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {item.status === "pending" && (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                        {item.status === "uploading" && (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--primary))]" />
                            <span className="text-sm">{item.progress}%</span>
                          </div>
                        )}
                        {item.status === "success" && (
                          <Badge variant="success">
                            <CheckCircle className="h-3 w-3 mr-1" /> Success
                          </Badge>
                        )}
                        {item.status === "error" && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" /> Error
                          </Badge>
                        )}
                        {item.status === "pending" && (
                          <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pendingCount > 0 && (
                <div className="mt-6 flex justify-end">
                  <Button onClick={uploadFiles}>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload {pendingCount} {pendingCount === 1 ? "File" : "Files"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Supported Formats</h4>
                <p className="text-[hsl(var(--muted-foreground))]">CSV, XLS, XLSX files up to 10MB</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Required Columns for Schools</h4>
                <ul className="text-[hsl(var(--muted-foreground))] list-disc list-inside space-y-1">
                  <li>name (required)</li>
                  <li>address (required)</li>
                  <li>city (required)</li>
                  <li>state (required)</li>
                  <li>board (CBSE/ICSE/IB/State)</li>
                  <li>type (Co-ed/Boys/Girls)</li>
                  <li>established_year</li>
                  <li>phone</li>
                  <li>email</li>
                  <li>website</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tips</h4>
                <ul className="text-[hsl(var(--muted-foreground))] list-disc list-inside space-y-1">
                  <li>Ensure column headers match exactly</li>
                  <li>Remove empty rows before uploading</li>
                  <li>Use UTF-8 encoding for CSV files</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Download Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Schools Template
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Reviews Template
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Fees Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
