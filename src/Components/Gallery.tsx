import './Gallery.css';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Gallery() {
  const [isActive, setIsActive] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const goTo = () => {
    navigate('/');
  };

  // Fetch images from backend
  useEffect(() => {
    axios.get('/api/gallery')
      .then((response) => {
        const imgs = response.data?.images || response.data || [];
        setImages(Array.isArray(imgs) ? imgs : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching gallery:', error);
        setImages([]);
        setLoading(false);
      });

    // Intersection Observer for fade-in animation
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (galleryRef.current) observer.observe(galleryRef.current);
    return () => {
      if (galleryRef.current) observer.unobserve(galleryRef.current);
    };
  }, []);

  // Split images into 3 columns
  const firstColumnImages = images.slice(0, Math.ceil(images.length / 3));
  const secondColumnImages = images.slice(Math.ceil(images.length / 3), 2 * Math.ceil(images.length / 3));
  const thirdColumnImages = images.slice(2 * Math.ceil(images.length / 3));

  // Duplicate for infinite scroll
  const duplicatedFirstColumn = [...firstColumnImages, ...firstColumnImages];
  const duplicatedSecondColumn = [...secondColumnImages, ...secondColumnImages];
  const duplicatedThirdColumn = [...thirdColumnImages, ...thirdColumnImages];

  return (
    <div
      onClick={goTo}
      ref={galleryRef}
      className={clsx(
        "p-24 w-full shad lg:h-[700px] md:h-[600px] sm:h-[600px] items-center flex-1 flex justify-around lg:flex-row sm:flex-col overflow-hidden",
        { 'opacity-0 translate-y-8': !isActive },
        { 'opacity-100 translate-y-0 transition-all duration-1000 delay-200 ease-in-out': isActive }
      )}
    >
      {/* First Column - Scroll Up */}
      <div className={clsx(
        "flex flex-col scroll-container lg:w-[300px] md:w-[500px] sm:w-[250px] items-center justify-start gap-3",
        { 'opacity-0 translate-y-8': !isActive },
        { 'opacity-100 translate-y-0 transition-all duration-700 delay-300 ease-in-out': isActive }
      )}>
        {!loading && (
          <div className="scroll-track-up">
            {duplicatedFirstColumn.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt="Gallery" className="rounded-3xl mb-3 flex-shrink-0" />
            ))}
          </div>
        )}
      </div>

      {/* Second Column - Scroll Down */}
      <div className={clsx(
        "flex flex-col scroll-container lg:w-[400px] md:w-[500px] sm:w-[250px] items-center justify-start gap-3 mx-2",
        { 'opacity-0 translate-y-8': !isActive },
        { 'opacity-100 translate-y-0 transition-all duration-1000 delay-700 ease-in-out': isActive }
      )}>
        {!loading && (
          <div className="scroll-track-down">
            {duplicatedSecondColumn.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt="Gallery" className="rounded-3xl mb-3 flex-shrink-0" />
            ))}
          </div>
        )}
      </div>

      {/* Third Column - Scroll Up */}
      <div className={clsx(
        "flex flex-col scroll-container lg:w-[300px] md:w-[500px] sm:w-[250px] items-center justify-start gap-3",
        { 'opacity-0 translate-y-8': !isActive },
        { 'opacity-100 translate-y-0 transition-all duration-700 delay-500 ease-in-out': isActive }
      )}>
        {!loading && (
          <div className="scroll-track-up">
            {duplicatedThirdColumn.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt="Gallery" className="rounded-3xl mb-3 flex-shrink-0" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
