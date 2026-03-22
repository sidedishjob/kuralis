import { HeroSection } from "./_sections/HeroSection";
import { StorySection } from "./_sections/StorySection";
import { ConceptSection } from "./_sections/ConceptSection";
import { CoreValuesSection } from "./_sections/CoreValuesSection";
import { GallerySection } from "./_sections/GallerySection";
import { DeveloperSection } from "./_sections/DeveloperSection";
import { CTASection } from "./_sections/CTASection";

export default function AboutPage() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <ConceptSection />
      <CoreValuesSection />
      <GallerySection />
      <DeveloperSection />
      <CTASection />
    </main>
  );
}
