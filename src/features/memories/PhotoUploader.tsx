import { useState } from 'react';
import { Button } from '@/shared/ui/Button';

export function PhotoUploader({ onUpload }: { onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (file) onUpload(file);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {file && (
        <img src={URL.createObjectURL(file)} alt="Preview" className="w-32 h-32 object-cover rounded-xl" />
      )}
      <Button onClick={handleUpload} disabled={!file} className="px-8 py-4">
        Add Photo 📸
      </Button>
    </div>
  );
}