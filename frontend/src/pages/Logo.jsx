export default function Logo({ className = "h-9" }) {
  return (
    <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10 flex items-center gap-2">
  <svg viewBox="0 0 44 44" className="h-8 sm:h-10 w-auto text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 4 L4 20 M22 4 L40 20 M9 18 V38 H35 V18" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="22" cy="28" r="2.4" fill="currentColor"/>
  </svg>
  <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">RentTrack</span>
</div>
  );
}