import React from 'react';
import { useLocation } from 'react-router-dom';
import DogTreats from './DogTreats';
import WalkEssentials from './WalkEssentials';
import DogFood from './DogFood';
import DogTrainingEssentials from './DogTrainingEssentials';
import DogGrooming from './dog-grooming/DogGrooming';

export default function ShopForDogsIndex() {
  const location = useLocation();
  const q = new URLSearchParams(location.search).get('category') || '';
  const sub = new URLSearchParams(location.search).get('sub') || '';
  const cat = q.toLowerCase();

  if (cat === 'walk-essentials' || cat === 'walkessentials' || cat === 'walk') {
    return <WalkEssentials />;
  }

  if (cat.includes('groom')) {
    return <DogGrooming initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  }

  if (cat.includes('treat')) {
    return <DogTreats />;
  }

  if (cat.includes('train') || cat.includes('training') || cat === 'dog-training' || cat === 'dog-training-essentials') {
    return <DogTrainingEssentials />;
  }

  if (cat.includes('food') || cat === 'dogfood' || cat === 'dog-food') {
    return <DogFood />;
  }

  // default: preserve previous behavior (treats)
  return <DogTreats />;
}
