'use client';

import { useCallback, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Star, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface Props {
  bucket: string;
  maxFiles?: number;
  value: string[];
  onChange: (urls: string[]) => void;
}

interface UploadItem {
  id: string;
  url: string;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  name: string;
}

export function ImageUpload({ bucket, maxFiles = 10, value, onChange }: Props) {
  const [items, setItems] = useState<UploadItem[]>(
    value.map((url, i) => ({
      id: `existing-${i}`,
      url,
      status: 'done' as const,
      progress: 100,
      name: url.split('/').pop() ?? 'image',
    }))
  );
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const supabase = createClient();
      if (!supabase) return null;

      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (error) return null;

      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return publicData.publicUrl;
    },
    [bucket]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      const canAdd = maxFiles - items.filter((i) => i.status === 'done').length;
      const toAdd = fileArr.slice(0, canAdd);

      if (toAdd.length === 0) return;

      // Add placeholder items immediately
      const placeholders: UploadItem[] = toAdd.map((f) => ({
        id: `${Date.now()}-${f.name}`,
        url: URL.createObjectURL(f),
        status: 'uploading',
        progress: 0,
        name: f.name,
      }));

      setItems((prev) => [...prev, ...placeholders]);

      // Upload each file and collect URLs
      const results = await Promise.all(
        toAdd.map(async (file, idx) => {
          const url = await uploadFile(file);
          const id = placeholders[idx].id;
          if (url) {
            setItems((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, url, status: 'done', progress: 100 } : item
              )
            );
            return url;
          } else {
            setItems((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, status: 'error', progress: 0 } : item
              )
            );
            return null;
          }
        })
      );

      // Notify parent with finalized URLs
      const allDone = [
        ...items.filter((i) => i.status === 'done').map((i) => i.url),
        ...results.filter(Boolean) as string[],
      ];
      onChange(allDone);
    },
    [items, maxFiles, uploadFile, onChange]
  );

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    onChange(updated.filter((i) => i.status === 'done').map((i) => i.url));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const doneCount = items.filter((i) => i.status === 'done').length;
  const canAddMore = doneCount < maxFiles;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {canAddMore && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
            ${dragOver
              ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
              : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <Upload className="mx-auto text-indigo-400 mb-3" size={32} />
          <p className="text-sm font-medium text-gray-700">
            Drag & drop photos here, or <span className="text-indigo-600">click to browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {doneCount}/{maxFiles} uploaded · JPG, PNG, WebP · Max 5MB each
          </p>
        </div>
      )}

      {/* Image Preview Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group"
            >
              {/* Cover badge */}
              {idx === 0 && item.status === 'done' && (
                <span className="absolute top-1 left-1 z-10 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Star size={8} fill="white" /> Cover
                </span>
              )}

              {/* Image */}
              {item.status !== 'error' ? (
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className={`object-cover transition-opacity ${item.status === 'uploading' ? 'opacity-50' : 'opacity-100'}`}
                  sizes="120px"
                  unoptimized={item.url.startsWith('blob:')}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-red-400">
                  <AlertCircle size={20} />
                  <span className="text-[10px] mt-1">Failed</span>
                </div>
              )}

              {/* Upload spinner */}
              {item.status === 'uploading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <Loader2 className="text-indigo-500 animate-spin" size={20} />
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!canAddMore && (
        <p className="text-xs text-emerald-600 font-medium">
          ✓ Maximum {maxFiles} images uploaded
        </p>
      )}
    </div>
  );
}
