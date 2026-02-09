
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';

type Workshop = {
  workshop_id: string;
  workshop_name: string;
  image: string;
  date: string;
  location: string;
  description: string;
};

export default function Workshop() {
  const [isActive, setIsActive] = useState(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const teamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/workshops`)
      .then((res) => setWorkshops(res.data))
      .catch(console.error);

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (teamRef.current) observer.observe(teamRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={teamRef}
      className={clsx(
        'p-6 px-12 w-full shad lg:m-44 md:my-64 items-center lg:h-[600px] md:h-[700px] sm:h-[700px] flex-1 flex flex-col rounded-3xl bg-gray-900',
        { 'opacity-0 translate-y-8': !isActive },
        {
          'opacity-100 translate-y-0 transition-all duration-700 ease-in-out delay-200':
            isActive,
        }
      )}
    >
      {/* Heading */}
      <h1
        className={clsx(
          'lg:text-4xl text-3xl font-bold my-6 text-white',
          'transition-all duration-500 ease-in-out',
          { 'opacity-0 translate-y-8': !isActive },
          { 'opacity-100 translate-y-0 delay-500': isActive }
        )}
      >
        Workshops
      </h1>

      {/* Scroll Box */}
      <div
        className="space-y-6 w-full overflow-y-auto px-4"
        style={{ maxHeight: '550px' }}
      >
        {workshops.map((workshop) => (
          <div
            key={workshop.workshop_id}
            className={clsx(
              'flex flex-col lg:flex-row gap-6 px-6 py-6 rounded-xl w-full bg-gray-200 shadow-lg shadow-orange-600 text-gray-800',
              'transition-all duration-500 ease-in-out',
              { 'opacity-0 translate-y-8': !isActive },
              { 'opacity-100 translate-y-0 delay-700': isActive }
            )}
          >
            {/* Image */}
            <div className="lg:w-1/3 w-full overflow-hidden rounded-xl shrink-0">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${workshop.image}`}
                alt={workshop.workshop_name}
                className="w-full h-56 object-cover"
                onError={(e) =>
                  (e.currentTarget.src = '/fallback.jpg')
                }
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center w-full">
              <h2 className="text-2xl font-bold mb-2">
                {workshop.workshop_name}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                📍 {workshop.location}
              </p>

              <p className="text-sm text-gray-600 mb-3">
                📅 {workshop.date}
              </p>

              <p className="text-gray-700 leading-relaxed">
                {workshop.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
