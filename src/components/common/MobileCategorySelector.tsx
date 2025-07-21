
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categoriesData, Category } from '@/lib/categories-data';
import { cn } from '@/lib/utils';
import { ArrowLeft, ChevronRight, Home, LandPlot, Sparkles, Car, Briefcase, PawPrint, Sofa, Wrench, Shirt, Leaf } from 'lucide-react';

const categoryIcons: { [key: string]: React.ElementType } = {
  Property: Home,
  Land: LandPlot,
  Electronics: Sparkles,
  Vehicles: Car,
  Jobs: Briefcase,
  'Animals & Pets': PawPrint,
  'Furniture & Home': Sofa,
  Services: Wrench,
  Fashion: Shirt,
  Phones: Sparkles,
  'Food, Agriculture & Farming': Leaf,
  'Real Estate': Home,
  'Phones & Tablets': Sparkles,
};

interface MobileCategorySelectorProps {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onSubcategorySelect: (subcategory: string | null) => void;
}

export function MobileCategorySelector({
  selectedCategory,
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect,
}: MobileCategorySelectorProps) {
  const [view, setView] = useState<'main' | 'sub'>('main');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    onCategorySelect(category.name);
    if (category.subcategories && category.subcategories.length > 0) {
      setView('sub');
    }
  };

  const handleSubcategoryClick = (subcategory: string) => {
    onSubcategorySelect(subcategory);
    // You can decide if you want to close the selector after this
  };

  const handleBack = () => {
    setView('main');
    setActiveCategory(null);
    onCategorySelect(null);
    onSubcategorySelect(null);
  };
  
  const AllCategoriesItem = () => (
    <button
      onClick={() => {
        onCategorySelect(null);
        onSubcategorySelect(null);
      }}
      className={cn(
        "flex items-center w-full text-left p-4 border-b transition-colors",
        !selectedCategory ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'
      )}
    >
      <Home className="w-6 h-6 mr-4" />
      <span className="flex-grow">All Categories</span>
    </button>
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          {/* Header */}
          <div className="p-2 border-b">
            {view === 'sub' && activeCategory ? (
              <Button variant="ghost" onClick={handleBack} className="w-full justify-start text-base font-bold">
                <ArrowLeft className="w-5 h-5 mr-2" /> {activeCategory.name}
              </Button>
            ) : (
                <h3 className="text-lg font-bold p-2">Categories</h3>
            )}
          </div>

          {/* Body */}
          <div
            className={cn(
              "transform transition-transform duration-300 ease-in-out flex w-[200%]"
            )}
            style={{ transform: view === 'main' ? 'translateX(0)' : 'translateX(-50%)' }}
          >
            {/* Main Categories View */}
            <div className="w-1/2">
                <AllCategoriesItem />
                {categoriesData.map((cat) => {
                    const Icon = categoryIcons[cat.name] || Home;
                    return (
                        <button
                            key={cat.slug}
                            onClick={() => handleCategoryClick(cat)}
                            className={cn(
                                "flex items-center w-full text-left p-4 border-b transition-colors",
                                selectedCategory === cat.name ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'
                            )}
                        >
                            <Icon className="w-6 h-6 mr-4" />
                            <span className="flex-grow">{cat.name}</span>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </button>
                    )
                })}
            </div>

            {/* Subcategories View */}
            <div className="w-1/2">
                {activeCategory && (
                    <>
                        <button
                            onClick={() => handleSubcategoryClick('all')}
                            className={cn(
                                "flex items-center w-full text-left p-4 border-b transition-colors",
                                !selectedSubcategory || selectedSubcategory === 'all' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'
                            )}
                        >
                            All in {activeCategory.name}
                        </button>
                        {activeCategory.subcategories.map(sub => (
                            <button
                                key={sub}
                                onClick={() => handleSubcategoryClick(sub)}
                                className={cn(
                                    "flex items-center w-full text-left p-4 border-b transition-colors",
                                    selectedSubcategory === sub ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted'
                                )}
                            >
                                {sub}
                            </button>
                        ))}
                    </>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

    