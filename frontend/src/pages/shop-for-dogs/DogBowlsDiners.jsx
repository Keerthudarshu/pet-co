import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { useCart } from '../../contexts/CartContext';
import Footer from '../homepage/components/Footer';

const categories = [
  { id: 'all', label: 'All Dog Bowls & Diners', img: '/assets/images/dog/bw1.webp' },
  { id: 'bowls', label: 'Bowls', img: '/assets/images/dog/bw2.webp' },
  { id: 'diners', label: 'Diners', img: '/assets/images/dog/bw3.webp' },
  { id: 'anti-spill-mats', label: 'Anti Spill Mats', img: '/assets/images/dog/bw4.webp' },
  { id: 'travel-fountain', label: 'Travel & Fountain', img: '/assets/images/dog/bw5.webp' }
];

const sampleProducts = [
  {
    id: 'bb1', name: 'Stainless Steel Bowl - Medium', image: '/assets/images/dog/bw2.webp', badges: ['Popular'], variants: ['S','M','L'], price: 349,
    brand: 'Hearty', animal: 'Dog', lifeStage: 'Adult', breedSize: 'Medium', productType: 'Bowl', specialDiet: '', proteinSource: 'Chicken', weight: '500 g', size: 'One Size', subCategory: 'Bowls'
  },
  {
    id: 'bb2', name: 'Ceramic Diner Plate', image: '/assets/images/dog/bw3.webp', badges: ['Handmade'], variants: ['One Size'], price: 499,
    brand: 'Royal Canin', animal: 'Dog', lifeStage: 'Adult', breedSize: 'Large', productType: 'Diner', specialDiet: 'Grain Free', proteinSource: 'Milk', weight: '1 kg', size: 'One Size', subCategory: 'Diners'
  },
  {
    id: 'bb3', name: 'Anti Spill Mat - Silicone', image: '/assets/images/dog/bw4.webp', badges: ['Non-Slip'], variants: ['One Size'], price: 299,
    brand: 'Drools', animal: 'Dog', lifeStage: 'Adult', breedSize: 'All', productType: 'Anti Spill Mat', specialDiet: '', proteinSource: '', weight: '300 g', size: 'One Size', subCategory: 'Anti Spill Mats'
  }
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

export default function DogBowlsDiners({ initialActive = 'Bowls' }) {
  const [active, setActive] = useState(initialActive);
  const { getCartItemCount, cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search).get('sub') || new URLSearchParams(location.search).get('category');
      if (q) {
        const match = categories.find(c => c.label.toLowerCase() === q.toLowerCase() || c.id === q.toLowerCase());
        setActive(match ? match.label : q);
      }
    } catch (err) {}
  }, [location.search]);

  const routeMap = {
    'All Dog Bowls & Diners': '/shop-for-dogs/dog-bowls-diners/all-dog-bowls-diners',
    'Bowls': '/shop-for-dogs/dog-bowls-diners/bowls',
    'Diners': '/shop-for-dogs/dog-bowls-diners/diners',
    'Anti Spill Mats': '/shop-for-dogs/dog-bowls-diners/anti-spill-mats',
    'Travel & Fountain': '/shop-for-dogs/dog-bowls-diners/travel-fountain'
  };

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const handleLeftWheel = (e) => { if (leftRef.current) { e.preventDefault(); leftRef.current.scrollTop += e.deltaY; } };
  const handleRightWheel = (e) => { if (rightRef.current) { e.preventDefault(); rightRef.current.scrollTop += e.deltaY; } };

  // top filter pills + drawer state
  const topFilters = ['Brand','Dog/Cat','Life Stage','Breed Size','Product Type','Special Diet','Protein Source','Price','Weight','Size','Sub Category'];
  const [selectedTopFilter, setSelectedTopFilter] = useState(topFilters[0]);
  const topRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const drawerContentRef = useRef(null);
  const sectionRefs = useRef({});

  const scrollAmountRef = useRef(0);
  useEffect(() => {
    const update = () => {
      if (!topRef.current) return;
      const el = topRef.current;
      const itemMin = 140;
      const visible = Math.max(1, Math.floor(el.clientWidth / itemMin));
      const amount = Math.max(itemMin, Math.floor(el.clientWidth / Math.max(1, visible)));
      scrollAmountRef.current = Math.max(itemMin, amount);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const scrollPills = (dir = 'left') => {
    const el = topRef.current;
    if (!el) return;
    const amount = scrollAmountRef.current || Math.max(220, Math.floor(el.clientWidth * 0.6));
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

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

  // sample filter data for the drawer
  const brands = ['Hearty','Royal Canin','Sara\'s','Farmina','Pedigree','Acana','Applaws','Drools'];
  const dogCat = ['Cat','Dog'];
  const lifeStages = ['Puppy','Adult','Senior'];
  const breedSizes = ['Small','Medium','Large','Giant','All'];
  const productTypes = ['Bowl','Diner','Anti Spill Mat','Travel & Fountain'];
  const specialDiets = ['Gluten-Free','Grain Free'];
  const proteinSource = ['Chicken','Coconut','Egg','Fish','Fruits','Lamb','Milk','Vegetables'];
  const priceRanges = ['INR 10 - INR 300','INR 301 - INR 500','INR 501 - INR 1000','INR 1000 - INR 2000','INR 2000+'];
  const weights = ['300 g','320 g','340 g','370 g','400 g','500 g','800 g','1 kg','1.5 kg','2 kg','3 kg','5 kg','10 kg','20 kg'];
  const sizes = ['One Size','Pack of 1','Pack of 2','Pack of 3','Pack of 5'];
  const subCategories = ['Bowls','Diners','Anti Spill Mats','Travel & Fountain'];

  // selected filters
  const [selectedFilters, setSelectedFilters] = useState({});

  const toggleFilter = (key, value) => {
    setSelectedFilters(prev => {
      const copy = { ...prev };
      const setForKey = new Set(copy[key] || []);
      if (setForKey.has(value)) setForKey.delete(value);
      else setForKey.add(value);
      copy[key] = Array.from(setForKey);
      return copy;
    });
  };

  const clearFilters = () => setSelectedFilters({});

  const filteredProducts = React.useMemo(() => {
    const keys = Object.keys(selectedFilters).filter(k => selectedFilters[k] && selectedFilters[k].length);
    if (!keys.length) return sampleProducts;
    return sampleProducts.filter(p => {
      for (const key of keys) {
        const values = selectedFilters[key];
        if (!values || !values.length) continue;
        let ok = false;
        if (key === 'Brand') ok = values.includes(p.brand);
        else if (key === 'Dog/Cat') ok = values.includes(p.animal);
        else if (key === 'Life Stage') ok = values.includes(p.lifeStage);
        else if (key === 'Breed Size') ok = values.includes(p.breedSize);
        else if (key === 'Product Type') ok = values.includes(p.productType);
        else if (key === 'Special Diet') ok = values.includes(p.specialDiet);
        else if (key === 'Protein Source') ok = values.includes(p.proteinSource);
        else if (key === 'Price') {
          ok = values.some(v => {
            if (!p.price) return false;
            const parts = v.replace(/INR|\s/g, '').split('-');
            if (parts.length === 2) {
              const low = parseInt(parts[0]) || 0;
              const high = parseInt(parts[1]) || Number.MAX_SAFE_INTEGER;
              return p.price >= low && p.price <= high;
            }
            if (v.includes('+')) {
              const num = parseInt(v) || 0;
              return p.price >= num;
            }
            return false;
          });
        } else if (key === 'Weight') ok = values.includes(p.weight);
        else if (key === 'Size') ok = values.includes(p.size);
        else if (key === 'Sub Category') ok = values.includes(p.subCategory);
        else {
          const prop = p[key?.toLowerCase?.()];
          if (Array.isArray(prop)) ok = prop.some(x => values.includes(x));
          else ok = values.includes(prop);
        }
        if (!ok) return false;
      }
      return true;
    });
  }, [selectedFilters]);

  return (
    <>
      <Helmet>
        <title>{`Shop for Dogs — ${active} | PET&CO`}</title>
      </Helmet>
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={() => {}} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
            <div ref={leftRef} onWheel={handleLeftWheel} className="bg-white rounded border border-border overflow-hidden thin-gold-scroll" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
              <ul className="divide-y">
                {categories.map((c) => (
                  <li key={c.id} className={`relative border-b ${active === c.label ? 'bg-[#fff6ee]' : ''}`}>
                    <button onClick={() => { setActive(c.label); const p = routeMap[c.label]; if (p) navigate(p); }} className="w-full text-left flex items-center gap-4 p-4 pr-6">
                      <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border ${active === c.label ? 'ring-2 ring-orange-400' : 'border-gray-100'}`}>
                        <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{c.label}</span>
                    </button>
                    {active === c.label && (<div className="absolute right-0 top-0 h-full w-1 bg-orange-400" />)}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main ref={rightRef} onWheel={handleRightWheel} className="col-span-12 lg:col-span-9 xl:col-span-10" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
            <div className="mb-4">
              <div className="relative flex items-center gap-2 w-full">
                  <button
                    onClick={() => { if (topRef.current) topRef.current.scrollBy({ left: -(scrollAmountRef.current || topRef.current.clientWidth || 800), behavior: 'smooth' }); }}
                    aria-label="Scroll left"
                    className="top-scroll-btn inline-flex items-center justify-center border border-border bg-white ml-1 mr-2 absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div
                    ref={topRef}
                    className="hide-scrollbar overflow-x-auto pl-10 pr-10 top-pills-container"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <div className="inline-flex items-center gap-2">
                      {topFilters.map((t) => (
                        <button key={t} onClick={() => openFilterAndScroll(t)} className={`pill-item flex items-center gap-2 text-sm px-3 py-1 border border-border rounded-full bg-white ${selectedTopFilter === t ? 'ring-1 ring-orange-300' : ''}`} style={{ whiteSpace: 'nowrap' }}>
                          <span>{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => { if (topRef.current) topRef.current.scrollBy({ left: (scrollAmountRef.current || topRef.current.clientWidth || 800), behavior: 'smooth' }); }}
                    aria-label="Scroll right"
                    className="top-scroll-btn inline-flex items-center justify-center border border-border bg-white ml-2 mr-1 absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map(p => (<ProductCard key={p.id} p={p} />))}
            </div>

            {/* Filter drawer: canonical overlay + sliding panel (matches other category pages) */}
            <div aria-hidden={!filterOpen} className={`fixed inset-0 z-50 pointer-events-none ${filterOpen ? '' : ''}`}>
              {/* overlay */}
              <div
                onClick={() => setFilterOpen(false)}
                className={`absolute inset-0 bg-black/40 transition-opacity ${filterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
              />

              {/* drawer panel */}
              <aside
                role="dialog"
                aria-modal="true"
                className={`fixed top-0 right-0 h-full bg-white w-full sm:w-96 shadow-xl transform transition-transform pointer-events-auto ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <div className="text-sm font-semibold">Filter</div>
                    <div className="text-xs text-muted-foreground">{sampleProducts.length} products</div>
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
                  {/* Sort By */}
                  <section className="mb-6">
                    <h4 className="text-sm font-medium mb-3">Sort By</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Featured','Best selling','Alphabetically, A-Z','Alphabetically, Z-A','Price, low to high','Price, high to low','Date, old to new','Date, new to old'].map(s=> (
                        <button key={s} className="text-xs px-3 py-1 border border-border rounded bg-white">{s}</button>
                      ))}
                    </div>
                  </section>

                  {topFilters.map((t) => (
                    <section key={t} ref={el => sectionRefs.current[t] = el} className="mb-6">
                      <h4 className="text-sm font-medium mb-3">{t}</h4>
                      <div className="flex flex-wrap gap-2">
                        {(function optionsFor(key) {
                          if (key === 'Brand') return brands;
                          if (key === 'Dog/Cat') return dogCat;
                          if (key === 'Life Stage') return lifeStages;
                          if (key === 'Breed Size') return breedSizes;
                          if (key === 'Product Type') return productTypes;
                          if (key === 'Special Diet') return specialDiets;
                          if (key === 'Protein Source') return proteinSource;
                          if (key === 'Price') return priceRanges;
                          if (key === 'Weight') return weights;
                          if (key === 'Size') return sizes;
                          if (key === 'Sub Category') return subCategories;
                          return [];
                        })(t).map((opt) => (
                          <button key={opt} onClick={() => toggleFilter(t, opt)} className={`text-xs px-3 py-1 border border-border rounded bg-white ${ (selectedFilters[t] || []).includes(opt) ? 'ring-1 ring-orange-300' : '' }`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                <div className="fixed bottom-0 right-0 left-auto w-full sm:w-96 bg-white border-t p-4 flex items-center justify-between">
                  <button className="text-sm text-orange-500" onClick={clearFilters}>Clear All</button>
                  <button className="bg-orange-500 text-white px-5 py-2 rounded" onClick={() => setFilterOpen(false)}>Continue</button>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>

      <Footer />
      <style>{`
        /* hide scrollbar for horizontal top filters and other small containers */
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }

        /* small scroll button styles (page-scoped) */
        .top-scroll-btn { width: 34px; height: 34px; border-radius: 9999px; }

        /* highlight animation for target section when opened from top pills */
        @keyframes highlightPulse { 0% { background: rgba(255,245,230,0); } 30% { background: rgba(255,245,230,0.9); } 70% { background: rgba(255,245,230,0.6); } 100% { background: rgba(255,245,230,0); } }
        .section-highlight { animation: highlightPulse 1.2s ease-in-out; border-radius: 6px; }

        /* show ~8 pills at once on wider screens by fixing pill min-width and container max-width */
        .pill-item { min-width: 140px; }
        .top-pills-container { max-width: calc(140px * 8); }
        @media (max-width: 768px) {
          .pill-item { min-width: 110px; }
          .top-pills-container { max-width: 100%; }
        }
      `}</style>
    </>
  );
}