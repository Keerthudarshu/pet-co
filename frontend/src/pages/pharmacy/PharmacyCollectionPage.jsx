import React, { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';

const slugify = (s = '') => String(s || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

const normalizeForParam = (s = '') => String(s || '')
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w-]/g, '');

const PharmacyCollectionPage = ({ subLabel }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!subLabel) return;

    const slug = normalizeForParam(subLabel);
    const current = searchParams.get('sub') || '';
    if (current !== slug) {
      const next = new URLSearchParams(searchParams.toString());
      next.set('sub', slug);
      setSearchParams(next, { replace: true });
    }
  }, [subLabel]);

  // determine categories for the left rail. Prefer route-based detection
  // (so /pharmacy/dogs/* shows dog-specific categories) and fall back
  // to the `subLabel` content when provided.
  const location = useLocation();
  const lower = String(subLabel || '').toLowerCase();
  const dogCategories = [
    'Medicines for Skin',
    'Joint & Mobility',
    'Digestive Care',
    'All Dog Pharmacy'
  ];
  const catCategories = [
    'Skin & Coat Care',
    'Worming',
    'Oral Care',
    'All Cat Pharmacy'
  ];
  const medicinesCategories = [
    'Antibiotics',
    'Antifungals',
    'Anti Inflammatories',
    'Pain Relief',
    'All Medicines'
  ];
  const supplementsCategories = [
    'Vitamins & Minerals',
    'Joint Supplements',
    'Probiotics & Gut Health',
    'Skin & Coat Supplements',
    'All Supplements'
  ];
  const prescriptionCategories = [
    'Renal Support',
    'Hypoallergenic Diets',
    'Digestive Support',
    'Weight Management',
    'All Prescription Food'
  ];
  const defaultCategories = [
    'Medicines',
    'Supplements',
    'Prescription Food',
    'All Pharmacy'
  ];

  const pathname = String(location?.pathname || '').toLowerCase();
  const isDogPath = pathname.includes('/pharmacy/dogs');
  const isCatPath = pathname.includes('/pharmacy/cats');
  const isMedicinesPath = pathname.includes('/pharmacy/medicines');
  const isSupplementsPath = pathname.includes('/pharmacy/supplements');
  const isPrescriptionPath = pathname.includes('/pharmacy/prescription-food');
  const categories = isMedicinesPath
    ? medicinesCategories
    : isSupplementsPath
    ? supplementsCategories
    : isPrescriptionPath
    ? prescriptionCategories
    : isDogPath
    ? dogCategories
    : isCatPath
    ? catCategories
    : (lower.includes('dog') ? dogCategories : defaultCategories);

  const handleClickCategory = (label) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('sub', slugify(label));
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="bg-white rounded border border-border p-3">
              <h3 className="text-sm font-semibold mb-2">{(subLabel || 'Pharmacy').toUpperCase()}</h3>
              <ul className="space-y-2">
                {categories.map((c) => {
                  const active = (searchParams.get('sub') || '') === slugify(c);
                  return (
                    <li key={c}>
                      <button
                        onClick={() => handleClickCategory(c)}
                        className={`w-full text-left px-2 py-2 rounded flex items-center gap-3 ${active ? 'bg-[#fff6ee] ring-1 ring-orange-300' : 'hover:bg-gray-50'}`}>
                        <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm">{c.split(' ').slice(0,2).map(x=>x[0]).join('')}</span>
                        <span className="text-sm">{c}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <section className="col-span-12 md:col-span-9 lg:col-span-10">
            <h1 className="text-2xl font-heading font-bold">{subLabel || 'Pharmacy'}</h1>
            <p className="text-sm text-muted-foreground mt-2 mb-4">Select a category from the left to filter the pharmacy products.</p>

            {/* Placeholder grid for products - the real product grid is rendered by collection pages */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* simple placeholders to show layout */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded border border-border p-3 h-40" />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PharmacyCollectionPage;
