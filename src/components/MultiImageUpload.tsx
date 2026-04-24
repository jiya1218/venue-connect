"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface MultiImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function MultiImageUpload({ onImagesChange, maxImages = 5 }: MultiImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `listing-images/${fileName}`;

      try {
        if (!supabase) throw new Error("Supabase client not initialized");
        
        const { error: uploadError, data } = await supabase.storage
          .from('venue-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('venue-images')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      } catch (error: any) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    const updatedImages = [...images, ...newUrls];
    setImages(updatedImages);
    onImagesChange(updatedImages);
    setUploading(false);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200">
            <img src={url} alt="Listing" className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-purple-400 hover:bg-purple-50 transition-all group"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-100">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-purple-600" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-purple-600">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        multiple
        accept="image/*"
        className="hidden"
      />
      <p className="text-[11px] text-slate-400 mt-2 italic px-1 flex items-center gap-1.5">
        <ImageIcon className="w-3 h-3" /> Minimum 1 photo required for listing approval. Max {maxImages} photos.
      </p>
    </div>
  );
}
