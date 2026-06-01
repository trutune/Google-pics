import React, { useState, useRef, useEffect } from 'react';
import { PixelCrop } from 'react-image-crop';
import { TabType, ImageAdjustments, defaultAdjustments, TextObject } from './types';
import { getCroppedImg } from './lib/imageUtils';
import FileUpload from './components/FileUpload';
import Sidebar from './components/Sidebar';
import ImageEditor from './components/ImageEditor';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firebaseErrors';

type AppState = 'landing' | 'dashboard' | 'workspace';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('Untitled image');
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('adjust');
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(defaultAdjustments);
  const [pixelCrop, setPixelCrop] = useState<PixelCrop | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Precision editing state
  const [texts, setTexts] = useState<TextObject[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (appState === 'landing') setAppState('dashboard');
      } else {
        setAppState('landing');
      }
    });
    return () => unsub();
  }, [appState]);

  const saveProject = async (title?: string) => {
    if (!auth.currentUser) return;
    try {
      const pId = projectId || Math.random().toString(36).substring(2, 15);
      const isNew = !projectId;
      
      const payload: any = {
        projectId: pId,
        ownerId: auth.currentUser.uid,
        title: title !== undefined ? title : projectTitle,
        originalImage: originalImage || '',
        filteredImage: filteredImage || '',
        adjustments: JSON.stringify(adjustments),
        texts: JSON.stringify(texts),
        updatedAt: serverTimestamp()
      };

      if (isNew) {
        payload.createdAt = serverTimestamp();
      }

      await setDoc(doc(db, 'projects', pId), payload, { merge: true });
      if (isNew) setProjectId(pId);
      
      console.log('Project saved!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (originalImage && appState === 'workspace') {
        saveProject();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [originalImage, filteredImage, adjustments, texts, projectTitle, appState]);

  // History tracking
  type EditHistoryState = {
    originalImage: string | null;
    adjustments: ImageAdjustments;
    texts: TextObject[];
  };
  const [history, setHistory] = useState<EditHistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isHistoryUpdate = useRef(false);

  useEffect(() => {
    if (isHistoryUpdate.current) {
      isHistoryUpdate.current = false;
      return;
    }
    
    // Only track history if we are in the workspace with an image or just initialized it
    if (appState !== 'workspace') return;
    
    const timer = setTimeout(() => {
      setHistory(prev => {
        const lastState = prev[historyIndex];
        const currentState = { originalImage, adjustments, texts };
        if (lastState && 
            lastState.originalImage === currentState.originalImage &&
            JSON.stringify(lastState.adjustments) === JSON.stringify(currentState.adjustments) &&
            JSON.stringify(lastState.texts) === JSON.stringify(currentState.texts)) {
          return prev;
        }
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [originalImage, adjustments, texts, historyIndex, appState]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isHistoryUpdate.current = true;
      const prevState = history[historyIndex - 1];
      setOriginalImage(prevState.originalImage);
      setAdjustments(prevState.adjustments);
      setTexts(prevState.texts);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isHistoryUpdate.current = true;
      const nextState = history[historyIndex + 1];
      setOriginalImage(nextState.originalImage);
      setAdjustments(nextState.adjustments);
      setTexts(nextState.texts);
      setHistoryIndex(historyIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex]);

  const handleImageSelect = (url: string) => {
    if (url === 'generate') {
      setActiveTab('ai');
      setOriginalImage(null);
    } else {
      setOriginalImage(url);
      setFilteredImage(url);
      setAdjustments(defaultAdjustments);
      setTexts([]);
      setActiveTab('adjust');
    }
  };

  const handleReset = () => {
    setProjectId(null);
    setProjectTitle('Untitled image');
    setOriginalImage(null);
    setFilteredImage(null);
    setAdjustments(defaultAdjustments);
    setTexts([]);
    setAppState('dashboard');
  };

  const handleOpenProject = (project: any) => {
    setProjectId(project.id);
    setProjectTitle(project.title || 'Untitled image');
    setOriginalImage(project.originalImage || null);
    setFilteredImage(project.filteredImage || null);
    if (project.adjustments) {
      try { setAdjustments(JSON.parse(project.adjustments)); } catch(e) {}
    }
    if (project.texts) {
      try { setTexts(JSON.parse(project.texts)); } catch(e) {}
    }
    setAppState('workspace');
    setActiveTab('adjust');
  };

  const handleDownload = () => {
    if (!filteredImage) return;
    const link = document.createElement('a');
    link.download = 'google-pics-export.png';
    link.href = filteredImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyCrop = () => {
    if (!pixelCrop || !filteredImage) return;
    getCroppedImg(filteredImage, pixelCrop, (base64) => {
      setOriginalImage(base64);
      setFilteredImage(base64);
      setAdjustments(defaultAdjustments);
      setActiveTab('adjust'); // Return to adjust tab after crop
    });
  };

  const handleGenerateAI = async (prompt: string, mode: 'create' | 'edit') => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const endpoint = mode === 'create' ? '/api/generate-image' : '/api/edit-image';
      const body: any = { prompt };
      
      if (mode === 'edit') {
        if (!filteredImage) throw new Error("No image to edit");
        body.imageBase64 = filteredImage;
        // Basic detection of mimetype from dataURL
        const mimeMatch = filteredImage.match(/^data:(image\/\w+);base64,/);
        body.mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      
      if (data.imageUrl) {
        setOriginalImage(data.imageUrl);
        setFilteredImage(data.imageUrl);
        setAdjustments(defaultAdjustments);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes('Quota') || err.message.includes('429'))) {
        alert('API Quota Exceeded. Please check your Gemini API plan limits or try again later.');
      } else {
        alert('AI Generation failed: ' + (err.message || 'Check console for details.'));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (appState === 'landing') {
    return <LandingPage onSignIn={() => setAppState('dashboard')} />;
  }

  if (appState === 'dashboard') {
    return <Dashboard 
             onStartBlank={() => {
               setProjectId(null);
               setProjectTitle('Untitled image');
               setOriginalImage(null);
               setAppState('workspace');
             }} 
             onSignOut={() => setAppState('landing')}
             onOpenProject={handleOpenProject}
           />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#f8f9fa] text-gray-800 overflow-hidden font-sans">
      <Header 
        onReset={handleReset} 
        onDownload={handleDownload} 
        hasImage={!!originalImage} 
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        projectTitle={projectTitle}
        onTitleChange={(t) => setProjectTitle(t)}
      />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Workspace Canvas Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-white mt-2 ml-2 mb-2 rounded-xl shadow-sm border border-gray-200">
          {!originalImage && activeTab !== 'ai' ? (
            <FileUpload onImageSelect={handleImageSelect} />
          ) : (
            <ImageEditor
              originalImage={originalImage}
              filteredImage={filteredImage}
              setFilteredImage={setFilteredImage}
              activeTab={activeTab}
              adjustments={adjustments}
              onCropComplete={(crop) => setPixelCrop(crop)}
              isGenerating={isGenerating}
              texts={texts}
              setTexts={setTexts}
              selectedTextId={selectedTextId}
              setSelectedTextId={setSelectedTextId}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 m-2 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col">
          {(originalImage || activeTab === 'ai') && (
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              adjustments={adjustments}
              setAdjustments={setAdjustments}
              onApplyCrop={handleApplyCrop}
              onGenerateAI={handleGenerateAI}
              isGenerating={isGenerating}
              hasImage={!!originalImage}
              texts={texts}
              setTexts={setTexts}
              selectedTextId={selectedTextId}
              setSelectedTextId={setSelectedTextId}
              originalImage={originalImage}
            />
          )}
        </div>
      </main>
    </div>
  );
}
