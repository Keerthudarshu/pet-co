import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Import your page components
import Homepage from './pages/homepage';
import ProductDetailPage from './pages/product-detail-page';
import DogFood from './pages/shop-for-dogs/DogFood';
import DogGrooming from './pages/shop-for-dogs/dog-grooming/DogGrooming';
import BrushesAndCombs from './pages/shop-for-dogs/dog-grooming/BrushesAndCombs';
import DryBathWipesPerfume from './pages/shop-for-dogs/dog-grooming/DryBathWipesPerfume';
import EarEyePawCare from './pages/shop-for-dogs/dog-grooming/EarEyePawCare';
import OralCare from './pages/shop-for-dogs/dog-grooming/OralCare';
import ShampooConditioner from './pages/shop-for-dogs/dog-grooming/ShampooConditioner';
import TickFleaControl from './pages/shop-for-dogs/dog-grooming/TickFleaControl';
import ShoppingCart from './pages/shopping-cart';
import CheckoutProcess from './pages/checkout-process';
import UserAuth from './pages/user-auth';
import UserAccountDashboard from './pages/user-account-dashboard';
import AdminLogin from './pages/admin-login';
import AdminPanel from './pages/admin-panel';
import AdminDashboard from './pages/admin-dashboard';
import NotFound from './pages/NotFound';
import DogTreats from './pages/shop-for-dogs/DogTreats';
import DogToys from './pages/shop-for-dogs/DogToys';
import WalkEssentials from './pages/shop-for-dogs/WalkEssentials';
import DogBedding from './pages/shop-for-dogs/DogBedding';
import DogClothing from './pages/shop-for-dogs/DogClothing';
import DogBowlsDiners from './pages/shop-for-dogs/DogBowlsDiners';
import DogHealthHygiene from './pages/shop-for-dogs/DogHealthHygiene';
import DogTravelSupplies from './pages/shop-for-dogs/DogTravelSupplies';
import DogTrainingEssentials from './pages/shop-for-dogs/DogTrainingEssentials';
import ShopForDogsIndex from './pages/shop-for-dogs/ShopForDogsIndex';
import CatFood from './pages/shop-for-cats/CatFood';
import ShopForCatsIndex from './pages/shop-for-cats/ShopForCatsIndex';
import CatTreats from './pages/shop-for-cats/CatTreats';
import CatToys from './pages/shop-for-cats/CatToys';
import CatBedding from './pages/shop-for-cats/CatBedding';
import CatLitter from './pages/shop-for-cats/CatLitter';
import CatBowls from './pages/shop-for-cats/CatBowls';
import CatCollars from './pages/shop-for-cats/CatCollars';
import CatGrooming from './pages/shop-for-cats/CatGrooming';
import DogPharmacyPage from './pages/pharmacy/dogs';
import CatPharmacyPage from './pages/pharmacy/cats';

// Pharmacy subpages - Dogs
import MedicinesForSkin from './pages/pharmacy/dogs/medicines-for-skin';
import JointAndMobility from './pages/pharmacy/dogs/joint-and-mobility';
import DigestiveCare from './pages/pharmacy/dogs/digestive-care';
import AllDogPharmacy from './pages/pharmacy/dogs/all-dog-pharmacy';

// Pharmacy subpages - Cats
import SkinCoatCare from './pages/pharmacy/cats/skin-coat-care';
import Worming from './pages/pharmacy/cats/worming';
import OralCareCat from './pages/pharmacy/cats/oral-care';
import AllCatPharmacy from './pages/pharmacy/cats/all-cat-pharmacy';

// Medicines
import Antibiotics from './pages/pharmacy/medicines/antibiotics';
import Antifungals from './pages/pharmacy/medicines/antifungals';
import AntiInflammatories from './pages/pharmacy/medicines/anti-inflammatories';
import PainRelief from './pages/pharmacy/medicines/pain-relief';
import AllMedicines from './pages/pharmacy/medicines/all-medicines';

// Supplements
import VitaminsMinerals from './pages/pharmacy/supplements/vitamins-minerals';
import JointSupplements from './pages/pharmacy/supplements/joint-supplements';
import ProbioticsGutHealth from './pages/pharmacy/supplements/probiotics-gut-health';
import SkinCoatSupplements from './pages/pharmacy/supplements/skin-coat-supplements';
import AllSupplements from './pages/pharmacy/supplements/all-supplements';

// Prescription food
import RenalSupport from './pages/pharmacy/prescription-food/renal-support';
import HypoallergenicDiets from './pages/pharmacy/prescription-food/hypoallergenic-diets';
import DigestiveSupport from './pages/pharmacy/prescription-food/digestive-support';
import WeightManagement from './pages/pharmacy/prescription-food/weight-management';
import AllPrescriptionFood from './pages/pharmacy/prescription-food/all-prescription-food';

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
  const sessionData = localStorage.getItem('neenu_auth_session');
  
  let isValidAdmin = false;
  
  // Trust backend-issued admin role persisted at login
  if (adminUser && (adminUser.role || '').toLowerCase() === 'admin') {
    isValidAdmin = true;
  } else if (sessionData) {
    try {
      const session = JSON.parse(sessionData);
      // Minimal fallback; main trust is adminUser role
      isValidAdmin = !!session?.userId;
    } catch (error) {
      console.error('Invalid session data:', error);
    }
  }
  
  if (!isValidAdmin) {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('neenu_auth_session');
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <ErrorBoundary>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/homepage" element={<Homepage />} />
                {/* Product collection route: choose collection based on query param (walk-essentials, dogfood, dogtreats, etc.) */}
                <Route path="/shop-for-dogs" element={<ShopForDogsIndex />} />
                <Route path="/shop-for-dogs/dog-grooming" element={<DogGrooming />} />
                <Route path="/shop-for-dogs/dog-grooming/brushes-combs" element={<BrushesAndCombs />} />
                <Route path="/shop-for-dogs/dog-grooming/dry-bath-wipes-perfume" element={<DryBathWipesPerfume />} />
                <Route path="/shop-for-dogs/dog-grooming/ear-eye-pawcare" element={<EarEyePawCare />} />
                <Route path="/shop-for-dogs/dog-grooming/oral-care" element={<OralCare />} />
                <Route path="/shop-for-dogs/dog-grooming/shampoo-conditioner" element={<ShampooConditioner />} />
                <Route path="/shop-for-dogs/dog-grooming/tick-flea-control" element={<TickFleaControl />} />
                {/* dog treats */}
                <Route path="/shop-for-dogs/dogtreats" element={<DogTreats />} />
                {/* dog toys */}
                <Route path="/shop-for-dogs/dog-toys" element={<DogToys />} />
                <Route path="/shop-for-dogs/dog-toys/all-dog-toys" element={<DogToys initialActive="All Dog Toys" />} />
                <Route path="/shop-for-dogs/dog-toys/balls" element={<DogToys initialActive="Balls" />} />
                <Route path="/shop-for-dogs/dog-toys/chew-toys" element={<DogToys initialActive="Chew Toys" />} />
                <Route path="/shop-for-dogs/dog-toys/crinkle-toys" element={<DogToys initialActive="Crinkle Toys" />} />
                <Route path="/shop-for-dogs/dog-toys/fetch-toys" element={<DogToys initialActive="Fetch Toys" />} />
                <Route path="/shop-for-dogs/dog-toys/interactive-toys" element={<DogToys initialActive="Interactive Toys" />} />
                <Route path="/shop-for-dogs/dog-toys/plush-toys" element={<DogToys initialActive="Plush Toys" />} />
                <Route path="/shop-for-dogs/dog-toys/rope-toys" element={<DogToys initialActive="Rope Toys" />} />
                <Route path="/shop-for-dogs/dog-toys/squeaker-toys" element={<DogToys initialActive="Squeaker Toys" />} />
                {/* Walk Essentials - direct route (no index wrapper) */}
                <Route path="/shop-for-dogs/walk-essentials" element={<WalkEssentials />} />
                <Route path="/shop-for-dogs/walk-essentials/all-walk-essentials" element={<WalkEssentials initialActive="All Walk Essentials" />} />
                <Route path="/shop-for-dogs/walk-essentials/collar" element={<WalkEssentials initialActive="Collar" />} />
                <Route path="/shop-for-dogs/walk-essentials/leash" element={<WalkEssentials initialActive="Leash" />} />
                <Route path="/shop-for-dogs/walk-essentials/harness" element={<WalkEssentials initialActive="Harness" />} />
                <Route path="/shop-for-dogs/walk-essentials/name-tags" element={<WalkEssentials initialActive="Name Tags" />} />
                <Route path="/shop-for-dogs/walk-essentials/personalised" element={<WalkEssentials initialActive="Personalised" />} />
                <Route path="/shop-for-dogs/dogtreats/all-dog-treats" element={<DogTreats initialActive="All Dog Treats" />} />
                <Route path="/shop-for-dogs/dogtreats/biscuits-snacks" element={<DogTreats initialActive="Biscuits & Snacks" />} />
                <Route path="/shop-for-dogs/dogtreats/soft-chewy" element={<DogTreats initialActive="Soft & Chewy" />} />
                <Route path="/shop-for-dogs/dogtreats/natural-treats" element={<DogTreats initialActive="Natural Treats" />} />
                <Route path="/shop-for-dogs/dogtreats/puppy-treats" element={<DogTreats initialActive="Puppy Treats" />} />
                <Route path="/shop-for-dogs/dogtreats/vegetarian-treats" element={<DogTreats initialActive="Vegetarian Treats" />} />
                <Route path="/shop-for-dogs/dogtreats/dental-chew" element={<DogTreats initialActive="Dental Chew" />} />
                <Route path="/shop-for-dogs/dogtreats/grain-free-treat" element={<DogTreats initialActive="Grain Free Treat" />} />
                {/* dogfood sub-pages (render DogFood with a preselected active category) */}
                <Route path="/shop-for-dogs/dogfood/all-dog-food" element={<DogFood initialActive="All Dog Food" />} />
                {/* dog clothing & accessories */}
                <Route path="/shop-for-dogs/dog-clothing" element={<DogClothing />} />
                <Route path="/shop-for-dogs/dog-clothing/all-dog-clothing" element={<DogClothing initialActive="All Dog Clothing" />} />
                <Route path="/shop-for-dogs/dog-clothing/festive-special" element={<DogClothing initialActive="Festive Special" />} />
                <Route path="/shop-for-dogs/dog-clothing/t-shirts-dresses" element={<DogClothing initialActive="T-Shirts & Dresses" />} />
                <Route path="/shop-for-dogs/dog-clothing/sweatshirts" element={<DogClothing initialActive="Sweatshirts" />} />
                <Route path="/shop-for-dogs/dog-clothing/sweaters" element={<DogClothing initialActive="Sweaters" />} />
                <Route path="/shop-for-dogs/dog-clothing/bow-ties-bandanas" element={<DogClothing initialActive="Bow Ties & Bandanas" />} />
                <Route path="/shop-for-dogs/dog-clothing/raincoats" element={<DogClothing initialActive="Raincoats" />} />
                <Route path="/shop-for-dogs/dog-clothing/shoes-socks" element={<DogClothing initialActive="Shoes & Socks" />} />
                <Route path="/shop-for-dogs/dog-clothing/jackets" element={<DogClothing initialActive="Jackets" />} />
                <Route path="/shop-for-dogs/dog-clothing/personalised" element={<DogClothing initialActive="Personalised" />} />
                {/* dog bedding */}
                <Route path="/shop-for-dogs/dog-bedding" element={<DogBedding />} />
                <Route path="/shop-for-dogs/dog-bedding/all-dog-bedding" element={<DogBedding initialActive="All Dog Bedding" />} />
                <Route path="/shop-for-dogs/dog-bedding/beds" element={<DogBedding initialActive="Beds" />} />
                <Route path="/shop-for-dogs/dog-bedding/blankets-cushions" element={<DogBedding initialActive="Blankets & Cushions" />} />
                <Route path="/shop-for-dogs/dog-bedding/mats" element={<DogBedding initialActive="Mats" />} />
                <Route path="/shop-for-dogs/dog-bedding/personalised-bedding" element={<DogBedding initialActive="Personalised Bedding" />} />
                <Route path="/shop-for-dogs/dog-bedding/tents" element={<DogBedding initialActive="Tents" />} />
                {/* dog health & hygiene */}
                <Route path="/shop-for-dogs/dog-health-hygiene" element={<DogHealthHygiene />} />
                <Route path="/shop-for-dogs/dog-health-hygiene/all-dog-health-hygiene" element={<DogHealthHygiene initialActive="All Dog Health & Hygiene" />} />
                <Route path="/shop-for-dogs/dog-health-hygiene/oral-care" element={<DogHealthHygiene initialActive="Oral Care" />} />
                <Route path="/shop-for-dogs/dog-health-hygiene/supplements" element={<DogHealthHygiene initialActive="Supplements" />} />
                <Route path="/shop-for-dogs/dog-health-hygiene/tick-flea-control" element={<DogHealthHygiene initialActive="Tick & Flea Control" />} />
                {/* Pharmacy landing pages */}
                <Route path="/pharmacy/dogs" element={<DogPharmacyPage />} />
                <Route path="/pharmacy/cats" element={<CatPharmacyPage />} />

                {/* Pharmacy subpages: dogs */}
                <Route path="/pharmacy/dogs/medicines-for-skin" element={<MedicinesForSkin />} />
                <Route path="/pharmacy/dogs/joint-and-mobility" element={<JointAndMobility />} />
                <Route path="/pharmacy/dogs/digestive-care" element={<DigestiveCare />} />
                <Route path="/pharmacy/dogs/all-dog-pharmacy" element={<AllDogPharmacy />} />

                {/* Pharmacy subpages: cats */}
                <Route path="/pharmacy/cats/skin-coat-care" element={<SkinCoatCare />} />
                <Route path="/pharmacy/cats/worming" element={<Worming />} />
                <Route path="/pharmacy/cats/oral-care" element={<OralCareCat />} />
                <Route path="/pharmacy/cats/all-cat-pharmacy" element={<AllCatPharmacy />} />

                {/* Medicines */}
                <Route path="/pharmacy/medicines/antibiotics" element={<Antibiotics />} />
                <Route path="/pharmacy/medicines/antifungals" element={<Antifungals />} />
                <Route path="/pharmacy/medicines/anti-inflammatories" element={<AntiInflammatories />} />
                <Route path="/pharmacy/medicines/pain-relief" element={<PainRelief />} />
                <Route path="/pharmacy/medicines/all-medicines" element={<AllMedicines />} />

                {/* Supplements */}
                <Route path="/pharmacy/supplements/vitamins-minerals" element={<VitaminsMinerals />} />
                <Route path="/pharmacy/supplements/joint-supplements" element={<JointSupplements />} />
                <Route path="/pharmacy/supplements/probiotics-gut-health" element={<ProbioticsGutHealth />} />
                <Route path="/pharmacy/supplements/skin-coat-supplements" element={<SkinCoatSupplements />} />
                <Route path="/pharmacy/supplements/all-supplements" element={<AllSupplements />} />

                {/* Prescription Food */}
                <Route path="/pharmacy/prescription-food/renal-support" element={<RenalSupport />} />
                <Route path="/pharmacy/prescription-food/hypoallergenic-diets" element={<HypoallergenicDiets />} />
                <Route path="/pharmacy/prescription-food/digestive-support" element={<DigestiveSupport />} />
                <Route path="/pharmacy/prescription-food/weight-management" element={<WeightManagement />} />
                <Route path="/pharmacy/prescription-food/all-prescription-food" element={<AllPrescriptionFood />} />
                {/* dog travel supplies */}
                <Route path="/shop-for-dogs/dog-travel-supplies" element={<DogTravelSupplies />} />
                <Route path="/shop-for-dogs/dog-travel-supplies/all-travel-supplies" element={<DogTravelSupplies initialActive="All Travel Supplies" />} />
                <Route path="/shop-for-dogs/dog-travel-supplies/carriers" element={<DogTravelSupplies initialActive="Carriers" />} />
                <Route path="/shop-for-dogs/dog-travel-supplies/travel-bowls" element={<DogTravelSupplies initialActive="Travel Bowls" />} />
                <Route path="/shop-for-dogs/dog-travel-supplies/travel-beds" element={<DogTravelSupplies initialActive="Travel Beds" />} />
                <Route path="/shop-for-dogs/dog-travel-supplies/water-bottles" element={<DogTravelSupplies initialActive="Water Bottles" />} />
                {/* dog bowls & diners */}
                <Route path="/shop-for-dogs/dog-bowls-diners" element={<DogBowlsDiners />} />
                <Route path="/shop-for-dogs/dog-bowls-diners/all-dog-bowls-diners" element={<DogBowlsDiners initialActive="All Dog Bowls & Diners" />} />
                <Route path="/shop-for-dogs/dog-bowls-diners/bowls" element={<DogBowlsDiners initialActive="Bowls" />} />
                <Route path="/shop-for-dogs/dog-bowls-diners/diners" element={<DogBowlsDiners initialActive="Diners" />} />
                <Route path="/shop-for-dogs/dog-bowls-diners/anti-spill-mats" element={<DogBowlsDiners initialActive="Anti Spill Mats" />} />
                <Route path="/shop-for-dogs/dog-bowls-diners/travel-fountain" element={<DogBowlsDiners initialActive="Travel & Fountain" />} />
                {/* dog training essentials */}
                <Route path="/shop-for-dogs/dog-training-essentials" element={<DogTrainingEssentials />} />
                <Route path="/shop-for-dogs/dog-training-essentials/all-training-essentials" element={<DogTrainingEssentials initialActive="All Training Essentials" />} />
                <Route path="/shop-for-dogs/dog-training-essentials/agility" element={<DogTrainingEssentials initialActive="Agility" />} />
                <Route path="/shop-for-dogs/dog-training-essentials/stain-odour" element={<DogTrainingEssentials initialActive="Stain & Odour" />} />
                <Route path="/shop-for-dogs/dogfood/dry-food" element={<DogFood initialActive="Dry Food" />} />
                <Route path="/shop-for-dogs/dogfood/wet-food" element={<DogFood initialActive="Wet Food" />} />
                <Route path="/shop-for-dogs/dogfood/grain-free" element={<DogFood initialActive="Grain Free" />} />
                <Route path="/shop-for-dogs/dogfood/puppy-food" element={<DogFood initialActive="Puppy Food" />} />
                <Route path="/shop-for-dogs/dogfood/hypoallergenic" element={<DogFood initialActive="Hypoallergenic" />} />
                <Route path="/shop-for-dogs/dogfood/veterinary-food" element={<DogFood initialActive="Veterinary Food" />} />
                <Route path="/shop-for-dogs/dogfood/food-toppers-and-gravy" element={<DogFood initialActive="Food Toppers & Gravy" />} />
                <Route path="/shop-for-dogs/dogfood/daily-meals" element={<DogFood initialActive="Daily Meals" />} />
                {/* Cats: route now handled by ShopForCatsIndex */}
                <Route path="/cats" element={<ShopForCatsIndex />} />
                <Route path="/cats/:category" element={<ShopForCatsIndex />} />
                {/* Shop for cats pages (mirrors dogs structure) */}
                <Route path="/shop-for-cats" element={<ShopForCatsIndex />} />
                <Route path="/cats/cat-food" element={<CatFood />} />
                <Route path="/cats/cat-food/all-cat-food" element={<CatFood initialActive="All Cat Food" />} />
                <Route path="/cats/cat-food/dry-food" element={<CatFood initialActive="Dry Food" />} />
                <Route path="/cats/cat-food/wet-food" element={<CatFood initialActive="Wet Food" />} />
                <Route path="/cats/cat-food/grain-free" element={<CatFood initialActive="Grain Free" />} />
                <Route path="/cats/cat-food/kitten-food" element={<CatFood initialActive="Kitten Food" />} />
                <Route path="/cats/cat-food/hypoallergenic" element={<CatFood initialActive="Hypoallergenic" />} />
                <Route path="/cats/cat-food/veterinary-food" element={<CatFood initialActive="Veterinary Food" />} />
                {/* Cat additional categories */}
                <Route path="/cats/cat-treats" element={<CatTreats />} />
                <Route path="/cats/cat-treats/all-cat-treats" element={<CatTreats initialActive="All Cat Treats" />} />
                <Route path="/cats/cat-treats/crunchy-treats" element={<CatTreats initialActive="Crunchy Treats" />} />
                <Route path="/cats/cat-treats/creamy-treats" element={<CatTreats initialActive="Creamy Treats" />} />
                <Route path="/cats/cat-treats/soft-chewy" element={<CatTreats initialActive="Soft & Chewy" />} />

                <Route path="/cats/cat-toys" element={<CatToys />} />
                <Route path="/cats/cat-toys/all-cat-toys" element={<CatToys initialActive="All Cat Toys" />} />
                <Route path="/cats/cat-toys/catnip-toys" element={<CatToys initialActive="Catnip Toys" />} />
                <Route path="/cats/cat-toys/interactive-toys" element={<CatToys initialActive="Interactive Toys" />} />
                <Route path="/cats/cat-toys/plush-toys" element={<CatToys initialActive="Plush Toys" />} />

                <Route path="/cats/cat-bedding" element={<CatBedding />} />
                <Route path="/cats/cat-bedding/all-beds-scratchers" element={<CatBedding initialActive="All Beds & Scratchers" />} />
                <Route path="/cats/cat-bedding/beds" element={<CatBedding initialActive="Beds" />} />
                <Route path="/cats/cat-bedding/mats" element={<CatBedding initialActive="Mats" />} />
                <Route path="/cats/cat-bedding/tents" element={<CatBedding initialActive="Tents" />} />

                <Route path="/cats/cat-litter" element={<CatLitter />} />
                <Route path="/cats/cat-litter/all-litter-supplies" element={<CatLitter initialActive="All Litter & Supplies" />} />
                <Route path="/cats/cat-litter/litter" element={<CatLitter initialActive="Litter" />} />
                <Route path="/cats/cat-litter/litter-trays" element={<CatLitter initialActive="Litter Trays" />} />
                <Route path="/cats/cat-litter/scooper" element={<CatLitter initialActive="Scooper" />} />
                {/* Cat bowls, collars, grooming routes */}
                <Route path="/cats/cat-bowls" element={<CatBowls />} />
                <Route path="/cats/cat-bowls/all-cat-bowls" element={<CatBowls initialActive="All Cat Bowls" />} />
                <Route path="/cats/cat-bowls/bowls" element={<CatBowls initialActive="Bowls" />} />
                <Route path="/cats/cat-bowls/travel-fountain" element={<CatBowls initialActive="Travel & Fountain" />} />

                <Route path="/cats/cat-collars" element={<CatCollars />} />
                <Route path="/cats/cat-collars/all-collars-accessories" element={<CatCollars initialActive="All Collars & Accessories" />} />
                <Route path="/cats/cat-collars/collars" element={<CatCollars initialActive="Collars" />} />
                <Route path="/cats/cat-collars/leash-harness" element={<CatCollars initialActive="Leash & Harness Set" />} />
                <Route path="/cats/cat-collars/name-tags" element={<CatCollars initialActive="Name Tags" />} />

                <Route path="/cats/cat-grooming" element={<CatGrooming />} />
                <Route path="/cats/cat-grooming/all-grooming" element={<CatGrooming initialActive="All Grooming" />} />
                <Route path="/cats/cat-grooming/brushes-combs" element={<CatGrooming initialActive="Brushes & Combs" />} />
                <Route path="/cats/cat-grooming/dry-bath" element={<CatGrooming initialActive="Dry Bath, Wipes & Perfume" />} />
                <Route path="/cats/cat-grooming/oral-care" element={<CatGrooming initialActive="Oral Care" />} />
                <Route path="/pharmacy/cats" element={<CatPharmacyPage />} />
                <Route path="/product-detail-page/:id" element={<ProductDetailPage />} />
                <Route path="/product-detail-page" element={<ProductDetailPage />} />
                <Route path="/shopping-cart" element={<ShoppingCart />} />
                <Route 
                  path="/checkout-process" 
                  element={
                    <ProtectedRoute message="Please sign in to continue with checkout">
                      <CheckoutProcess />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/user-login" element={<UserAuth />} />
                <Route path="/user-register" element={<UserAuth />} />
                <Route 
                  path="/user-account-dashboard" 
                  element={
                    <ProtectedRoute message="Please sign in to access your account dashboard">
                      <UserAccountDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  } 
                />
                <Route 
                  path="/admin-panel" 
                  element={
                    <ProtectedAdminRoute>
                      <AdminPanel />
                    </ProtectedAdminRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </ErrorBoundary>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
