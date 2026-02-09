import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function Announcements() {
  const [isActive, setIsActive] = useState(false);

  // Define the Announcement type
  interface Announcement {
    id: number;
    heading: string;
    message: string;
    link: string;
    excel?: string;
  }

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const teamRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/announcements')
      .then((response) => {
        console.log(response.data);
        setAnnouncements(Array.isArray(response.data) ? response.data : []);

        setTimeout(() => {
          setIsActive(true);
        }, 1000);
      })
      .catch((error) => {
        console.error('Error fetching announcements:', error);
        setAnnouncements([]);
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

  const handleClick = (item: Announcement) => {
    if (item.excel) {
      // Prepend the backend base URL to form an absolute URL
      const fileUrl = item.excel;

      // Fetch the file as a blob to ensure it's downloaded as binary data
      fetch(fileUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          // Use the file name from the URL
          a.download = item.excel?.split('/').pop() || 'downloaded_file';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch(error => {
          console.error('Error downloading file:', error);
        });
    } else {
      window.open(item.link, '_blank');
    }
  };

  return (
    <div
      onClick={goTo}
      ref={teamRef}
      className={clsx(
        'p-6 px-12 w-full shad lg:m-44 md:my-64 items-center lg:h-[600px] md:h-[700px] sm:h-[700px] flex-1 flex flex-col rounded-3xl',
        { 'opacity-0 translate-y-8': !isActive },
        { 'opacity-100 translate-y-0 transition-all duration-700 ease-in-out delay-200': isActive }
      )}
    >
      <h1
        className={clsx(
          'lg:text-4xl text-3xl font-bold my-6',
          'transition-all duration-500 ease-in-out',
          { 'opacity-0 translate-y-8': !isActive },
          { 'opacity-100 translate-y-0 delay-500': isActive }
        )}
      >
        Announcements
      </h1>

      <div className="space-y-6 w-full overflow-y-auto px-4" style={{ maxHeight: '550px' }}>
        {[...announcements].reverse().map((item, index) => (
          <div
            key={index}
            className={clsx(
              'flex flex-col lg:flex-row justify-evenly px-8 lg:px-20 py-6 rounded-md w-full bg-gray-200 shadow-lg text-gray-800 shadow-orange-600',
              'transition-all duration-500 ease-in-out',
              { 'opacity-0 translate-y-8': !isActive },
              { 'opacity-100 translate-y-0 delay-700': isActive }
            )}
          >
            <div className="justify-center w-full">
              <h2 className="text-2xl font-bold mb-2 lg:whitespace-nowrap">{item.heading}</h2>
              <p className="text-lg mb-4">{item.message}</p>
            </div>
            <button
              className="bg-orange-600 rounded-3xl px-10 py-2 lg:w-full lg:max-w-64 text-center text-white font-extrabold hover:bg-orange-700"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent's onClick (navigation) from firing
                handleClick(item);
              }}
            >
              {item.excel ? 'Download' : 'Check'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
