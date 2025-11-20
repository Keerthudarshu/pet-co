import React from 'react';
import { motion } from 'framer-motion';

const promos = [
  { id: 'p1', title: 'Use Code: HRT5', subtitle: "Extra 5% OFF on Hearty Dry Food above ₹999", img: '/assets/images/coupon.avif' },
  { id: 'p2', title: 'Use Code: SWF5', subtitle: "Extra 5% OFF on Sara's Wholesome above ₹1499", img: '/assets/images/coupon.avif' },
  { id: 'p3', title: 'Use Code: PEDG500', subtitle: 'Extra 5% OFF Up to ₹500 on Pedigree', img: '/assets/images/coupon.avif' },
  { id: 'p4', title: 'Use Code: GROOMME', subtitle: 'Get Flat 7% OFF on Grooming Products above ₹999', img: '/assets/images/coupon.avif' },
  { id: 'p5', title: 'Use Code: TRT5', subtitle: 'Extra 5% OFF', img: '/assets/images/coupon.avif' }
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const card = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

const PromoCards = () => {
  return (
    <motion.section className="container mx-auto px-4 py-8" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={container}>
      {/* Continuous auto-scrolling promo row (pure CSS) */}
      <style>{`
        :root{ --promo-gap: 1rem; --promo-speed: 26s; --promo-card-minw: 320px; }
        .promo-scroll { width:100%; overflow:hidden; }
        .promo-scroll__scroller { display:flex; gap:var(--promo-gap); align-items:center; width:max-content; animation:promo-scroll var(--promo-speed) linear infinite; }
        .promo-scroll__group { display:flex; gap:var(--promo-gap); align-items:center; flex-shrink:0; }
        .promo-card { flex:0 0 auto; min-width:var(--promo-card-minw); }
        @keyframes promo-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (max-width:640px){ :root{ --promo-speed:20s; --promo-card-minw:260px } }
        @media (prefers-reduced-motion: reduce){ .promo-scroll__scroller{ animation:none } }
      `}</style>

      <div className="promo-scroll py-4">
        <div className="promo-scroll__scroller">
          <div className="promo-scroll__group">
            {promos.map((p) => (
              <motion.article key={`a-${p.id}`} variants={card} whileHover={{ scale: 1.02, translateY: -4 }} className="promo-card flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border-2 border-orange-200" style={{ borderColor: '#ffd6c4' }}>
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white border border-orange-100 shrink-0">
                  <img src={p.img} alt={p.title} className="w-12 h-12 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.subtitle}</p>
                </div>
                <button className="ml-4 px-3 py-2 text-sm rounded-md border border-border bg-white hover:bg-muted/20 transition-colors" onClick={() => navigator.clipboard?.writeText((p.title.split(':')[1] || '').trim())} aria-label={`Copy ${p.title} code`}>
                  Copy
                </button>
              </motion.article>
            ))}
          </div>

          <div className="promo-scroll__group" aria-hidden="true">
            {promos.map((p) => (
              <motion.article key={`b-${p.id}`} variants={card} whileHover={{ scale: 1.02, translateY: -4 }} className="promo-card flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border-2 border-orange-200" style={{ borderColor: '#ffd6c4' }}>
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white border border-orange-100 shrink-0">
                  <img src={p.img} alt={p.title} className="w-12 h-12 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.subtitle}</p>
                </div>
                <button className="ml-4 px-3 py-2 text-sm rounded-md border border-border bg-white hover:bg-muted/20 transition-colors" onClick={() => navigator.clipboard?.writeText((p.title.split(':')[1] || '').trim())} aria-label={`Copy ${p.title} code`}>
                  Copy
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

    </motion.section>
  );
};

export default PromoCards;
