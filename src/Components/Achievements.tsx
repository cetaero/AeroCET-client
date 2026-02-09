import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function Achievements() {
  const [isActive, setIsActive] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const teamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/achievements')
      .then((response) => {
        console.log("Achievements Data:", response.data); 
        setAchievements(Array.isArray(response.data) ? response.data : []); 
        
        setTimeout(() => {
          setIsActive(true);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error fetching achievements:", error);
        setAchievements([]);
      });

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (teamRef.current) {
      observer.observe(teamRef.current);
    }

    return () => {
      if (teamRef.current) {
        observer.unobserve(teamRef.current);
      }
    };
  }, []);

  const goTo = () => {
    navigate('/');
  };

  return (
    <div
      onClick={goTo}
      ref={teamRef}
      className={clsx(
        "p-6 w-full lg:m-44 md:my-64 items-center lg:h-[600px] md:h-[700px] sm:h-[700px] flex-1 flex flex-col bg-gray-200 rounded-3xl",
        { 'opacity-0 translate-y-8': !isActive },
        { 'opacity-100 translate-y-0 transition-all duration-700 ease-in-out delay-200': isActive }
      )}
    >
      <h1
        className={clsx(
          "lg:text-4xl text-3xl font-bold text-gray-800 my-12",
          "transition-all duration-500 ease-in-out",
          { 'opacity-0 translate-y-8': !isActive },
          { 'opacity-100 translate-y-0 delay-500': isActive }
        )}
      >
        Achievements
      </h1>

      <div className="flex flex-wrap overflow-auto flex-col gap-3">
        {[...achievements].reverse().map((image, index) => (
          <div
            key={index}
            className={clsx(
              "flex-1 flex justify-center items-center min-w-0",
              "transition-all duration-500 ease-in-out",
              { 'opacity-0 translate-y-8': !isActive },
              { 'opacity-100 translate-y-0 delay-700': isActive }
            )}
          >
          <div className="w-64 aspect-[3/4] overflow-hidden rounded-xl shadow-lg shrink-0">

            <img
              src={image || '/fallback.jpg'}
              alt="Achievement"
              className="w-full h-full"
              onError={(e) => (e.currentTarget.src = '/fallback.jpg')}
            />
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}
