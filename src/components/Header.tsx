import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Download, MessageSquare, Video, Lock, ChevronRight, Check, Undo, Redo } from 'lucide-react';
import PicsLogo from './PicsLogo';

interface HeaderProps {
  onReset: () => void;
  onDownload: () => void;
  hasImage: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  projectTitle?: string;
  onTitleChange?: (title: string) => void;
}

type MenuItem = {
  label?: string;
  hotkey?: string;
  divider?: boolean;
  hasSubmenu?: boolean;
  action?: () => void;
  checked?: boolean;
  isNew?: boolean;
  disabled?: boolean;
};

export default function Header({ onReset, onDownload, hasImage, onUndo, onRedo, canUndo, canRedo, projectTitle = 'Untitled image', onTitleChange }: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menus: Record<string, MenuItem[]> = {
    file: [
      { label: 'New image' },
      { label: 'Open', hotkey: 'Ctrl+O' },
      { label: 'Convert to presentation' },
      { divider: true },
      { label: 'Make a copy' },
      { divider: true },
      { label: 'Share', hasSubmenu: true },
      { label: 'Download', hasSubmenu: true, action: onDownload },
      { label: 'Export to Drive' },
      { divider: true },
      { label: 'Rename' },
      { label: 'Move to trash' },
      { divider: true },
      { label: 'Version history', hasSubmenu: true },
      { divider: true },
      { label: 'Details' },
      { label: 'Language', hasSubmenu: true },
      { divider: true },
      { label: 'Image size' },
    ],
    edit: [
      { label: 'Undo', hotkey: 'Ctrl+Z', action: onUndo, disabled: !canUndo },
      { label: 'Redo', hotkey: 'Ctrl+Y', action: onRedo, disabled: !canRedo },
      { divider: true },
      { label: 'Cut', hotkey: 'Ctrl+X' },
      { label: 'Copy', hotkey: 'Ctrl+C' },
      { label: 'Paste', hotkey: 'Ctrl+V' },
      { label: 'Paste without formatting', hotkey: 'Ctrl+Shift+V' },
      { divider: true },
      { label: 'Select all', hotkey: 'Ctrl+A' },
      { label: 'Delete' },
      { label: 'Duplicate', hotkey: 'Ctrl+D' },
      { divider: true },
      { label: 'Find and replace', hotkey: 'Ctrl+H' },
    ],
    view: [
      { label: 'Preview', hotkey: 'Ctrl+F5' },
      { divider: true },
      { label: 'Show grid', hasSubmenu: true },
      { label: 'Show rulers' },
      { label: 'Show comments', checked: true },
      { divider: true },
      { label: 'Canvas zoom', hasSubmenu: true },
      { label: 'Full screen' },
    ],
    insert: [
      { label: 'Comment', hotkey: 'Ctrl+Alt+M' },
      { label: 'Generate an image', isNew: true },
      { divider: true },
      { label: 'Upload' },
      { label: 'Drive & Photos' },
      { label: 'Stock & web' },
      { divider: true },
      { label: 'Text' },
      { label: 'Shapes and lines' },
      { divider: true },
      { label: 'Table', hasSubmenu: true },
      { label: 'Chart', hasSubmenu: true },
      { label: 'Special characters' },
      { divider: true },
      { label: 'Templates' },
    ],
    format: [
      { label: 'Text', hasSubmenu: true },
      { label: 'Align & indent', hasSubmenu: true },
      { label: 'Line & paragraph spacing', hasSubmenu: true },
      { divider: true },
      { label: 'Clear formatting', hotkey: 'Ctrl+\\' },
      { divider: true },
      { label: 'Borders & lines', hasSubmenu: true },
      { label: 'Image options' },
    ],
    tools: [
      { label: 'Spelling', hasSubmenu: true },
      { label: 'Linked objects' },
      { label: 'Dictionary' },
      { divider: true },
      { label: 'Notification settings' },
      { label: 'Preferences' },
      { label: 'Accessibility' },
      { divider: true },
      { label: 'Opt out of Workspace Experiments' },
    ],
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (action?: () => void) => {
    setActiveMenu(null);
    if (action) action();
  };

  return (
    <>
      <header className="h-[64px] bg-white flex items-center justify-between px-4 shrink-0 z-10 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowExitModal(true)}
            className="w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
            title="Pics home"
          >
            <PicsLogo className="w-8 h-8 shadow-sm rounded" />
          </button>
          <div className="flex flex-col justify-center" ref={menuRef}>
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                value={projectTitle}
                onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
                className="text-[18px] text-gray-800 tracking-tight leading-tight cursor-text hover:border-gray-300 border border-transparent focus:border-blue-500 focus:bg-white hover:bg-gray-50 rounded px-1 -ml-1 outline-none w-48 transition-colors"
                placeholder="Name your project"
              />
              <div className="flex items-center gap-1 text-gray-500">
                 <button 
                   onClick={onUndo} 
                   disabled={!canUndo}
                   title="Undo (Ctrl+Z)"
                   className={`p-1.5 rounded flex items-center justify-center transition-colors ${!canUndo ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700'}`}
                 >
                   <Undo className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={onRedo} 
                   disabled={!canRedo}
                   title="Redo (Ctrl+Y)"
                   className={`p-1.5 rounded flex items-center justify-center transition-colors ${!canRedo ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700'}`}
                 >
                   <Redo className="w-4 h-4" />
                 </button>
              </div>
            </div>
            <div className="flex items-center text-[14px] text-gray-700 gap-1 mt-0.5">
              {(Object.keys(menus) as Array<keyof typeof menus>).map((menuName) => (
                <div key={menuName} className="relative">
                  <span 
                    onClick={() => handleMenuClick(menuName)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors capitalize ${activeMenu === menuName ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  >
                    {menuName}
                  </span>
                  
                  {activeMenu === menuName && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 shadow-lg rounded-md py-1.5 z-50 flex flex-col text-[13.5px] text-gray-800">
                      {menus[menuName].map((item, idx) => (
                        item.divider ? (
                          <div key={idx} className="h-px bg-gray-200 my-1.5 w-full" />
                        ) : (
                          <button 
                            key={idx} 
                            onClick={() => !item.disabled && handleMenuItemClick(item.action)}
                            disabled={item.disabled}
                            className={`w-full text-left px-3 py-1 flex items-center justify-between group ${item.disabled ? 'text-gray-400 cursor-default cursor-not-allowed' : 'hover:bg-gray-100'}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 flex items-center justify-center">
                                {item.checked && <Check className="w-3.5 h-3.5" />}
                              </span>
                              {item.label}
                              {item.isNew && (
                                <span className={`text-[10px] px-1.5 py-0 rounded font-medium ml-1 ${item.disabled ? 'bg-gray-300 text-gray-100' : 'bg-[#1a73e8] text-white'}`}>New</span>
                              )}
                            </span>
                            {item.hotkey && <span className={`text-[12px] ${item.disabled ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-500'}`}>{item.hotkey}</span>}
                            {item.hasSubmenu && <ChevronRight className={`w-4 h-4 ${item.disabled ? 'text-gray-300' : 'text-gray-400'}`} />}
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <span 
                onClick={() => setShowExitModal(true)}
                className="px-1.5 py-0.5 rounded cursor-pointer transition-colors hover:bg-gray-100 ml-1 text-red-600 font-medium"
              >
                Exit
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-3">
          {hasImage && (
            <>
              <button className="hidden lg:flex items-center gap-2 text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
              <button className="hidden lg:flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors font-medium">
                <Video className="w-5 h-5" />
              </button>
              
              <button
                onClick={onDownload}
                className="flex items-center gap-2 bg-[#c2e7ff] hover:bg-[#b0dcf5] text-[#001d35] px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                 onClick={onDownload}
                 className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 text-gray-700 ml-2"
                 title="Export as PNG"
              >
                 <Download className="w-5 h-5" />
              </button>
            </>
          )}
          <button className="w-9 h-9 ml-2 rounded-full bg-purple-600 text-white flex items-center justify-center font-medium shadow-sm hover:shadow-md cursor-pointer">
            J
          </button>
        </div>
      </header>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center font-sans">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Exit Workspace?</h3>
              <p className="text-gray-600 text-[15px]">
                Are you sure you want to exit? Any unsaved changes might be lost.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowExitModal(false);
                  onReset();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Exit Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
