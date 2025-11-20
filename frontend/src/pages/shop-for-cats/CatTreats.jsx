import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { useCart } from '../../contexts/CartContext';
import productApi from '../../services/productApi';
import dataService from '../../services/dataService';
import apiClient from '../../services/api';

const categories = [
  { id: 'all', label: 'All Cat Treats', img: '/assets/images/cat/ctt1.webp' },
  { id: 'crunchy', label: 'Crunchy Treats', img: '/assets/images/cat/ctt2.webp' },
  { id: 'creamy', label: 'Creamy Treats', img: '/assets/images/cat/ctt3.webp' },
  { id: 'grain-free', label: 'Grain Free Treats', img: '/assets/images/cat/ctt4.webp' },
  { id: 'soft', label: 'Soft & Chewy', img: '/assets/images/cat/ctt5.webp' }
  
];

const sampleProducts = [
  { id: 't1', name: 'Crunchy Salmon Treats', image: '/assets/images/essential/meowsi.webp', badges: ['New'], variants: ['50 g','100 g'], price: 129 },
  { id: 't2', name: 'Creamy Tuna Pouch', image: '/assets/images/essential/whiskas.webp', badges: ['Save 10%'], variants: ['50 g','3 Pack'], price: 79 },
  { id: 't3', name: 'Soft Chicken Bites', image: '/assets/images/essential/sheba.webp', badges: ['Best Seller'], variants: ['30 g','90 g'], price: 149 }
];

const ProductCard = ({p}) => {
  const [selectedVariant, setSelectedVariant] = useState(p.variants?.[0] || null);
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    addToCart({ id: p.id, productId: p.id, name: p.name, image: p.image, price: p.price, originalPrice: p.original || p.price, variant: selectedVariant }, 1);
  };
  const handleWishlist = () => {
    if (isInWishlist(p.id)) removeFromWishlist(p.id); else addToWishlist({ id: p.id, name: p.name, image: p.image, price: p.price });
  };

  return (
    <article className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="p-3">
        <div className="h-8 flex items-center justify-start"><div className="bg-green-500 text-white text-xs px-3 py-1 rounded-t-md">{p.badges?.[0]}</div></div>
        <button onClick={() => navigate(`/product-detail-page?id=${p.id}`)} className="mt-3 h-44 flex items-center justify-center bg-[#f6f8fb] rounded w-full"><img src={p.image} alt={p.name} className="max-h-40 object-contain" /></button>
        <h3 onClick={() => navigate(`/product-detail-page?id=${p.id}`)} className="mt-3 text-sm font-semibold text-foreground cursor-pointer">{p.name}</h3>
        <div className="mt-3 flex flex-wrap gap-2">{p.variants.map((v,i)=>(<button key={i} onClick={() => setSelectedVariant(v)} className={`text-xs px-2 py-1 border border-border rounded ${selectedVariant===v?'bg-green-600 text-white':'bg-white'}`}>{v}</button>))}</div>
        <div className="mt-4 flex items-center justify-between"><div><div className="text-lg font-bold">₹{p.price.toFixed(2)}</div></div>
        <div className="flex flex-col items-end gap-2"><button onClick={handleAdd} className="bg-orange-500 text-white px-4 py-2 rounded-full">Add</button>
        <button onClick={handleWishlist} className="text-xs text-muted-foreground">{isInWishlist(p.id)?'Remove ♥':'Wishlist ♡'}</button></div></div>
      </div>
    </article>
  );
};

const CatTreats = ({ initialActive = 'All Cat Treats' }) => {
  const [active, setActive] = useState(initialActive);
  const { getCartItemCount, cartItems } = useCart();
  const navigate = useNavigate();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filter bar state
  const topFilters = ['Brand','Cat/Kitten','Life Stage','Breed Size','Product Type','Special Diet','Protein Source','Price','Weight','Size','Sub Category'];
  const [selectedTopFilter, setSelectedTopFilter] = useState(topFilters[0]);
  const topRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const drawerContentRef = useRef(null);
  const sectionRefs = useRef({});

  // Filter state management
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    catKitten: [],
    lifeStages: [],
    breedSizes: [],
    productTypes: [],
    specialDiets: [],
    proteinSource: [],
    priceRanges: [],
    weights: [],
    sizes: [],
    subCategories: [],
    sortBy: 'Featured'
  });

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const setSortBy = (sortValue) => {
    setSelectedFilters(prev => ({ ...prev, sortBy: sortValue }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      brands: [],
      catKitten: [],
      lifeStages: [],
      breedSizes: [],
      productTypes: [],
      specialDiets: [],
      proteinSource: [],
      priceRanges: [],
      weights: [],
      sizes: [],
      subCategories: [],
      sortBy: 'Featured'
    });
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
          setTimeout(() => { el.classList.remove('section-highlight'); }, 1400);
        } catch (err) {}
      }
    };
    setTimeout(doScroll, 220);
  };

  // filter data for cat treats
  const brands = ['Meowsi','Royal Canin','Whiskas','Purina','Applaws','Friskies','Hill\'s','IAMS','Felix'];
  const catKitten = ['Kitten','Adult Cat'];
  const lifeStages = ['Kitten','Adult','Senior'];
  const breedSizes = ['Small','Medium','Large','Persian','Maine Coon','Siamese'];
  const productTypes = ['Crunchy Treats','Creamy Treats','Soft & Chewy','Grain Free Treats','Training Treats'];
  const specialDiets = ['Grain Free','Hypoallergenic','Chicken Free','Natural','Organic'];
  const proteinSource = ['Chicken','Fish','Turkey','Beef','Salmon','Tuna','Duck'];
  const priceRanges = ['INR 10 - INR 100','INR 101 - INR 200','INR 201 - INR 500','INR 500+'];
  const weights = ['30 g','50 g','70 g','85 g','100 g','150 g','200 g','300 g'];
  const sizes = ['Small','Medium','Large','Extra Large'];
  const subCategories = ['Crunchy Treats','Creamy Treats','Soft & Chewy','Grain Free Treats','Training Treats'];

  const scrollTopLeft = () => { if (topRef.current) topRef.current.scrollBy({ left: -220, behavior: 'smooth' }); };
  const scrollTopRight = () => { if (topRef.current) topRef.current.scrollBy({ left: 220, behavior: 'smooth' }); };

  const resolveImageUrl = (p) => {
    const candidate = p?.imageUrl || p?.image || p?.thumbnailUrl || p?.image_path;
    if (!candidate) return '/assets/images/no_image.png';
    if (/^(https?:)?\/\//i.test(candidate) || candidate.startsWith('data:')) return candidate;
    const base = apiClient?.defaults?.baseURL || '';
    return candidate.startsWith('/') ? `${base}${candidate}` : `${base}/${candidate}`;
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        let apiProducts = [];
        try { const res = await productApi.getAll(); apiProducts = Array.isArray(res) ? res : []; } catch (e) { const r = await dataService.getProducts(); apiProducts = r?.data || []; }

        const normalized = apiProducts.map(p => ({
          id: p?.id,
          name: p?.name || p?.title,
          category: p?.category || p?.categoryId || p?.subcategory || '',
          subcategory: p?.subcategory || '',
          brand: p?.brand || p?.manufacturer || 'Brand',
          price: parseFloat(p?.price ?? p?.salePrice ?? 0) || 0,
          original: parseFloat(p?.originalPrice ?? p?.mrp ?? p?.price ?? 0) || 0,
          image: resolveImageUrl(p),
          badges: p?.badges || [],
          variants: p?.variants?.map(v => v?.weight || v?.label) || ['Default'],
          tags: p?.tags || [],
          lifeStage: p?.lifeStage || p?.age_group || '',
          breedSize: p?.breedSize || p?.breed || '',
          productType: p?.productType || p?.type || '',
          specialDiet: p?.specialDiet || '',
          proteinSource: p?.proteinSource || p?.protein || '',
          weight: p?.weight || ''
        }));

        if (!mounted) return;
        setProducts(normalized);
      } catch (err) { console.error('Failed to load cat treats', err); setProducts([]); }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Apply filters and category filtering
  useEffect(() => {
    if (products.length === 0) return;

    const url = window.location.pathname;
    let routeTarget = '';
    try { const m = url.match(/^\/cats\/([^\/\?]+)/i); if (m && m[1]) routeTarget = decodeURIComponent(m[1]).toLowerCase(); } catch(e){}
    const target = (initialActive || '').toLowerCase().replace(/\s+/g,'-');
    const finalTarget = routeTarget || target || 'cat-treats';
    const search = new URLSearchParams(window.location.search).get('sub') || '';
    const norm = s => String(s||'').toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');

    let working = products.filter(p => {
      const c = norm(p.category) || '';
      const sc = norm(p.subcategory) || '';
      return c.includes('cat') || sc.includes('cat') || c === finalTarget || sc === finalTarget || String(p.name || '').toLowerCase().includes('treat');
    });
    if (search) { 
      const t = norm(search); 
      working = working.filter(p => { 
        const sc = norm(p.subcategory||''); 
        const tags = (p.tags||[]).map(x=>norm(x)).join(' '); 
        const name = String(p.name||'').toLowerCase(); 
        return sc === t || tags.includes(t) || name.includes(t.replace(/-/g,' ')); 
      }); 
    }

    // Apply selected filters
    if (selectedFilters.brands.length > 0) {
      working = working.filter(p => selectedFilters.brands.includes(p.brand));
    }
    if (selectedFilters.productTypes.length > 0) {
      working = working.filter(p => selectedFilters.productTypes.some(pt => 
        String(p.productType || '').toLowerCase().includes(pt.toLowerCase()) ||
        String(p.subcategory || '').toLowerCase().includes(pt.toLowerCase()) ||
        String(p.name || '').toLowerCase().includes(pt.toLowerCase())
      ));
    }
    if (selectedFilters.priceRanges.length > 0) {
      working = working.filter(p => {
        const price = p.price || 0;
        return selectedFilters.priceRanges.some(range => {
          if (range === 'INR 10 - INR 100') return price >= 10 && price <= 100;
          if (range === 'INR 101 - INR 200') return price >= 101 && price <= 200;
          if (range === 'INR 201 - INR 500') return price >= 201 && price <= 500;
          if (range === 'INR 500+') return price > 500;
          return true;
        });
      });
    }
    if (selectedFilters.weights.length > 0) {
      working = working.filter(p => selectedFilters.weights.some(w => 
        String(p.weight || '').toLowerCase().includes(w.toLowerCase()) ||
        (p.variants || []).some(variant => String(variant).toLowerCase().includes(w.toLowerCase()))
      ));
    }

    // Apply sorting
    switch (selectedFilters.sortBy) {
      case 'Price, low to high':
        working.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'Price, high to low':
        working.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'Alphabetically, A-Z':
        working.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'Alphabetically, Z-A':
        working.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        break;
    }

    setFilteredProducts(working);
  }, [products, selectedFilters, initialActive]);

  const routeMap = {
    'All Cat Treats': '/cats/cat-treats/all-cat-treats',
    'Crunchy Treats': '/cats/cat-treats/crunchy-treats',
    'Creamy Treats': '/cats/cat-treats/creamy-treats',
    'Grain Free Treats': '/cats/cat-treats/grain-free-treats',
    'Soft & Chewy': '/cats/cat-treats/soft-chewy'
  };

  return (
    <>
      <Helmet>
        <title>Shop for Cats — Cat Treats</title>
        <style>{`
          .hide-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
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
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
            <div ref={leftRef} className="bg-white rounded border border-border overflow-hidden">
              <ul className="divide-y">
                {categories.map((c,idx)=>(
                  <li key={c.id} className={`relative border-b ${active===c.label?'bg-[#fff6ee]':''}`}>
                    <button onClick={()=>{setActive(c.label); const p=routeMap[c.label]; if(p) navigate(p);}} className="w-full text-left flex items-center gap-4 p-4 pr-6">
                      <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border ${active===c.label?'ring-2 ring-orange-400':'border-gray-100'}`}>
                        <img src={c.img} alt={c.label} className="w-full h-full object-cover"/>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{c.label}</span>
                    </button>
                    {active===c.label && (<div className="absolute right-0 top-0 h-full w-1 bg-orange-400" />)}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          
          <main ref={rightRef} className="col-span-12 lg:col-span-9 xl:col-span-10">
            {/* horizontal filter bar */}
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(filteredProducts.length > 0 ? filteredProducts : sampleProducts).map(p=>(<ProductCard key={p.id} p={p} />))}
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
              <div className="text-xs text-muted-foreground">{filteredProducts.length} products</div>
            </div>
            <button onClick={() => setFilterOpen(false)} className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div ref={drawerContentRef} className="px-4 pt-4 pb-32 hide-scrollbar overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            <section className="mb-6">
              <h4 className="text-sm font-medium mb-3">Sort By</h4>
              <div className="flex flex-wrap gap-2">
                {['Featured','Best selling','Alphabetically, A-Z','Price, low to high','Price, high to low'].map(s=> (
                  <button key={s} className="text-xs px-3 py-1 border border-border rounded bg-white">{s}</button>
                ))}
              </div>
            </section>

            <section ref={el => sectionRefs.current['Brand'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Brand</h4>
              <div className="flex flex-wrap gap-2">
                {brands.map(b=> (<button key={b} className="text-xs px-3 py-1 border border-border rounded bg-white">{b}</button>))}
              </div>
            </section>

            <section ref={el => sectionRefs.current['Cat/Kitten'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Cat/Kitten</h4>
              <div className="flex flex-wrap gap-2">{catKitten.map(d=> (<button key={d} className="text-xs px-3 py-1 border border-border rounded bg-white">{d}</button>))}</div>
            </section>

            <section ref={el => sectionRefs.current['Life Stage'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Life stage</h4>
              <div className="flex flex-wrap gap-2">{lifeStages.map(l=> (<button key={l} className="text-xs px-3 py-1 border border-border rounded bg-white">{l}</button>))}</div>
            </section>

            <section ref={el => sectionRefs.current['Product Type'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Product type</h4>
              <div className="flex flex-wrap gap-2">{productTypes.map(p=> (<button key={p} className="text-xs px-3 py-1 border border-border rounded bg-white">{p}</button>))}</div>
            </section>

            <section ref={el => sectionRefs.current['Special Diet'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Special diet</h4>
              <div className="flex flex-wrap gap-2">{specialDiets.map(s=> (<button key={s} className="text-xs px-3 py-1 border border-border rounded bg-white">{s}</button>))}</div>
            </section>

            <section ref={el => sectionRefs.current['Sub Category'] = el} className="mb-6">
              <h4 className="text-sm font-medium mb-3">Sub category</h4>
              <div className="flex flex-wrap gap-2">{subCategories.map(s=> (<button key={s} className="text-xs px-3 py-1 border border-border rounded bg-white">{s}</button>))}</div>
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
};

export default CatTreats;
