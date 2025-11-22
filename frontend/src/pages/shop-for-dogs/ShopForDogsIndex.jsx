import React from 'react';
import { useLocation } from 'react-router-dom';
import DogTreats from './DogTreats';
import WalkEssentials from './WalkEssentials';
import DogFood from './DogFood';
import DogTrainingEssentials from './DogTrainingEssentials';
import DogGrooming from './dog-grooming/DogGrooming';
import MobileBottomNav from '../../components/ui/MobileBottomNav';

export default function ShopForDogsIndex() {
  const location = useLocation();
  const q = new URLSearchParams(location.search).get('category') || '';
  const sub = new URLSearchParams(location.search).get('sub') || '';
  const cat = q.toLowerCase();

  let Page = DogTreats;

  if (cat === 'walk-essentials' || cat === 'walkessentials' || cat === 'walk') {
    Page = WalkEssentials;
  } else if (cat.includes('groom')) {
    Page = () => <DogGrooming initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('treat')) {
    Page = DogTreats;
  } else if (cat.includes('train') || cat.includes('training') || cat === 'dog-training' || cat === 'dog-training-essentials') {
    Page = DogTrainingEssentials;
  } else if (cat.includes('food') || cat === 'dogfood' || cat === 'dog-food') {
    Page = DogFood;
  }

  return (
    <>
      <Page />
      <MobileBottomNav />
    </>
  );
}
