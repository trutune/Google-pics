import React, { useState, useEffect } from 'react';
import { Menu, Search, Grid, Image as ImageIcon } from 'lucide-react';
import PicsLogo from './PicsLogo';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebaseErrors';

interface DashboardProps {
  onStartBlank: () => void;
  onSignOut: () => void;
  onOpenProject: (project: any) => void;
}

export default function Dashboard({ onStartBlank, onSignOut, onOpenProject }: DashboardProps) {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // Listen for recent projects
    const q = query(
      collection(db, 'projects'),
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleSignOutClick = async () => {
    try {
      await signOut(auth);
      onSignOut();
    } catch (e) {
      console.error(e);
    }
  };

  const userInitial = auth.currentUser?.email ? auth.currentUser.email[0].toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <PicsLogo className="w-9 h-9 shadow-sm rounded border border-gray-100" />
            <span className="text-xl text-gray-600 font-medium tracking-tight">Pics</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-2xl px-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-gray-200 transition-all">
            <Search className="w-5 h-5 text-gray-500 mr-3" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none outline-none w-full text-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hidden sm:block">
            <Grid className="w-6 h-6" />
          </button>
          <button onClick={handleSignOutClick} className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium shadow-sm hover:shadow-md ml-2 cursor-pointer">
            {userInitial}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Templates Section */}
        <div className="bg-gray-50 py-8 px-6 lg:px-20 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Start a new image</span>
              <button className="text-sm font-medium text-gray-600 hover:bg-gray-200 px-3 py-1 rounded">Template gallery</button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4">
              {/* Blank Template */}
              <div className="flex flex-col gap-2 w-48 shrink-0">
                <button 
                  onClick={onStartBlank}
                  className="h-36 bg-white border border-gray-200 rounded hover:border-blue-500 flex items-center justify-center transition-colors cursor-pointer group shadow-sm hover:shadow"
                >
                  <img src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png" alt="Blank" className="w-16 h-16 opacity-80 group-hover:opacity-100" />
                </button>
                <span className="text-sm font-medium text-gray-800">Blank image</span>
              </div>

              {/* Mock Template 1 */}
              <div className="flex flex-col gap-2 w-48 shrink-0">
                <button className="h-36 bg-gray-100 border border-gray-200 rounded hover:border-blue-500 overflow-hidden cursor-pointer shadow-sm hover:shadow">
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500"></div>
                </button>
                <span className="text-sm font-medium text-gray-800">Social Media Post</span>
              </div>

              {/* Mock Template 2 */}
              <div className="flex flex-col gap-2 w-48 shrink-0">
                <button className="h-36 bg-gray-100 border border-gray-200 rounded hover:border-blue-500 overflow-hidden cursor-pointer shadow-sm hover:shadow">
                   <div className="w-full h-full bg-gradient-to-br from-blue-700 to-slate-800"></div>
                </button>
                <span className="text-sm font-medium text-gray-800">Presentation Background</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Section */}
        <div className="py-8 px-6 lg:px-20">
          <div className="max-w-6xl mx-auto">
             <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-800">Recent images</span>
            </div>
            {projects.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                No recent images yet. Started creations will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {projects.map((project: any) => (
                  <div key={project.id} className="flex flex-col gap-2 relative group cursor-pointer" onClick={() => onOpenProject(project)}>
                    <div className="h-40 bg-gray-100 border border-gray-200 rounded hover:border-blue-500 overflow-hidden shadow-sm flex items-center justify-center">
                      {project.filteredImage ? (
                        <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${project.filteredImage})` }} />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800 truncate">{project.title || 'Untitled image'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
