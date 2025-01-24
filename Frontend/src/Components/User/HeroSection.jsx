import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import banner_img1 from "../../assets/banner1.webp";

function HeroSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 120000, stopOnInteraction: true })
  );

  // Sample hero images - replace with your actual images
  const heroImages = [
    {
      src: banner_img1,
      alt: "Hero image 1",
    },
    {
      src: banner_img1,
      alt: "Hero image 2",
    },
    {
      src: banner_img1,
      alt: "Hero image 3",
    },
  ];

  return (
    <section className="w-full relative overflow-hidden">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full">
        <CarouselContent className="flex overflow-hidden">
          {heroImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <CarouselPrevious
            variant="outline"
            className="h-8 w-8 rounded-full border-none bg-white/70 hover:bg-white/90 transition-colors"
          />
          <CarouselNext
            variant="outline"
            className="h-8 w-8 rounded-full border-none bg-white/70 hover:bg-white/90 transition-colors"
          />
        </div>
      </Carousel>
    </section>
  );
}

export default HeroSection;
