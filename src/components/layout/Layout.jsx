import Navbar from './Navbar';
import AgentWidget from '../chat/AgentWidget';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-apple-bg flex flex-col relative overflow-hidden">
      {/* Ambient background glows for that subtle premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-apple-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-apple-blue/5 blur-[120px] pointer-events-none" />

      <Navbar />
      
      {/* The main content area. Using max-w-7xl to match standard e-commerce width */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-24 pb-12 z-10 flex flex-col">
        {children}
      </main>

      {/* Global AI Chat Drawer */}
      <AgentWidget />
    </div>
  );
}
