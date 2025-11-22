import React, { useState, useRef } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import { useCart } from '../../contexts/CartContext';

const slugify = (s = '') => String(s || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

const PharmacyCollectionPage = ({ subLabel }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist, getCartItemCount, cartItems } = useCart();

  const location = useLocation();
  const pathname = String(location?.pathname || '').toLowerCase();

  // Determine which pharmacy section we're in
  const isDogPath = pathname.includes('/pharmacy/dogs');
  const isCatPath = pathname.includes('/pharmacy/cats');
  const isMedicinesPath = pathname.includes('/pharmacy/medicines');
  const isSupplementsPath = pathname.includes('/pharmacy/supplements');
  const isPrescriptionPath = pathname.includes('/pharmacy/prescription-food') || pathname.includes('/pharmacy/prescription');

  // Categories based on path - matching mega menu structure
  const categories = isDogPath
    ? [
      { id: 'skin', label: 'Medicines for Skin', img: '/assets/images/dog/db1.webp' },
      { id: 'joint', label: 'Joint & Mobility', img: '/assets/images/dog/db2.webp' },
      { id: 'digestive', label: 'Digestive Care', img: '/assets/images/dog/db3.webp' },
      { id: 'all', label: 'All Dog Pharmacy', img: '/assets/images/dog/db4.webp' }
    ]
    : isCatPath
      ? [
        { id: 'skin-coat', label: 'Skin & Coat Care', img: '/assets/images/cat/cf1.webp' },
        { id: 'worming', label: 'Worming', img: '/assets/images/cat/cf2.webp' },
        { id: 'oral', label: 'Oral Care', img: '/assets/images/cat/cf3.webp' },
        { id: 'all', label: 'All Cat Pharmacy', img: '/assets/images/cat/cf4.webp' }
      ]
      : isMedicinesPath
        ? [
          { id: 'antibiotics', label: 'Antibiotics', img: '/assets/images/essential/meowsi.webp' },
          { id: 'antifungals', label: 'Antifungals', img: '/assets/images/essential/whiskas.webp' },
          { id: 'anti-inflammatories', label: 'Anti Inflammatories', img: '/assets/images/essential/sheba.webp' },
          { id: 'pain-relief', label: 'Pain Relief', img: '/assets/images/essential/royal canin.webp' },
          { id: 'all', label: 'All Medicines', img: '/assets/images/dog/db1.webp' }
        ]
        : isSupplementsPath
          ? [
            { id: 'vitamins', label: 'Vitamins & Minerals', img: '/assets/images/essential/meowsi.webp' },
            { id: 'joint-supplements', label: 'Joint Supplements', img: '/assets/images/essential/whiskas.webp' },
            { id: 'probiotics', label: 'Probiotics & Gut Health', img: '/assets/images/essential/sheba.webp' },
            { id: 'skin-coat-supplements', label: 'Skin & Coat Supplements', img: '/assets/images/essential/royal canin.webp' },
            { id: 'all', label: 'All Supplements', img: '/assets/images/dog/db2.webp' }
          ]
          : isPrescriptionPath
            ? [
              { id: 'renal', label: 'Renal Support', img: '/assets/images/essential/meowsi.webp' },
              { id: 'hypoallergenic', label: 'Hypoallergenic Diets', img: '/assets/images/essential/whiskas.webp' },
              { id: 'digestive-support', label: 'Digestive Support', img: '/assets/images/essential/sheba.webp' },
              { id: 'weight', label: 'Weight Management', img: '/assets/images/essential/royal canin.webp' },
              { id: 'all', label: 'All Prescription Food', img: '/assets/images/dog/db3.webp' }
            ]
            : [
              { id: 'medicines', label: 'Medicines', img: '/assets/images/essential/meowsi.webp' },
              { id: 'supplements', label: 'Supplements', img: '/assets/images/essential/whiskas.webp' },
              { id: 'prescription', label: 'Prescription Food', img: '/assets/images/essential/sheba.webp' },
              { id: 'all', label: 'All Pharmacy', img: '/assets/images/essential/royal canin.webp' }
            ];

  const [active, setActive] = useState(categories[categories.length - 1].label);

  // Sample products
  const sampleProducts = [
    { id: 'ph1', name: 'Skin Care Medicine', image: '/assets/images/essential/meowsi.webp', badges: ['Vet Approved'], variants: ['50ml', '100ml'], price: 499, original: null },
    { id: 'ph2', name: 'Joint Support Supplement', image: '/assets/images/essential/whiskas.webp', badges: ['Best Seller'], variants: ['30 Tabs', '60 Tabs'], price: 899, original: 999 },
    { id: 'ph3', name: 'Digestive Health Formula', image: '/assets/images/essential/sheba.webp', badges: ['New'], variants: ['100g'], price: 349, original: null },
    { id: 'ph4', name: 'Probiotic Gut Supplement', image: '/assets/images/essential/meowsi.webp', badges: ['Gut Health'], variants: ['30 Caps'], price: 699, original: 799 },
  ];

  // Top filters
  const topFilters = ['Brand', 'Pet Type', 'Condition', 'Product Type', 'Price', 'Size'];
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
          setTimeout(() => { el.classList.remove('section-highlight'); }, 1400);
        } catch (err) { }
      }
    };
    setTimeout(doScroll, 220);
  };

  // Filter data
  const brands = ['Himalaya', 'Drools', 'Pedigree', 'Royal Canin', 'Farmina'];
  const petTypes = ['Dog', 'Cat'];
  const conditions = ['Skin Issues', 'Joint Pain', 'Digestive Problems', 'Dental Care'];
  const productTypes = ['Medicine', 'Supplement', 'Prescription Food'];
  const priceRanges = ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+'];
  const sizes = ['Small', 'Medium', 'Large'];

  const scrollTopLeft = () => { if (topRef.current) topRef.current.scrollBy({ left: -220, behavior: 'smooth' }); };
  const scrollTopRight = () => { if (topRef.current) topRef.current.scrollBy({ left: 220, behavior: 'smooth' }); };

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const handleLeftWheel = (e) => {
    if (leftRef.current) {
      e.preventDefault();
      leftRef.current.scrollTop += e.deltaY;
    }
  };

  const handleRightWheel = (e) => {
    if (rightRef.current) {
      e.preventDefault();
      rightRef.current.scrollTop += e.deltaY;
    }
  };

  const ProductCard = ({ p }) => {
    const [selectedVariant, setSelectedVariant] = useState((p.variants || [null])[0] || null);
    return (
      <article className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
        <div className="p-2 md:p-3">
          <div className="h-6 flex items-center justify-start">
            <div className="bg-green-500 text-white text-[11px] px-2 py-0.5 rounded-t-md">{p.badges?.[0]}</div>
          </div>
          <div className="mt-2 h-36 md:h-44 flex items-center justify-center bg-[#f6f8fb] rounded">
            <img src={p.image} alt={p.name} className="max-h-32 md:max-h-40 object-contain" />
          </div>
          <h3 className="mt-2 text-xs md:text-sm font-semibold text-foreground">{p.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.variants.map((v, i) => (
              <button
                key={i}
                onClick={() => setSelectedVariant(v)}
                className={`text-[11px] px-2 py-0.5 border border-border rounded ${selectedVariant === v ? 'bg-green-600 text-white' : 'bg-white'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-base md:text-lg font-bold">₹{p.price.toFixed(2)}</div>
              {p.original && <div className="text-sm text-muted-foreground line-through">₹{p.original}</div>}
            </div>
            <button
              onClick={() => addToCart({ id: p.id, name: p.name, price: p.price }, 1)}
              className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <>
      <Helmet>
        <title>Pharmacy | PET&CO</title>
        <style>{`
          .thin-gold-scroll {
            scrollbar-width: none;
            scrollbar-color: transparent transparent;
          }
          .thin-gold-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
          .thin-gold-scroll::-webkit-scrollbar-track { background: transparent; }
          .thin-gold-scroll::-webkit-scrollbar-thumb { background: transparent; }

          html, body, #root {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
            display: none; width: 0; height: 0;
          }

          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar { display: none; }

          .top-scroll-btn { width: 34px; height: 34px; border-radius: 9999px; }

          @keyframes highlightPulse {
            0% { background: rgba(255,245,230,0); }
            30% { background: rgba(255,245,230,0.9); }
            70% { background: rgba(255,245,230,0.6); }
            100% { background: rgba(255,245,230,0); }
          }
          .section-highlight {
            animation: highlightPulse 1.2s ease-in-out;
            border-radius: 6px;
          }
        `}</style>
      </Helmet>
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={() => { }} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-3 md:gap-6">
          {/* Sidebar - Categories */}
          <aside className="col-span-3 lg:col-span-3 xl:col-span-2">
            <div
              ref={leftRef}
              onWheel={handleLeftWheel}
              className="bg-white rounded border border-border overflow-hidden thin-gold-scroll"
              style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}
            >
              <ul className="divide-y">
                {categories.map((c) => (
                  <li key={c.id} className={`relative border-b ${active === c.label ? 'bg-[#fff6ee]' : ''}`}>
                    <button
                      onClick={() => setActive(c.label)}
                      className="w-full text-center flex flex-col items-center gap-1 p-2 md:flex-row md:text-left md:items-center md:gap-3 md:p-4"
                    >
                      <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border ${active === c.label ? 'ring-2 ring-orange-400' : 'border-gray-100'}`}>
                        <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-gray-800 mt-1 md:mt-0">{c.label}</span>
                    </button>
                    {active === c.label && (
                      <div className="absolute right-0 top-0 h-full w-1 bg-orange-400" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main
            ref={rightRef}
            onWheel={handleRightWheel}
            className="col-span-9 lg:col-span-9 xl:col-span-10"
            style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}
          >
            {/* Top filter bar */}
            <div className="mb-4 flex items-center justify-between">
              <div className="relative flex-1 overflow-hidden">
                <button
                  onClick={scrollTopLeft}
                  aria-label="Scroll left"
                  className="top-scroll-btn hidden md:inline-flex items-center justify-center border border-border bg-white ml-1 mr-2 absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div
                  ref={topRef}
                  className="hide-scrollbar overflow-x-auto pl-10 pr-10"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <div className="inline-flex items-center gap-2">
                    {topFilters.map((t) => (
                      <button
                        key={t}
                        onClick={() => openFilterAndScroll(t)}
                        className={`flex items-center gap-2 text-sm px-3 py-1 border border-border rounded-full bg-white ${selectedTopFilter === t ? 'ring-1 ring-orange-300' : ''}`}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {selectedTopFilter === t ? (
                          <span className="inline-flex items-center justify-center w-4 h-4 bg-gray-100 rounded-sm">
                            <span className="w-2 h-2 bg-green-500 rounded" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-4 h-4 bg-transparent rounded-sm" />
                        )}
                        <span>{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={scrollTopRight}
                  aria-label="Scroll right"
                  className="top-scroll-btn hidden md:inline-flex items-center justify-center border border-border bg-white ml-2 mr-1 absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter drawer trigger (mobile) */}
            <div className="absolute top-6 right-6 z-40 md:hidden">
              <button
                onClick={() => setFilterOpen(true)}
                className="flex items-center gap-2 border border-border rounded px-3 py-1 bg-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                <span className="text-sm">Filter</span>
              </button>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {sampleProducts.map(p => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Filter drawer */}
      <div aria-hidden={!filterOpen} className={`fixed inset-0 z-50 pointer-events-none ${filterOpen ? '' : ''}`}>
        <div
          onClick={() => setFilterOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${filterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
        />

        <aside
          role="dialog"
          aria-modal="true"
          className={`fixed top-0 right-0 h-full bg-white w-full sm:w-96 shadow-xl transform transition-transform pointer-events-auto ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <div className="text-sm font-semibold">Filter</div>
              <div className="text-xs text-muted-foreground">Pharmacy Products</div>
            </div>
            <div>
              <button onClick={() => setFilterOpen(false)} className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={drawerContentRef} className="px-4 pt-4 pb-32 hide-scrollbar overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            <section className="mb-6">
              <h4 className="text-sm font-medium mb-3">Sort By</h4>
              <div className="flex flex-wrap gap-2">
                {['Featured', 'Price, low to high', 'Price, high to low', 'Alphabetically, A-Z'].map(s => (
                  <button key={s} className="text-xs px-3 py-1 border border-border rounded bg-white">{s}</button>
                ))}
              </div>
            </section>

            <section ref={el => sectionRefs.current['Brand'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Brand</h4>
              <div className="flex flex-wrap gap-2">
                {brands.map(b => (<button key={b} className="text-xs px-3 py-1 border border-border rounded bg-white">{b}</button>))}
              </div>
            </section>

            <section ref={el => sectionRefs.current['Pet Type'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Pet Type</h4>
              <div className="flex flex-wrap gap-2">{petTypes.map(d => (<button key={d} className="text-xs px-3 py-1 border border-border rounded bg-white">{d}</button>))}</div>
            </section>

            <section ref={el => sectionRefs.current['Condition'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Condition</h4>
              <div className="flex flex-wrap gap-2">{conditions.map(c => (<button key={c} className="text-xs px-3 py-1 border border-border rounded bg-white">{c}</button>))}</div>
            </section>

            <section ref={el => sectionRefs.current['Product Type'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Product Type</h4>
              <div className="flex flex-wrap gap-2">{productTypes.map(p => (<button key={p} className="text-xs px-3 py-1 border border-border rounded bg-white">{p}</button>))}</div>
            </section>

            <section ref={el => sectionRefs.current['Price'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Price</h4>
              <div className="flex flex-wrap gap-2">{priceRanges.map(r => (<button key={r} className="text-xs px-3 py-1 border border-border rounded bg-white">{r}</button>))}</div>
            </section>

            <section ref={el => sectionRefs.current['Size'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">{sizes.map(s => (<button key={s} className="text-xs px-3 py-1 border border-border rounded bg-white">{s}</button>))}</div>
            </section>
          </div>

          <div className="fixed bottom-0 right-0 left-auto w-full sm:w-96 bg-white border-t p-4 flex items-center justify-between">
            <button className="text-sm text-orange-500">Clear All</button>
            <button className="bg-orange-500 text-white px-5 py-2 rounded">Continue</button>
          </div>
        </aside>
      </div>

      {/* Footer - Desktop Only */}
      
    <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </>
  );
};

export default PharmacyCollectionPage;
