"use client";

import {
  ChatBubbleLeftIcon,
  CameraIcon,
  BriefcaseIcon,
  MusicalNoteIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const socials = [
  { name: "WhatsApp", href: "https://wa.me/234XXXXXXXXXX", icon: <ChatBubbleLeftIcon className="w-5 h-5" /> },
  { name: "Instagram", href: "#", icon: <CameraIcon className="w-5 h-5" /> },
  { name: "LinkedIn", href: "#", icon: <BriefcaseIcon className="w-5 h-5" /> },
  { name: "TikTok", href: "#", icon: <MusicalNoteIcon className="w-5 h-5" /> },
  { name: "Facebook", href: "#", icon: <UsersIcon className="w-5 h-5" /> },
];

const socialHoverClasses = [
  "hover:bg-chip-yellow hover:border-chip-yellow hover:text-[#1a1614]",
  "hover:bg-chip-blue hover:border-chip-blue hover:text-[#1a1614]",
  "hover:bg-chip-green hover:border-chip-green hover:text-[#1a1614]",
  "hover:bg-chip-orange hover:border-chip-orange hover:text-[#1a1614]",
  "hover:bg-chip-pink hover:border-chip-pink hover:text-[#1a1614]",
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1614] pt-[120px] pb-0 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col">
        <div className="flex items-start justify-between flex-wrap gap-12 relative z-10">
          
          {/* Brand & Copyright */}
          <div className="flex flex-col gap-4">
            <span className="font-heading text-2xl font-bold text-white tracking-[-0.5px]">
              Cubicle.
            </span>
            <p className="font-body text-[15px] font-light text-[#aba39c] max-w-[280px] leading-[1.7]">
              A softer, smarter way to learn. Real conversations, zero rigid bots, entirely built around your pace and goals.
            </p>
            <p className="font-body text-[13px] font-normal text-[#7a736e] mt-6">
              © {new Date().getFullYear()} Cubicle. All rights reserved.
            </p>
          </div>

          <div className="flex gap-8 md:gap-16 flex-col md:flex-row flex-wrap">
            {/* Links Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-heading text-sm font-bold text-white uppercase tracking-[1px]">Links</h4>
              {["Pricing", "How it works", "Cancellation policy"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                  className="font-body text-[15px] font-normal text-[#aba39c] no-underline transition-all duration-200 inline-block hover:text-white hover:translate-x-1"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Socials Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-heading text-sm font-bold text-white uppercase tracking-[1px]">Social</h4>
              <div className="flex items-center gap-3">
                {socials.map((s, idx) => (
                  <a
                    key={s.name}
                    href={s.href}
                    id={`footer-social-${s.name.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className={`w-[44px] h-[44px] rounded-full border border-border-warm flex items-center justify-center text-lg transition-all duration-200 bg-oboe-black text-white no-underline shadow-[0_4px_12px_rgba(0,0,0,0.2)] ${socialHoverClasses[idx % socialHoverClasses.length]}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* MASSIVE BRANDING TEXT WITH TRUE MESH GRADIENT */}
      <div className="w-full relative flex justify-center items-end overflow-hidden mt-10">
        
        {/* Ambient radial glow */}
        <div className="absolute -bottom-[30%] left-1/2 -translate-x-1/2 w-[80%] h-[150%] bg-[radial-gradient(ellipse_at_bottom,rgba(250,184,176,0.4)_0%,transparent_60%)] pointer-events-none z-0" />

        {/* Layer 2: True Full Width SVG Logo with Organic Blob Mesh */}
        <svg 
          viewBox="0 35 1000 70"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-auto block relative z-10 drop-shadow-[0px_20px_40px_rgba(0,0,0,0.5)]"
        >
          <defs>
            <clipPath id="text-clip">
              <text 
                x="500" 
                y="110" 
                textLength="1000"
                lengthAdjust="spacing"
                dominantBaseline="alphabetic" 
                textAnchor="middle" 
                className="font-heading text-[140px] font-bold uppercase"
              >
                THE CUBICLE
              </text>
            </clipPath>
            <filter id="mesh-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="40" />
            </filter>
          </defs>

          {/* Faint ghost base */}
          <text 
            x="500"
            y="110" 
            textLength="1000"
            lengthAdjust="spacing"
            dominantBaseline="alphabetic" 
            textAnchor="middle" 
            className="font-heading text-[140px] font-bold fill-white/5 uppercase"
          >
            THE CUBICLE
          </text>

          {/* True Organic SVG Mesh Gradient */}
          <g clipPath="url(#text-clip)">
            {/* Base color */}
            <rect width="1000" height="200" fill="#fab8b0" />
            {/* Blurred blobs for organic mesh effect */}
            <g filter="url(#mesh-blur)">
              <circle cx="200" cy="20" r="150" fill="#abc6b6" />
              <circle cx="800" cy="100" r="180" fill="#fac8aa" />
              <circle cx="500" cy="80" r="150" fill="#fef1cc" />
              <circle cx="100" cy="120" r="120" fill="#d9ebf9" />
              <circle cx="900" cy="30" r="120" fill="#fab8b0" />
            </g>
          </g>
        </svg>
      </div>
    </footer>
  );
}
