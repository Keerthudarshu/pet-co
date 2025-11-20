import React from 'react';
import { useLocation } from 'react-router-dom';
import CatFood from './CatFood';
import CatsLanding from './CatsLanding';

export default function ShopForCatsIndex() {
  const location = useLocation();
  const pathname = (location.pathname || '').replace(/\\/g, '/');
  // If visiting /cats exactly, show the landing navigation similar to mega menu
  if (pathname === '/cats' || pathname === '/cats/') {
    return <CatsLanding />;
  }

  // For deeper cat routes, delegate to CatFood which handles subcategory query/path
  return <CatFood />;
}
