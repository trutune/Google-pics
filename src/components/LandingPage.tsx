import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import PicsLogo from './PicsLogo';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface LandingPageProps {
  onSignIn: () => void;
}

export default function LandingPage({ onSignIn }: LandingPageProps) {
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onSignIn();
    } catch (error: any) {
      console.error("Sign in failed:", error);
      if (error.code === 'auth/popup-blocked') {
        alert("Sign in popup was blocked by your browser. Please allow popups for this site.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Just ignore or show a small message, user closed it.
      } else if (error.message?.includes('Pending promise was never set')) {
         // Harmless strict-mode / double click issue
      } else {
        alert("Failed to sign in. Please try again.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* Navbar */}

      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 mr-2 lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <span className="text-2xl font-medium tracking-tight text-gray-600 flex items-center gap-2">
            <PicsLogo className="w-8 h-8 mr-1" />
            <span className="font-bold text-gray-700">Google</span> Pics
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-6 text-gray-600 font-medium">
          <button className="hover:text-blue-600">Products</button>
          <button className="hover:text-blue-600">Pricing</button>
          <button className="hover:text-blue-600">Security</button>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-md">Admin console</button>
          <button className="text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-md border border-blue-200">Get started</button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto py-20 mt-10">
        <div className="flex items-center gap-3 mb-6">
          <PicsLogo className="w-12 h-12 shadow-sm rounded-xl" />
          <h1 className="text-4xl text-gray-600 font-medium">Google Pics</h1>
        </div>
        
        <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
          Build beautiful<br/>images together
        </h2>
        
        <p className="text-xl text-gray-500 mb-10 max-w-2xl">
          Create and deliver impactful images and graphics in your browser, from anywhere — no installation required.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button 
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full sm:w-auto bg-[#1a73e8] hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-8 py-3.5 rounded-full text-lg transition-colors shadow-sm"
          >
            {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
          </button>
          <div className="w-full sm:w-auto relative group">
            <button className="w-full sm:w-auto border border-gray-300 hover:bg-gray-50 text-blue-600 font-medium px-8 py-3.5 rounded-full text-lg transition-colors bg-white flex items-center justify-center gap-2">
              Try Pics for work
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>
        </div>

        <div className="mt-20 w-full max-w-3xl rounded-xl border border-gray-200 shadow-2xl overflow-hidden bg-gray-50">
           {/* Mock of the editor interface for the landing page */}
           <div className="h-10 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
             <div className="flex gap-1.5 pl-2">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
             </div>
             <div className="flex-1 bg-gray-100 h-6 rounded-md max-w-sm mx-auto"></div>
           </div>
           <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
              <div className="w-3/4 h-3/4 bg-white shadow-sm flex items-center justify-center p-4">
                 <div className="w-full h-full bg-blue-50 border-2 border-dashed border-blue-200 rounded flex flex-col items-center justify-center text-blue-400">
                    <PicsLogo className="w-16 h-16 mb-2 opacity-50" />
                    <span className="font-medium text-sm">Editor View</span>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to edit images</h2>
            <p className="mt-4 text-lg text-gray-600">Professional tools accessible directly in your browser.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cloud Sync</h3>
              <p className="text-gray-600">Your projects automatically save to Firebase. Start on your laptop and finish on your tablet.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Generation</h3>
              <p className="text-gray-600">Harness the power of generative AI to create assets instantly using prompt-driven workflows.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Precision Adjustments</h3>
              <p className="text-gray-600">Apply filters, tune colors, and overlay text seamlessly with our intuitive canvas editor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PicsLogo className="w-6 h-6 grayscale" />
              <span className="font-bold text-gray-700">Google</span> <span className="text-gray-500">Pics</span>
            </div>
            <p className="text-sm text-gray-400">© 2026 Google LLC</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><button className="hover:text-blue-600">Features</button></li>
              <li><button className="hover:text-blue-600">Security</button></li>
              <li><button className="hover:text-blue-600">Pricing</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><button className="hover:text-blue-600">Help Center</button></li>
              <li><button className="hover:text-blue-600">Community</button></li>
              <li><button className="hover:text-blue-600">Blog</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><button className="hover:text-blue-600">Privacy Policy</button></li>
              <li><button className="hover:text-blue-600">Terms of Service</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
