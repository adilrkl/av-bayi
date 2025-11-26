import { HeroSlider } from "@/components/home/hero-slider";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BenefitsSection } from "@/components/home/benefits-section";

export const revalidate = 0;

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <HeroSlider />
      <BenefitsSection />
      <CategoryShowcase />
      <FeaturedProducts />
    </div>
  );
}
