import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';

type Project = {
  project_id: string;
  project_name: string;
  project_head: string;
  start_date: string;
  end_date: string;
  status: string;
  img_path: string;
  description: string;
};

export default function Projects() {
  const [isActive, setIsActive] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    axios
      .get('/api/projects')
      .then((res) => setProjects(Array.isArray(res.data) ? res.data : []))
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setProjects([]);
      });

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      ref={sectionRef}
      className={clsx(
        'p-6 px-8 w-full shad lg:m-44 md:my-64 items-center lg:h-[600px] md:h-[700px] sm:h-[700px] flex-1 flex flex-col rounded-3xl',
        'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800',
        { 'opacity-0 translate-y-8': !isActive },
        {
          'opacity-100 translate-y-0 transition-all duration-700 ease-in-out delay-200':
            isActive,
        }
      )}
    >
      {/* Heading */}
      <div className="flex items-center gap-3 my-6">
        <div className="h-[2px] w-10 bg-orange-500 rounded-full" />
        <h1
          className={clsx(
            'lg:text-4xl text-3xl font-bold text-white tracking-wide',
            'transition-all duration-500 ease-in-out',
            { 'opacity-0 translate-y-8': !isActive },
            { 'opacity-100 translate-y-0 delay-500': isActive }
          )}
        >
          Our Projects
        </h1>
        <div className="h-[2px] w-10 bg-orange-500 rounded-full" />
      </div>

      {/* Project Cards Container */}
      <div
        className="w-full overflow-y-auto space-y-5 px-2 pb-4 flex-1"
        style={{ maxHeight: '500px' }}
      >
        {projects.map((project, index) => (
          <div
            key={project.project_id}
            onClick={() => toggleExpand(project.project_id)}
            className={clsx(
              'group relative flex flex-col lg:flex-row gap-5 p-5 rounded-2xl cursor-pointer',
              'bg-white/5 backdrop-blur-sm border border-white/10',
              'hover:bg-white/10 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10',
              'transition-all duration-500 ease-in-out',
              { 'opacity-0 translate-y-8': !isActive },
              {
                [`opacity-100 translate-y-0`]: isActive,
              }
            )}
            style={{ transitionDelay: isActive ? `${300 + index * 150}ms` : '0ms' }}
          >
            {/* Project Image */}
            <div className="lg:w-56 w-full h-40 shrink-0 overflow-hidden rounded-xl bg-slate-700/50">
              {project.img_path ? (
                <img
                  src={`http://localhost:3001${project.img_path}`}
                  alt={project.project_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML =
                      '<div class="w-full h-full flex items-center justify-center text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Project Content */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              {/* Title + Status Row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors duration-300 leading-tight">
                  {project.project_name}
                </h2>
                <span
                  className={clsx(
                    'shrink-0 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider',
                    project.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : project.status === 'Ongoing'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  )}
                >
                  {project.status}
                </span>
              </div>

              {/* Project Head */}
              {project.project_head && (
                <p className="text-sm text-slate-400 mb-2">
                  <span className="text-orange-400 font-medium">Lead:</span>{' '}
                  {project.project_head}
                </p>
              )}

              {/* Description */}
              <p
                className={clsx(
                  'text-sm text-slate-300 leading-relaxed transition-all duration-300',
                  expandedId === project.project_id
                    ? 'line-clamp-none'
                    : 'line-clamp-3'
                )}
              >
                {project.description}
              </p>

              {/* Read more hint */}
              {project.description && project.description.length > 200 && (
                <span className="text-xs text-orange-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {expandedId === project.project_id
                    ? 'Click to collapse'
                    : 'Click to read more'}
                </span>
              )}
            </div>

            {/* Decorative accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 mb-4 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <p className="text-lg font-medium">Loading projects...</p>
          </div>
        )}
      </div>
    </div>
  );
}
