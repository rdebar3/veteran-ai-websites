import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer py-10 border-t border-[#334155]">
      <div className="max-w-7xl mx-auto px-6 text-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-6">
          <div>
            <div className="flex items-center">
              <img 
                src="/veteran-ai-logo.jpg" 
                alt="Veteran AI Websites" 
                className="h-8 w-auto" 
              />
            </div>
            <div className="mt-1 text-[#94A3B8]">West Virginia • U.S. Veteran Owned</div>
          </div>

          <div className="text-[#94A3B8] text-xs md:text-sm">
            © {new Date().getFullYear()} Veteran AI Websites. All rights reserved.<br className="md:hidden" /> One-day professional websites for local businesses.
          </div>

          <div className="text-xs text-[#64748B] max-w-[220px] md:text-right">
            Fast websites. Fair prices. Full ownership.<br />Built with pride in West Virginia.
          </div>
        </div>
        <div className="mt-4 text-center text-[10px] tracking-[2px] text-[#64748B] opacity-75">
          Long Live the Republic
        </div>
      </div>
    </footer>
  );
}
