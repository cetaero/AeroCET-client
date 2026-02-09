import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import clsx from "clsx";
import logo from "../assets/AeroCET-logo.png";

export default function Teams() {
  const { year } = useParams(); // Extracts year from URL like "/teams/2025"
  const selectedYear = year ? parseInt(year, 10) : new Date().getFullYear(); // Convert to number or use current year
  const [isActive, setIsActive] = useState(false);
  const [people, setPeople] = useState<{ id: number; imgURL: string; name: string; role: string }[]>([]);
  const teamsRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const goTo = () => {
    navigate("/");
  };

  useEffect(() => {
    axios
      .get('/api/execom')
      .then((response) => {
        console.log("API Response:", response.data); // Debug API response

        if (response.data[selectedYear]) {
          setPeople(response.data[selectedYear]); // Set people based on the year
        } else {
          setPeople([]); // Set empty if year data not found
        }
      })
      .catch((error) => {
        console.error("Error fetching team data:", error);
      });

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (teamsRef.current) {
      observer.observe(teamsRef.current);
    }

    return () => {
      if (teamsRef.current) {
        observer.unobserve(teamsRef.current);
      }
    };
  }, [selectedYear]); // Re-run effect when year changes

  return (
    <div ref={teamsRef} className="p-3 lg:p-8 relative flex flex-col items-center h-full max-h-screen overflow-y-auto">
      {/* Centered Logo Button */}
      <button
        onClick={goTo}
        className={clsx(
          "mb-4 flex justify-center items-center transform transition duration-500",
          { "opacity-0 translate-y-8": !isActive },
          { "opacity-100 translate-y-0 delay-500": isActive }
        )}
      >
        <img src={logo} className="h-16 w-auto md:h-24 transform transition duration-500 hover:scale-110" alt="logo" />
      </button>

      {/* Content */}
      <h1 className={clsx("text-xl sm:text-2xl font-bold text-white mb-4", { "opacity-0 translate-y-8": !isActive }, { "opacity-100 translate-y-0 transition-all duration-700 ease-in-out delay-200": isActive })}>
        Our Team
      </h1>


      {/* Team Members */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-7 md:grid-cols-4 gap-3 w-full rounded-lg">
        {people.length > 0 ? (
          people.map((member) => (
            <div key={member.id} className={clsx("bg-gray-800 p-2 rounded-xl transform transition duration-300 hover:scale-105 flex flex-col items-center", { "opacity-0 translate-y-8": !isActive }, { "opacity-100 translate-y-0 transition-all duration-700 ease-in-out": isActive })}>
              <img
                src={member.imgURL || logo} 
                onError={(e) => (e.currentTarget.src = logo)} // Fallback if image fails
                className="rounded-lg w-full max-w-[100px] sm:max-w-[150px] object-cover" 
                alt={member.name} 
              />
              <h2 className="text-lg font-semibold text-orange-500 text-center mt-2">{member.name}</h2>
              <p className="text-white text-center text-sm">{member.role}</p>
            </div>
          ))
        ) : (
          <p className="text-white text-center">No team data available for {selectedYear}.</p>
        )}
      </div>
    </div>
  );
}
