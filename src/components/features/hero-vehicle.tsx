import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function HeroVehicle({ className }: Props) {
  return (
    <svg
      viewBox="0 0 800 360"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ilustración de vehículo"
      className={cn("w-full", className)}
    >
      <defs>
        <linearGradient id="hv-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2D3578" />
          <stop offset="55%" stopColor="#1F2658" />
          <stop offset="100%" stopColor="#141838" />
        </linearGradient>
        <linearGradient id="hv-window" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#A0AED8" />
          <stop offset="100%" stopColor="#4E5894" />
        </linearGradient>
        <linearGradient id="hv-tail" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#9A1417" />
          <stop offset="100%" stopColor="#E22729" />
        </linearGradient>
        <linearGradient id="hv-head" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#FFE8A8" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <radialGradient id="hv-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id="hv-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <ellipse cx="400" cy="312" rx="320" ry="16" fill="url(#hv-floor)" />

      <path
        d="M 100 252
           Q 100 208 142 204
           L 198 200
           Q 218 160 252 148
           Q 280 140 360 138
           L 540 138
           Q 600 142 626 168
           Q 650 188 660 204
           L 696 210
           Q 712 214 718 232
           L 720 256
           Q 720 282 700 290
           Q 530 304 400 302
           Q 250 302 110 286
           Q 100 280 100 264 Z"
        fill="url(#hv-body)"
      />

      <path
        d="M 236 200
           Q 250 168 282 158
           L 396 154
           L 396 200 Z
           M 404 200
           L 404 154
           L 540 154
           Q 600 158 614 200 Z"
        fill="url(#hv-window)"
      />

      <line x1="400" y1="154" x2="400" y2="200" stroke="#0F1338" strokeWidth="4" />

      <path
        d="M 142 220 L 200 200 L 234 200"
        fill="none"
        stroke="#3F4789"
        strokeWidth="1.5"
        opacity="0.55"
      />
      <path
        d="M 620 200 L 654 200 L 690 218"
        fill="none"
        stroke="#3F4789"
        strokeWidth="1.5"
        opacity="0.55"
      />

      <line x1="400" y1="200" x2="400" y2="276" stroke="#0E1230" strokeWidth="1.5" opacity="0.6" />
      <line x1="280" y1="200" x2="280" y2="270" stroke="#0E1230" strokeWidth="1.2" opacity="0.4" />
      <line x1="520" y1="200" x2="520" y2="270" stroke="#0E1230" strokeWidth="1.2" opacity="0.4" />

      <rect x="340" y="246" width="22" height="4" rx="2" fill="#7A82B8" />
      <rect x="438" y="246" width="22" height="4" rx="2" fill="#7A82B8" />

      <ellipse
        cx="118"
        cy="232"
        rx="22"
        ry="14"
        fill="url(#hv-tail)"
        filter="url(#hv-glow)"
        opacity="0.5"
      />
      <rect x="104" y="222" width="34" height="22" rx="4" fill="url(#hv-tail)" />

      <ellipse
        cx="702"
        cy="234"
        rx="22"
        ry="14"
        fill="url(#hv-head)"
        filter="url(#hv-glow)"
        opacity="0.6"
      />
      <rect x="688" y="224" width="32" height="20" rx="4" fill="url(#hv-head)" />

      <g>
        <circle cx="220" cy="268" r="62" fill="#0A0D26" />
        <circle cx="220" cy="276" r="54" fill="#0F1014" />
        <circle cx="220" cy="276" r="36" fill="#3E4258" />
        <circle cx="220" cy="276" r="26" fill="#1B1F33" />
        <g stroke="#3E4258" strokeWidth="3" strokeLinecap="round">
          <line x1="220" y1="252" x2="220" y2="262" />
          <line x1="220" y1="290" x2="220" y2="300" />
          <line x1="196" y1="276" x2="206" y2="276" />
          <line x1="234" y1="276" x2="244" y2="276" />
          <line x1="203" y1="259" x2="210" y2="266" />
          <line x1="237" y1="259" x2="230" y2="266" />
          <line x1="203" y1="293" x2="210" y2="286" />
          <line x1="237" y1="293" x2="230" y2="286" />
        </g>
        <circle cx="220" cy="276" r="6" fill="#7A82B8" />
      </g>

      <g>
        <circle cx="600" cy="268" r="62" fill="#0A0D26" />
        <circle cx="600" cy="276" r="54" fill="#0F1014" />
        <circle cx="600" cy="276" r="36" fill="#3E4258" />
        <circle cx="600" cy="276" r="26" fill="#1B1F33" />
        <g stroke="#3E4258" strokeWidth="3" strokeLinecap="round">
          <line x1="600" y1="252" x2="600" y2="262" />
          <line x1="600" y1="290" x2="600" y2="300" />
          <line x1="576" y1="276" x2="586" y2="276" />
          <line x1="614" y1="276" x2="624" y2="276" />
          <line x1="583" y1="259" x2="590" y2="266" />
          <line x1="617" y1="259" x2="610" y2="266" />
          <line x1="583" y1="293" x2="590" y2="286" />
          <line x1="617" y1="293" x2="610" y2="286" />
        </g>
        <circle cx="600" cy="276" r="6" fill="#7A82B8" />
      </g>

      <path
        d="M 142 204 Q 200 200 252 148 L 540 138 Q 600 142 660 204"
        fill="none"
        stroke="#5B65B8"
        strokeWidth="1.5"
        opacity="0.4"
      />
    </svg>
  );
}
