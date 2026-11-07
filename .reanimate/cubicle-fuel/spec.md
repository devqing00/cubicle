# Motion & Layout Spec: Cubicle × FUEL Template Reanimation

- **Target**: Interactions, visual rhythm, diagonal section cuts, ambient blurred media cards, and interactive hover-preview archive from `1,004 Best Free & Paid Website Templates.mp4`.
- **Destination**: `src/components/sections/` and `src/components/ui/` in Next.js 16 + React 19.
- **Fidelity**: Motion-faithful & layout-faithful to the reference video adapted for Cubicle language instruction.

## Key Motion & Layout Mechanics

| Component | Target Interaction | Timing | Easing | Composite Props |
|---|---|---|---|---|
| **Hero Badge** | Top-right floating glass tutor badge | Static + hover lift | `cubic-bezier(0.16, 1, 0.3, 1)` | `translate3d(0, -2px, 0)` |
| **Section Transitions** | Angled diagonal clip-path polygon cuts between white & dark canvases | CSS clip-path geometry | N/A (structural) | Zero reflow |
| **Active Showcase Card** | Ambient blurred clone backdrop behind active card/media | 200ms crossfade | `cubic-bezier(0.16, 1, 0.3, 1)` | `opacity, transform: scale(1.06)` |
| **Curriculum Archive** | Interactive row hover with floating image thumbnail strip | 180ms reveal | `cubic-bezier(0.16, 1, 0.3, 1)` | `opacity: 0 -> 1, translate3d(8px, 0, 0)` |
| **Stat Counters** | Large grotesque display numerals with tight tracking | Structural layout | N/A | High contrast Swiss |
| **Diagonal CTA Footer** | Deep charcoal canvas with giant direct action link & underline arrow | 180ms hover | `cubic-bezier(0.16, 1, 0.3, 1)` | `transform: scaleX(1), translate3d(2px, -2px, 0)` |

