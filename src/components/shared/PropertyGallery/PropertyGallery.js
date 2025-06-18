"use client";
import Image from "next/image";

export default function PropertyGallery({ images, mainImage, setMainImage }) {
  const visibleThumbnails = 2;
  const remainingImages = images.length - (visibleThumbnails + 1);

  return (
    <div className="flex flex-col md:flex-row gap-3 h-[300px] md:h-[400px]">
      {/* Main image on the left */}
      <div className="relative flex-1 rounded-lg overflow-hidden">
        <Image
          src={images[mainImage] || "/placeholder.svg"}
          alt="Property main view"
          fill
          className="object-cover"
        />
      </div>

      {/* Stacked thumbnails on the right */}
      <div className="hidden md:flex flex-col gap-3 w-1/3">
        {[1, 2].map(
          (i) =>
            images[i] && (
              <div
                key={i}
                className="relative flex-1 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setMainImage(i)}
              >
                <Image
                  src={images[i]}
                  alt={`Property view ${i}`}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                />
                {i === 2 && remainingImages > 0 && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/60 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open full gallery logic here
                    }}
                  >
                    <span className="text-white text-xl font-medium">
                      +{remainingImages} Images
                    </span>
                  </div>
                )}
              </div>
            )
        )}
      </div>

      {/* Mobile thumbnails row */}
      <div className="flex gap-3 mt-2 md:hidden">
        {images.slice(1, 3).map((image, index) => (
          <div
            key={index}
            className="relative h-20 flex-1 rounded-lg overflow-hidden"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Property view ${index + 2}`}
              fill
              className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setMainImage(index + 1)}
            />
            {index === 1 && remainingImages > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                <span className="text-white text-sm font-medium">
                  +{remainingImages}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
