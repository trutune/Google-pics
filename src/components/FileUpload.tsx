import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Wand2 } from 'lucide-react';
import PicsLogo from './PicsLogo';

interface FileUploadProps {
  onImageSelect: (url: string) => void;
}

export default function FileUpload({ onImageSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result && typeof event.target.result === 'string') {
            onImageSelect(event.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImageSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          onImageSelect(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 h-full w-full">
      <div className="max-w-3xl w-full flex flex-col items-center justify-center h-full">
        <div className="text-center mb-8 flex flex-col items-center">
          <PicsLogo className="w-20 h-20 mb-4 shadow-sm rounded-2xl" />
          <h2 className="text-3xl font-medium text-gray-800 mb-2">Start a new image</h2>
          <p className="text-gray-500">Upload a photo or generate one using Google's AI</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 relative z-10 w-full max-w-2xl mx-auto">
          {/* Upload Card */}
          <div
            className={`relative group rounded-xl p-8 transition-all border-2 flex flex-col items-center justify-center text-center bg-white ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform mb-4">
              <Upload className="w-6 h-6 group-hover:text-gray-700" />
            </div>
            <h3 className="text-gray-800 font-medium mb-1">Upload an image</h3>
            <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-blue-600 shadow-sm pointer-events-none group-hover:bg-gray-50 transition-colors">
              Browse files
            </span>
          </div>

          {/* AI Generation Card */}
          <button 
            onClick={() => onImageSelect('generate')}
            className="group rounded-xl p-8 transition-all border border-gray-200 hover:border-[#d3e3fd] hover:bg-[#f0f4f8] bg-white flex flex-col items-center justify-center text-center shadow-sm hover:shadow"
          >
            <div className="w-12 h-12 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] group-hover:scale-110 transition-transform mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-[#1a73e8] font-medium mb-1">Help me create</h3>
            <p className="text-sm text-gray-600 mb-4">Describe what you want to see and Gemini will create it</p>
            <span className="px-4 py-2 bg-[#1a73e8] text-white rounded text-sm font-medium shadow-sm transition-colors group-hover:bg-blue-700 flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> Start Generating
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
