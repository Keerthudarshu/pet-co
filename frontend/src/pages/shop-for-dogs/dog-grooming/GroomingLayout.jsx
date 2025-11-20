import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../../components/ui/Header';
import { useCart } from '../../../contexts/CartContext';

// Grooming categories (left sidebar)
const categories = [
  { id: 'brushes', label: 'Brushes & Combs', img: '/assets/images/dog/dg1.webp' },
  { id: 'dry-wipes', label: 'Dry Bath, Wipes & Perfume', img: '/assets/images/dog/dg2.webp' },
  { id: 'ear-eye-paw', label: 'Ear, Eye & PawCare', img: '/assets/images/dog/dg3.webp' },
  { id: 'oral-care', label: 'Oral Care', img: '/assets/images/dog/dg4.webp' },
  { id: 'shampoo', label: 'Shampoo & Conditioner', img: '/assets/images/dog/dg5.webp' },
  { id: 'tick-flea', label: 'Tick & Flea Control', img: '/assets/images/dog/dg6.webp' }
];

// Small sample grooming products to show in the grid (placeholder)
const sampleProducts = [
  { id: 'g1', name: 'Soft Bristle Brush', image: '/assets/images/grooming/brush-product.webp', badges: ['Best Seller'], variants: ['One Size'], price: 499 },
  { id: 'g2', name: 'Dry Bath Wipes (Pack of 10)', image: '/assets/images/grooming/wipes.webp', badges: ['New'], variants: ['10 pcs','30 pcs'], price: 249 },
  { id: 'g3', name: 'Gentle Puppy Shampoo', image: '/assets/images/grooming/shampoo-product.webp', badges: ['Get Extra 5% OFF'], variants: ['200 ml','500 ml'], price: 399 },
  { id: 'g4', name: 'Ear & Eye Care Drops', image: '/assets/images/grooming/ear-eye-product.webp', badges: ['Up to 20% OFF'], variants: ['10 ml'], price: 199 }
];

const ProductCard = ({ p }) => {
  const [qty] = useState(1);
  return (
    <article className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="p-3">
        <div className="h-8 flex items-center justify-start">
          <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-t-md">{p.badges?.[0]}</div>
        </div>
        <div className="mt-3 h-44 flex items-center justify-center bg-[#f6f8fb] rounded">
          <img src={p.image} alt={p.name} className="max-h-40 object-contain" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-foreground">{p.name}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.variants.map((v, i) => (
            <span key={i} className="text-xs px-2 py-1 border border-border rounded">{v}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">₹{p.price.toFixed(2)}</div>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full">Add</button>
        </div>
      </div>
    </article>
  );
};

export default function GroomingLayout({ initialActive, pageTitle }) {
  const [active, setActive] = useState(initialActive || categories[0].label);
  const { getCartItemCount, cartItems } = useCart();
  const navigate = useNavigate();

  // top filters and drawer state (reusing DogFood UX)
  const topFilters = ['Brand','Type','Life Stage','Size','Product Type','Special Care','Price','Weight','Sub Category'];
  const [selectedTopFilter, setSelectedTopFilter] = useState(topFilters[0]);
  const topRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const drawerContentRef = useRef(null);
  const sectionRefs = useRef({});

  const openFilterAndScroll = (key) => {
    setSelectedTopFilter(key);
    setFilterOpen(true);
    const doScroll = () => {
      const container = drawerContentRef.current;
      const el = sectionRefs.current[key];
      if (container && el) {
        const drawerHeaderHeight = 64;
        const top = el.offsetTop;
        const scrollTo = Math.max(0, top - drawerHeaderHeight - 8);
        container.scrollTo({ top: scrollTo, behavior: 'smooth' });
        try {
          el.classList.add('section-highlight');
          setTimeout(() => el.classList.remove('section-highlight'), 1400);
        } catch (err) {}
      }
    };
    setTimeout(doScroll, 220);
  };

  // sample drawer data for grooming
  const brands = ['PetCare','PawLove','GroomWell','FreshPaws'];
  const productTypes = ['Brushes','Shampoos','Wipes','Perfumes','Ear Care','Oral Care'];
  const priceRanges = ['INR 50 - INR 200','INR 201 - INR 500','INR 501 - INR 1000'];

  const routeMap = {
    'Brushes & Combs': '/shop-for-dogs/dog-grooming/brushes-combs',
    'Dry Bath, Wipes & Perfume': '/shop-for-dogs/dog-grooming/dry-bath-wipes-perfume',
    'Ear, Eye & PawCare': '/shop-for-dogs/dog-grooming/ear-eye-pawcare',
    'Oral Care': '/shop-for-dogs/dog-grooming/oral-care',
    'Shampoo & Conditioner': '/shop-for-dogs/dog-grooming/shampoo-conditioner',
    'Tick & Flea Control': '/shop-for-dogs/dog-grooming/tick-flea-control'
  };

  const topScrollBy = (delta) => { if (topRef.current) topRef.current.scrollBy({ left: delta, behavior: 'smooth' }); };
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const handleLeftWheel = (e) => { if (leftRef.current) { e.preventDefault(); leftRef.current.scrollTop += e.deltaY; } };
  const handleRightWheel = (e) => { if (rightRef.current) { e.preventDefault(); rightRef.current.scrollTop += e.deltaY; } };

  return (
    <>
      <Helmet>
        <title>{pageTitle || 'Shop for Dogs — Grooming | PET&CO'}</title>
        <style>{`/* minimal page-scoped styles to match DogFood UX */
          .thin-gold-scroll { scrollbar-width: none; }
          .thin-gold-scroll::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          @keyframes highlightPulse { 0% { background: rgba(255,245,230,0); } 30% { background: rgba(255,245,230,0.9);} 70%{background: rgba(255,245,230,0.6);} 100%{background: rgba(255,245,230,0);} }
          .section-highlight { animation: highlightPulse 1.2s ease-in-out; border-radius: 6px; }
        `}</style>
      </Helmet>

      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={() => {}} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
            <div ref={leftRef} onWheel={handleLeftWheel} className="bg-white rounded border border-border overflow-hidden thin-gold-scroll" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
              <ul className="divide-y">
                {categories.map((c, idx) => (
                  <li key={c.id} className={`relative border-b ${active===c.label ? 'bg-[#fff6ee]' : ''}`}>
                    <button onClick={()=>{ setActive(c.label); const p = routeMap[c.label]; if(p) navigate(p); }} className="w-full text-left flex items-center gap-4 p-4 pr-6">
                      <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border ${active===c.label ? 'ring-2 ring-orange-400' : 'border-gray-100'}`}>
                        <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{c.label}</span>
                    </button>
                    {active===c.label && (<div className="absolute right-0 top-0 h-full w-1 bg-orange-400" />)}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main ref={rightRef} onWheel={handleRightWheel} className="col-span-12 lg:col-span-9 xl:col-span-10" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
            <div className="mb-4 flex items-center justify-between">
              <div className="relative flex-1 overflow-hidden">
                <button onClick={()=>topScrollBy(-220)} aria-label="Scroll left" className="top-scroll-btn hidden md:inline-flex items-center justify-center border border-border bg-white ml-1 mr-2 absolute left-0 top-1/2 transform -translate-y-1/2 z-10"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>

                <div ref={topRef} className="hide-scrollbar overflow-x-auto pl-10 pr-10" style={{ whiteSpace: 'nowrap' }}>
                  <div className="inline-flex items-center gap-2">
                    {topFilters.map((t) => (
                      <button key={t} onClick={() => openFilterAndScroll(t)} className={`flex items-center gap-2 text-sm px-3 py-1 border border-border rounded-full bg-white ${selectedTopFilter === t ? 'ring-1 ring-orange-300' : ''}`} style={{ whiteSpace: 'nowrap' }}>
                        {selectedTopFilter === t ? (<span className="inline-flex items-center justify-center w-4 h-4 bg-gray-100 rounded-sm"><span className="w-2 h-2 bg-green-500 rounded" /></span>) : (<span className="inline-flex items-center justify-center w-4 h-4 bg-transparent rounded-sm" />)}
                        <span>{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={()=>topScrollBy(220)} aria-label="Scroll right" className="top-scroll-btn hidden md:inline-flex items-center justify-center border border-border bg-white ml-2 mr-1 absolute right-0 top-1/2 transform -translate-y-1/2 z-10"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
              </div>
            </div>

            <div className="absolute top-6 right-6 z-40 md:hidden">
              <button onClick={() => setFilterOpen(true)} className="flex items-center gap-2 border border-border rounded px-3 py-1 bg-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg><span className="text-sm">Filter</span></button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sampleProducts.map(p=> (<ProductCard key={p.id} p={p} />))}
            </div>
          </main>
        </div>
      </div>

      {/* Right-side filter drawer */}
      <div aria-hidden={!filterOpen} className={`fixed inset-0 z-50 pointer-events-none ${filterOpen ? '' : ''}`}>
        <div onClick={() => setFilterOpen(false)} className={`absolute inset-0 bg-black/40 transition-opacity ${filterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`} />

        <aside role="dialog" aria-modal="true" className={`fixed top-0 right-0 h-full bg-white w-full sm:w-96 shadow-xl transform transition-transform pointer-events-auto ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <div className="text-sm font-semibold">Filter</div>
              <div className="text-xs text-muted-foreground">Products</div>
            </div>
            <div>
              <button onClick={() => setFilterOpen(false)} className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>

          <div ref={drawerContentRef} className="px-4 pt-4 pb-32 hide-scrollbar overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            <section className="mb-6">
              <h4 className="text-sm font-medium mb-3">Brand</h4>
              <div className="flex flex-wrap gap-2">{brands.map(b=> (<button key={b} className="text-xs px-3 py-1 border border-border rounded bg-white">{b}</button>))}</div>
            </section>

            <section ref={el => sectionRefs.current['Product Type'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Product type</h4>
              <div className="flex flex-wrap gap-2">{productTypes.map(p=> (<button key={p} className="text-xs px-3 py-1 border border-border rounded bg-white">{p}</button>))}</div>
            </section>

            <section ref={el => sectionRefs.current['Price'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Price</h4>
              <div className="flex flex-wrap gap-2">{priceRanges.map(r=> (<button key={r} className="text-xs px-3 py-1 border border-border rounded bg-white">{r}</button>))}</div>
            </section>
          </div>

          <div className="fixed bottom-0 right-0 left-auto w-full sm:w-96 bg-white border-t p-4 flex items-center justify-between">
            <button className="text-sm text-orange-500">Clear All</button>
            <button className="bg-orange-500 text-white px-5 py-2 rounded">Continue</button>
          </div>
        </aside>
      </div>
    </>
  );
}
