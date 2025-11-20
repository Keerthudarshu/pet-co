import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { useCart } from '../../contexts/CartContext';
import productApi from '../../services/productApi';
import dataService from '../../services/dataService';
import apiClient from '../../services/api';

const categories = [
  { id: 'all', label: 'All Cat Bowls', img: '/assets/images/cat/cf1.webp' },
  { id: 'bowls', label: 'Bowls', img: '/assets/images/cat/cf2.webp' },
  { id: 'travel', label: 'Travel & Fountain', img: '/assets/images/cat/cf3.webp' }
];

const sampleProducts = [
  { id: 'cb1', name: 'Ceramic Cat Bowl', image: '/assets/images/essential/meowsi.webp', badges: ['Durable'], variants: ['Small','Medium','Large'], price: 399 },
  { id: 'cb2', name: 'Slow Feeder Bowl', image: '/assets/images/essential/whiskas.webp', badges: ['Slow Feed'], variants: ['One Size'], price: 549 },
  { id: 'cb3', name: 'Travel Water Fountain', image: '/assets/images/essential/sheba.webp', badges: ['Portable'], variants: ['500 ml'], price: 1299 }
];

const ProductCard = ({p}) => {
  const [selectedVariant, setSelectedVariant] = useState(p.variants?.[0] || null);
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const navigate = useNavigate();
  const handleAdd = () => addToCart({ id: p.id, productId: p.id, name: p.name, image: p.image, price: p.price, variant: selectedVariant }, 1);
  const handleWishlist = () => { if (isInWishlist(p.id)) removeFromWishlist(p.id); else addToWishlist({ id: p.id, name: p.name, image: p.image, price: p.price }); };
  return (
    <article className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="p-3">
        <div className="h-8 flex items-center justify-start"><div className="bg-green-500 text-white text-xs px-3 py-1 rounded-t-md">{p.badges?.[0]}</div></div>
        <button onClick={() => navigate(`/product-detail-page?id=${p.id}`)} className="mt-3 h-44 flex items-center justify-center bg-[#f6f8fb] rounded w-full"><img src={p.image} alt={p.name} className="max-h-40 object-contain"/></button>
        <h3 onClick={() => navigate(`/product-detail-page?id=${p.id}`)} className="mt-3 text-sm font-semibold text-foreground cursor-pointer">{p.name}</h3>
        <div className="mt-3 flex flex-wrap gap-2">{p.variants.map((v,i)=>(<button key={i} onClick={() => setSelectedVariant(v)} className={`text-xs px-2 py-1 border border-border rounded ${selectedVariant===v?'bg-green-600 text-white':'bg-white'}`}>{v}</button>))}</div>
        <div className="mt-4 flex items-center justify-between"><div><div className="text-lg font-bold">₹{p.price.toFixed(2)}</div></div>
        <div className="flex flex-col items-end gap-2"><button onClick={handleAdd} className="bg-orange-500 text-white px-4 py-2 rounded-full">Add</button>
        <button onClick={handleWishlist} className="text-xs text-muted-foreground">{isInWishlist(p.id)?'Remove ♥':'Wishlist ♡'}</button></div></div>
      </div>
    </article>
  );
};

const CatBowls = ({ initialActive = 'All Cat Bowls' }) => {
  const [active, setActive] = useState(initialActive);
  const { getCartItemCount, cartItems } = useCart();
  const navigate = useNavigate();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const routeMap = { 'All Cat Bowls': '/cats/cat-bowls/all-cat-bowls', 'Bowls': '/cats/cat-bowls/bowls', 'Travel & Fountain': '/cats/cat-bowls/travel-fountain' };
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const topFilters = ['Brand','Material','Size','Purpose','Price','Sub Category'];
  const [selectedTopFilter, setSelectedTopFilter] = useState(topFilters[0]);
  const topRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const drawerContentRef = useRef(null);
  const sectionRefs = useRef({});

  const [selectedFilters, setSelectedFilters] = useState({ brands: [], material: [], sizes: [], purpose: [], priceRanges: [], subCategories: [], sortBy: '' });
  const toggleFilter = (category, value) => setSelectedFilters(prev => ({ ...prev, [category]: prev[category].includes(value) ? prev[category].filter(x=>x!==value) : [...prev[category], value] }));

  const brands = ['M-Pets','Nibbles','PetSafe','Catit'];
  const material = ['Ceramic','Stainless Steel','Plastic','Silicone'];
  const sizes = ['Small','Medium','Large'];
  const purpose = ['Slow Feeder','Travel','Fountain','Anti Slip'];
  const priceRanges = ['INR 100 - INR 500','INR 501 - INR 1000','INR 1001+'];
  const subCategories = ['Bowls','Anti Spill Mats','Travel Bowls','Fountains'];

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
          productType: p?.productType || p?.type || '',
          weight: p?.weight || ''
        }));
        if (!mounted) return; setProducts(normalized);
      } catch (err) { console.error('Failed to load cat bowls', err); setProducts([]); }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const url = window.location.pathname;
    let routeTarget = '';
    try { const m = url.match(/^\/cats\/([^\/\?]+)/i); if (m && m[1]) routeTarget = decodeURIComponent(m[1]).toLowerCase(); } catch(e){}
    const target = (initialActive || '').toLowerCase().replace(/\s+/g,'-');
    const finalTarget = routeTarget || target || 'cat-bowls';
    const search = new URLSearchParams(window.location.search).get('sub') || '';
    const norm = s => String(s||'').toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');

    let working = products.filter(p => {
      const c = norm(p.category) || '';
      const sc = norm(p.subcategory) || '';
      return c.includes('cat') || sc.includes('cat') || c === finalTarget || sc === finalTarget || String(p.name || '').toLowerCase().includes('bowl') || String(p.name || '').toLowerCase().includes('fountain');
    });
    if (search) { const t = norm(search); working = working.filter(p => { const sc = norm(p.subcategory||''); const tags = (p.tags||[]).map(x=>norm(x)).join(' '); const name = String(p.name||'').toLowerCase(); return sc === t || tags.includes(t) || name.includes(t.replace(/-/g,' ')); }); }

    // simple filters
    if (selectedFilters.brands?.length>0) working = working.filter(p => selectedFilters.brands.includes(p.brand));
    if (selectedFilters.subCategories?.length>0) working = working.filter(p => selectedFilters.subCategories.some(sc => (p.subcategory||'').toLowerCase().includes(sc.toLowerCase()) || (p.productType||'').toLowerCase().includes(sc.toLowerCase())));

    setFilteredProducts(working);
  }, [products, selectedFilters, initialActive]);

  const scrollTopLeft = () => { if (topRef.current) topRef.current.scrollBy({ left: -220, behavior: 'smooth' }); };
  const scrollTopRight = () => { if (topRef.current) topRef.current.scrollBy({ left: 220, behavior: 'smooth' }); };

  return (
    <>
      <Helmet><title>Shop for Cats — Cat Bowls</title></Helmet>
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
            <div className="mb-4 flex items-center justify-between">
              <div className="relative flex-1 overflow-hidden">
                <button onClick={scrollTopLeft} aria-label="Scroll left" className="top-scroll-btn hidden md:inline-flex items-center justify-center border border-border bg-white ml-1 mr-2 absolute left-0 top-1/2 transform -translate-y-1/2 z-10">◀</button>
                <div ref={topRef} className="hide-scrollbar overflow-x-auto pl-10 pr-10" style={{ whiteSpace: 'nowrap' }}>
                  <div className="inline-flex items-center gap-2">
                    {topFilters.map((t) => (
                      <button key={t} onClick={() => setSelectedTopFilter(t)} className={`flex items-center gap-2 text-sm px-3 py-1 border border-border rounded-full bg-white ${selectedTopFilter === t ? 'ring-1 ring-orange-300' : ''}`} style={{ whiteSpace: 'nowrap' }}>{t}</button>
                    ))}
                  </div>
                </div>
                <button onClick={scrollTopRight} aria-label="Scroll right" className="top-scroll-btn hidden md:inline-flex items-center justify-center border border-border bg-white ml-2 mr-1 absolute right-0 top-1/2 transform -translate-y-1/2 z-10">▶</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(filteredProducts.length>0 ? filteredProducts : sampleProducts).map(p=>(<ProductCard key={p.id} p={p} />))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default CatBowls;
