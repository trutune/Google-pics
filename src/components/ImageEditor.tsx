import React, { useRef, useState, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageAdjustments, TabType, TextObject } from '../types';
import { applyFilters } from '../lib/imageUtils';

interface ImageEditorProps {
  originalImage: string | null;
  filteredImage: string | null;
  setFilteredImage: (url: string | null) => void;
  activeTab: TabType;
  adjustments: ImageAdjustments;
  onCropComplete: (crop: PixelCrop) => void;
  isGenerating: boolean;
  texts: TextObject[];
  setTexts: React.Dispatch<React.SetStateAction<TextObject[]>>;
  selectedTextId: string | null;
  setSelectedTextId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ImageEditor({
  originalImage,
  filteredImage,
  setFilteredImage,
  activeTab,
  adjustments,
  onCropComplete,
  isGenerating,
  texts,
  setTexts,
  selectedTextId,
  setSelectedTextId
}: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  useEffect(() => {
    if (originalImage && activeTab !== 'crop') {
      applyFilters(originalImage, adjustments, (base64) => {
        setDisplayUrl(base64);
        setFilteredImage(base64);
      });
    } else if (originalImage && activeTab === 'crop') {
      setDisplayUrl(filteredImage || originalImage);
    }
  }, [originalImage, adjustments, activeTab]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-50 rounded-xl">
      {/* Workspace Background */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #374151 1px, transparent 0)', backgroundSize: '16px 16px' }} 
      />
      
      {isGenerating && (
        <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-lg border border-gray-200">
            <div className="w-5 h-5 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium text-sm">Working on it...</p>
          </div>
        </div>
      )}

      {/* Floating Toolbar */}
      {displayUrl && (
        <div className="absolute top-4 right-4 z-30 bg-white rounded flex items-center gap-1 shadow-sm border border-gray-200 p-1">
          <button 
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} 
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="relative group flex items-center">
            <input 
              type="range" 
              min="0.1" 
              max="3" 
              step="0.1" 
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#1a73e8] outline-none hidden group-hover:block transition-all mr-2"
            />
            <span className="text-[12px] font-medium text-gray-700 min-w-[36px] text-center px-1">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <button 
            onClick={() => setZoom(Math.min(3, zoom + 0.1))} 
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center w-full h-full p-8">
        {displayUrl ? (
          <div 
            className="relative z-10 max-w-full max-h-full rounded-sm shadow-xl bg-white flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          >
            {activeTab === 'crop' ? (
              <ReactCrop 
                crop={crop} 
                onChange={c => setCrop(c)} 
                onComplete={c => onCropComplete(c)}
                className="max-h-full"
              >
                <img
                  ref={imageRef}
                  src={displayUrl}
                  alt="Workspace"
                  className="max-h-[80vh] w-auto object-contain block ring-1 ring-gray-200"
                  crossOrigin="anonymous"
                  draggable={false}
                />
              </ReactCrop>
            ) : (
              <div className="relative inline-block max-h-full">
                <img
                  src={displayUrl}
                  alt="Workspace"
                  className="max-h-[80vh] w-auto object-contain block ring-1 ring-gray-200"
                  draggable={false}
                />
                
                {/* Precision Editing Canvas Overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
                  {texts.map((t) => (
                    <motion.div
                      key={t.id}
                      drag={activeTab === 'precision'}
                      dragMomentum={false}
                      onDragEnd={(e, info) => {
                        setTexts(texts.map(text => 
                          text.id === t.id ? { ...text, x: text.x + info.offset.x, y: text.y + info.offset.y } : text
                        ));
                      }}
                      onClick={() => {
                        if (activeTab === 'precision') setSelectedTextId(t.id);
                      }}
                      style={{
                        position: 'absolute',
                        x: t.x,
                        y: t.y,
                        fontSize: t.fontSize,
                        color: t.color,
                        pointerEvents: activeTab === 'precision' ? 'auto' : 'none',
                        cursor: activeTab === 'precision' ? (selectedTextId === t.id ? 'grab' : 'pointer') : 'default',
                        border: selectedTextId === t.id && activeTab === 'precision' ? '1px dashed #1a73e8' : 'none',
                        padding: '4px',
                        userSelect: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {t.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative z-10 text-gray-400 font-medium text-sm flex items-center justify-center p-8 bg-white border border-gray-200 border-dashed rounded-lg">
            No image loaded. Start from the dashboard.
          </div>
        )}
      </div>
    </div>
  );
}
