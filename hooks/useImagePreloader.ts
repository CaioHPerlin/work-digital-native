import { useState, useEffect } from "react";
import { Image } from "expo-image";

const useImagePreloader = (imageUrls: string[]) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloadImages = async () => {
      try {
        // Preload all images using Image.prefetch
        const cacheImages = imageUrls.map((url) => Image.prefetch(url));
        await Promise.all(cacheImages); // Wait for all images to be cached
        setLoading(false); // Set loading to false when done
      } catch (err) {
        console.error("Error caching images:", err);
      }
    };

    preloadImages();
  }, [imageUrls]);

  return loading;
};

export default useImagePreloader;
