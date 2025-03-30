
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import DrawingCanvas from "@/components/DrawingCanvas";
import FileUploader from "@/components/FileUploader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Paintbrush, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Create = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle drawing save
  const handleDrawingSave = (dataUrl: string) => {
    setImagePreview(dataUrl);
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Clear uploaded file
  const clearUpload = () => {
    setUploadedFile(null);
    setImagePreview(null);
  };

  // Submit artwork
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You must be logged in to post artwork");
      navigate("/login");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Please provide a title for your artwork");
      return;
    }
    
    if (!imagePreview) {
      toast.error("Please create or upload an image");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Artwork posted successfully!");
      
      // Navigate to explore page after successful post
      navigate("/explore");
    } catch (error) {
      toast.error("Failed to post artwork. Please try again.");
      console.error("Error posting artwork:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Create Artwork</h1>
        
        {!isAuthenticated ? (
          <div className="p-6 border rounded-lg bg-card text-center mb-8">
            <p className="text-lg mb-4">
              You need to be logged in to post artwork.
            </p>
            <Button onClick={() => navigate("/login")}>
              Log In to Continue
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="draw" className="mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                <TabsTrigger value="draw" className="flex items-center gap-2">
                  <Paintbrush size={16} />
                  Draw
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="draw" className="mt-0">
                <div className="mb-8">
                  <DrawingCanvas onSave={handleDrawingSave} />
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="mt-0">
                <div className="mb-8">
                  <FileUploader
                    onUpload={handleFileUpload}
                    onClear={clearUpload}
                    preview={imagePreview || undefined}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="max-w-md mb-8">
              <Label htmlFor="title" className="block mb-2">
                Artwork Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your artwork"
                className="mb-2"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={!title || !imagePreview || isSubmitting}
              className="w-full max-w-md"
            >
              {isSubmitting ? "Posting..." : "Post Artwork"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
};

export default Create;
