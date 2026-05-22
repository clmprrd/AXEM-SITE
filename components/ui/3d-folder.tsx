
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';
import EditableText from './EditableText';

// --- Interfaces & Constants ---

export interface Project {
  id: string;
  image: string; // The cover image
  title: string;
  category?: string;
  gallery?: string[]; // Array of images if multiple are uploaded
  content?: string;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200";

// --- Internal Components ---

interface ProjectCardProps {
  project: Project;
  delay: number;
  isVisible: boolean;
  index: number;
  totalCount: number;
  onClick: () => void;
  isSelected: boolean;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, delay, isVisible, index, totalCount, onClick, isSelected }, ref) => {
    const middleIndex = (totalCount - 1) / 2;
    const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;
    
    const rotation = factor * 25; 
    const translationX = factor * 85; 
    const translationY = Math.abs(factor) * 12;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-20 h-28 cursor-pointer group/card",
          isSelected && "opacity-0",
        )}
        style={{
          transform: isVisible
            ? `translateY(calc(-100px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          zIndex: 10 + index,
          left: "-40px",
          top: "-56px",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
      >
        <div className={cn(
          "w-full h-full rounded-lg overflow-hidden shadow-xl bg-card border border-white/5 relative bg-black",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover/card:-translate-y-6 group-hover/card:shadow-2xl group-hover/card:shadow-accent/40 group-hover/card:ring-2 group-hover/card:ring-accent group-hover/card:scale-125"
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center p-2 text-center pointer-events-none">
             <span className="text-[10px] font-bold text-[#00FA9A] uppercase leading-tight drop-shadow-md z-10">{project.title}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";



export interface AnimatedFolderProps {
  title: string;
  projects: Project[];
  className?: string;
  gradient?: string;
  onFolderUpdate?: (newImages: string[]) => void;
  onProjectUpdate?: (projectIndex: number, newImages: string[]) => void;
  onTitleUpdate?: (newTitle: string) => void;
  onProjectTitleUpdate?: (projectIndex: number, newTitle: string) => void;
  onOpenDetail?: (index: number) => void;
}

export const AnimatedFolder: React.FC<AnimatedFolderProps> = ({ 
  title, 
  projects, 
  className, 
  gradient, 
  onTitleUpdate, 
  onProjectTitleUpdate,
  onOpenDetail 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection Observer to pause animations when off-screen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const previewProjects = projects.slice(0, 5);

  const handleProjectClick = (project: Project, index: number) => {
    setIsHovered(false);
    if (onOpenDetail) onOpenDetail(index);
  };

  const handleCloseLightbox = () => { 
    setSelectedIndex(null); 
    setSourceRect(null); 
  };
  
  const handleCloseComplete = () => setHiddenCardId(null); 
  
  const handleNavigate = (newIndex: number) => { 
    setSelectedIndex(newIndex); 
    setHiddenCardId(projects[newIndex]?.id || null); 
  };
  
  const handleOpenDetail = (index: number) => {
    setSelectedIndex(null);
    if (onOpenDetail) onOpenDetail(index);
  };

  const backBg = gradient || "linear-gradient(135deg, var(--folder-back) 0%, var(--folder-tab) 100%)";
  const tabBg = gradient || "var(--folder-tab)";
  const frontBg = gradient || "linear-gradient(135deg, var(--folder-front) 0%, var(--folder-back) 100%)";

  // Optimization: If not visible, we can skip some rendering or simplify
  const activeHover = isVisible && isHovered && selectedIndex === null;

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
            "relative flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer bg-card border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group transform-gpu will-change-transform",
            "border-border hover:shadow-2xl hover:border-accent/40",
            className
        )}
        style={{ 
            minWidth: "280px", 
            minHeight: "320px", 
            perspective: "1200px", 
            transform: activeHover ? "scale(1.04) rotate(-1.5deg)" : "scale(1) rotate(0deg)" 
        }}
        onMouseEnter={() => { if (selectedIndex === null) setIsHovered(true); }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex items-center justify-center mb-4 transform-gpu" style={{ height: "160px", width: "200px" }}>
          <div className="absolute w-32 h-24 rounded-lg shadow-md border border-white/10 transform-gpu will-change-transform" style={{ background: backBg, transform: activeHover ? "rotateX(-20deg) scaleY(1.05)" : "rotateX(0deg) scaleY(1)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 10 }} />
          <div className="absolute w-12 h-4 rounded-t-md border-t border-x border-white/10 transform-gpu will-change-transform" style={{ background: tabBg, top: "calc(50% - 48px - 12px)", left: "calc(50% - 64px + 16px)", transform: activeHover ? "rotateX(-30deg) translateY(-3px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 10 }} />
          <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}>
            {previewProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                ref={(el) => { cardRefs.current[index] = el; }} 
                project={project}
                delay={index * 50} 
                isVisible={activeHover} 
                index={index} 
                totalCount={previewProjects.length} 
                onClick={() => handleProjectClick(project, index)} 
                isSelected={hiddenCardId === project.id} 
              />
            ))}
          </div>
          <div className="absolute w-32 h-24 rounded-lg shadow-lg border border-white/20 transform-gpu will-change-transform" style={{ background: frontBg, top: "calc(50% - 48px + 4px)", transformOrigin: "bottom center", transform: activeHover ? "rotateX(35deg) translateY(12px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 30 }} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground mt-4">
              {onTitleUpdate ? <EditableText value={title} onSave={onTitleUpdate} /> : title}
          </h3>
          <p className="text-sm font-medium text-muted-foreground">{projects.length} {projects.length === 1 ? 'projet' : 'projets'}</p>
        </div>
      </div>

    </>
  );
};
