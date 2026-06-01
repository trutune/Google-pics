import React, { useState } from 'react';
import { TabType, ImageAdjustments, TextObject } from '../types';
import { SlidersHorizontal, Crop, Sparkles, Loader2, Type, Move, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  adjustments: ImageAdjustments;
  setAdjustments: (adj: ImageAdjustments) => void;
  onApplyCrop: () => void;
  onGenerateAI: (prompt: string, mode: 'create' | 'edit') => Promise<void>;
  isGenerating: boolean;
  hasImage: boolean;
  texts: TextObject[];
  setTexts: React.Dispatch<React.SetStateAction<TextObject[]>>;
  selectedTextId: string | null;
  setSelectedTextId: React.Dispatch<React.SetStateAction<string | null>>;
  originalImage?: string | null;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  adjustments,
  setAdjustments,
  onApplyCrop,
  onGenerateAI,
  isGenerating,
  hasImage,
  texts,
  setTexts,
  selectedTextId,
  setSelectedTextId,
  originalImage
}: SidebarProps) {
  const [prompt, setPrompt] = useState('');

  const handleAddText = () => {
    const newText: TextObject = {
      id: Math.random().toString(36).substring(7),
      text: 'New Text',
      x: 100,
      y: 100,
      fontSize: 32,
      color: '#000000',
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
  };

  const handleTranslateText = async () => {
    if (!selectedTextId) return;
    const textObj = texts.find(t => t.id === selectedTextId);
    if (!textObj) return;

    try {
      const targetLang = window.prompt("Translate to which language? (e.g. Spanish, French, Japanese)", "Spanish");
      if (!targetLang) return;
      alert(`To truly translate '${textObj.text}' to ${targetLang} we would call the Gemini API!`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAdjustmentChange = (name: keyof ImageAdjustments, value: number) => {
    setAdjustments({ ...adjustments, [name]: value });
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'adjust', label: 'Adjust', icon: <SlidersHorizontal className="w-5 h-5" /> },
    { id: 'crop', label: 'Crop', icon: <Crop className="w-5 h-5" /> },
    { id: 'precision', label: 'Design', icon: <Move className="w-5 h-5" /> },
    { id: 'ai', label: 'Gemini', icon: <Sparkles className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full flex flex-col h-full shrink-0 bg-white">
      <div className="flex border-b border-gray-200 overflow-hidden shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors relative ${
              activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabBadge"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin flex flex-col items-start w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 h-full w-full"
          >
            {activeTab === 'adjust' && (
              <div className="space-y-6 w-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[12px] font-bold text-gray-700">Filters</h3>
                    <button 
                      onClick={() => setAdjustments({ brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, invert: 0, hueRotate: 0 })}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Reset All
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Grayscale', adj: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 100, sepia: 0, invert: 0, hueRotate: 0 }, css: 'grayscale(100%)' },
                      { label: 'Sepia', adj: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 100, invert: 0, hueRotate: 0 }, css: 'sepia(100%)' },
                      { label: 'Invert', adj: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, invert: 100, hueRotate: 0 }, css: 'invert(100%)' },
                      { label: 'Blur', adj: { brightness: 100, contrast: 100, saturation: 100, blur: 4, grayscale: 0, sepia: 0, invert: 0, hueRotate: 0 }, css: 'blur(2px)' },
                      { label: 'Sharpen', adj: { brightness: 100, contrast: 150, saturation: 120, blur: 0, grayscale: 0, sepia: 0, invert: 0, hueRotate: 0 }, css: 'contrast(150%) saturate(120%)' },
                      { label: 'Brighten', adj: { brightness: 150, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, invert: 0, hueRotate: 0 }, css: 'brightness(150%)' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setAdjustments(preset.adj)}
                        className="group flex flex-col gap-1 items-center"
                      >
                        <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 group-hover:border-blue-500 transition-colors bg-gray-100 flex items-center justify-center">
                          {originalImage ? (
                            <div 
                              className="w-full h-full bg-cover bg-center"
                              style={{ 
                                backgroundImage: `url(${originalImage})`,
                                filter: preset.css
                              }}
                            />
                          ) : (
                            <div className="w-full h-full" style={{ filter: preset.css, background: 'linear-gradient(45deg, #f3f4f6, #d1d5db)' }} />
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-gray-600 group-hover:text-blue-600 transition-colors">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-gray-200"></div>

                <div className="space-y-6">
                  <h3 className="text-[12px] font-bold text-gray-700">Refine Image</h3>
                
                  <SliderControl label="Brightness" value={adjustments.brightness} min={0} max={200} onChange={(v) => handleAdjustmentChange('brightness', v)} />
                  <SliderControl label="Contrast" value={adjustments.contrast} min={0} max={200} onChange={(v) => handleAdjustmentChange('contrast', v)} />
                  <SliderControl label="Saturation" value={adjustments.saturation} min={0} max={200} onChange={(v) => handleAdjustmentChange('saturation', v)} />
                  <SliderControl label="Blur" value={adjustments.blur} min={0} max={20} onChange={(v) => handleAdjustmentChange('blur', v)} />
                  <SliderControl label="Grayscale" value={adjustments.grayscale} min={0} max={100} onChange={(v) => handleAdjustmentChange('grayscale', v)} />
                  <SliderControl label="Sepia" value={adjustments.sepia} min={0} max={100} onChange={(v) => handleAdjustmentChange('sepia', v)} />
                  <SliderControl label="Invert" value={adjustments.invert} min={0} max={100} onChange={(v) => handleAdjustmentChange('invert', v)} />
                  <SliderControl label="Hue" value={adjustments.hueRotate} min={0} max={360} onChange={(v) => handleAdjustmentChange('hueRotate', v)} />
                </div>
              </div>
            )}

            {activeTab === 'crop' && (
              <div className="space-y-6 h-full flex flex-col w-full">
                <h3 className="text-[12px] font-bold text-gray-700 mb-2">Transform</h3>
                <p className="text-[13px] text-gray-600">
                  Drag the corners on the image to crop.
                </p>
                <button
                  onClick={onApplyCrop}
                  disabled={!hasImage}
                  className="mt-auto w-full py-2 bg-[#1a73e8] hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Crop
                </button>
              </div>
            )}

            {activeTab === 'precision' && (
              <div className="space-y-6 flex flex-col h-full w-full">
                <h3 className="text-[12px] font-bold text-gray-700 mb-2">Precision Design</h3>
                
                <div className="space-y-4 flex-1">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-[13px] font-medium text-gray-800 mb-3">Text & Elements</h4>
                    
                    <button 
                      onClick={handleAddText}
                      className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded text-[13px] font-medium text-gray-700 transition-colors flex justify-center items-center gap-2 mb-2"
                    >
                      <Type className="w-4 h-4" />
                      Add Text
                    </button>
                    {selectedTextId ? (
                      <div className="mt-4 space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                        <label className="text-[11px] text-gray-500 font-medium uppercase tracking-wider block mb-1">Edit Text</label>
                        <input
                          type="text"
                          value={texts.find(t => t.id === selectedTextId)?.text || ''}
                          onChange={(e) => setTexts(texts.map(t => t.id === selectedTextId ? { ...t, text: e.target.value } : t))}
                          className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={texts.find(t => t.id === selectedTextId)?.color || '#000000'}
                            onChange={(e) => setTexts(texts.map(t => t.id === selectedTextId ? { ...t, color: e.target.value } : t))}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-300 bg-transparent p-0.5"
                          />
                          <button
                            onClick={handleTranslateText}
                            className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[12px] font-medium transition-colors flex justify-center items-center gap-2"
                          >
                            <Languages className="w-3 h-3" />
                            Translate via Gemini
                          </button>
                        </div>
                        
                        <SliderControl 
                          label="Text Size" 
                          value={texts.find(t => t.id === selectedTextId)?.fontSize || 32} 
                          min={12} 
                          max={120} 
                          onChange={(val) => setTexts(texts.map(t => t.id === selectedTextId ? { ...t, fontSize: val } : t))} 
                        />
                      </div>
                    ) : (
                      <p className="text-[12px] text-gray-500 text-center mt-4">Select text on canvas</p>
                    )}
                  </div>
                  
                  <div className="bg-[#f0f4f8] border border-[#d3e3fd] rounded-xl p-4">
                    <h4 className="text-[13px] font-medium text-[#041e49] mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#0b57d0]" />
                      Smart Tools
                    </h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => alert("To use Generative Area Fill, select an area using the Crop tool first, then prompt Gemini to update just that selection!")}
                        className="w-full text-left px-3 py-2 bg-white hover:bg-gray-50 border border-[#d3e3fd] text-[#041e49] rounded text-[12px] font-medium transition-colors"
                      >
                        Update Specific Area
                      </button>
                      
                      <button 
                         onClick={() => alert("Smart Extract allows you to detach a foreground object using AI so you can move or resize it freely!")}
                         className="w-full text-left px-3 py-2 bg-white hover:bg-gray-50 border border-[#d3e3fd] text-[#041e49] rounded text-[12px] font-medium transition-colors"
                      >
                         Extract Object
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4 h-full flex flex-col w-full">
                <div className="bg-[#f0f4f8] border border-[#d3e3fd] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#0b57d0]" />
                    <h3 className="text-[14px] font-medium text-[#041e49]">Help me create</h3>
                  </div>
                
                  <div className="space-y-4">
                    <div>
                      <textarea
                        id="prompt"
                        rows={5}
                        className="w-full px-3 py-2 bg-white border border-[#d3e3fd] rounded-lg shadow-sm focus:ring-1 focus:ring-[#0b57d0] focus:border-[#0b57d0] text-[13px] text-gray-900 placeholder-gray-400 resize-none transition-colors"
                        placeholder="e.g., A soccer ball in front of a goal with goalie's outstretched hand..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onGenerateAI(prompt, 'create')}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full py-2 bg-[#0b57d0] hover:bg-[#0842a0] rounded-full text-[13px] font-medium text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Create New
                      </button>
                      <button
                        onClick={() => onGenerateAI(prompt, 'edit')}
                        disabled={isGenerating || !prompt.trim() || !hasImage}
                        className="w-full py-2 bg-white hover:bg-gray-50 border border-gray-300 text-[#0b57d0] rounded-full text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Modify Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SliderControl({ label, value, min, max, onChange }: { label: string, value: number, min: number, max: number, onChange: (val: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[12px] text-gray-700 font-medium">{label}</label>
        <div className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium text-gray-600 border border-gray-200 min-w-8 text-center">{value}</div>
      </div>
      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#0b57d0] outline-none"
        />
      </div>
    </div>
  );
}
