import {
  Egg, Beef, Wheat, TrendingUp, Stethoscope, Warehouse,
  GraduationCap, Coins, Package, Droplets, Shield, FileText,
  Settings, BookOpen, Truck,
} from 'lucide-react';
import {
  servicesCatalog as catalogData,
  serviceCategories,
} from '../../server/lib/servicesCatalogData.js';

const ICONS = {
  Egg,
  Beef,
  Wheat,
  TrendingUp,
  Stethoscope,
  Warehouse,
  GraduationCap,
  Coins,
  Package,
  Droplets,
  Shield,
  FileText,
  Settings,
  BookOpen,
  Truck,
};

export const servicesCatalog = catalogData.map((item) => ({
  ...item,
  icon: ICONS[item.iconKey] || Package,
}));

export { serviceCategories };
