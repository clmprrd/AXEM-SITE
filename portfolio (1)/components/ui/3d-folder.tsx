
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
          <img 
            src={project.image || PLACEHOLDER_IMAGE} 
            key={project.image}
            alt={project.title} 
            className="w-full h-full object-contain bg-black"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
          
          {/* Multi-image indicator */}
          {project.gallery && project.gallery.length > 1 && (
             <div className="absolute top-1 right-1 bg-black/50 backdrop-blur-sm rounded-full p-0.5">
                <Layers className="w-3 h-3 text-white" />
             </div>
          )}
          
          <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-black uppercase tracking-tighter text-white truncate drop-shadow-md">
            {project.title}
          </p>
        </div>
      </div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";

interface ImageLightboxProps {
  projects: Project[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
  onOpenDetail: (index: number) => void;
  onUpdateText: (index: number, newTitle: string) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
  onOpenDetail,
  onUpdateText
}) => {
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial");
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalProjects = projects.length;
  const hasNext = internalIndex < totalProjects - 1;
  const hasPrev = internalIndex > 0;
  const currentProject = projects[internalIndex];
  
  const galleryImages = currentProject?.gallery || [currentProject?.image];
  const totalGalleryImages = galleryImages.length;
  const hasGalleryNext = currentGalleryIndex < totalGalleryImages - 1;
  const hasGalleryPrev = currentGalleryIndex > 0;

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      setIsSliding(true);
      const timer = setTimeout(() => {
        setInternalIndex(currentIndex);
        setCurrentGalleryIndex(0);
        setIsSliding(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isOpen, internalIndex, isSliding]);

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex);
      setCurrentGalleryIndex(0);
      setIsSliding(false);
    }
  }, [isOpen, currentIndex]);

  const navigateNext = useCallback(() => {
    if (hasGalleryNext) {
        setCurrentGalleryIndex(prev => prev + 1);
        return;
    }
    if (internalIndex >= totalProjects - 1 || isSliding) return;
    onNavigate(internalIndex + 1);
  }, [internalIndex, totalProjects, isSliding, onNavigate, hasGalleryNext]);

  const navigatePrev = useCallback(() => {
    if (hasGalleryPrev) {
        setCurrentGalleryIndex(prev => prev - 1);
        return;
    }
    if (internalIndex <= 0 || isSliding) return;
    onNavigate(internalIndex - 1);
  }, [internalIndex, isSliding, onNavigate, hasGalleryPrev]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
    setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      setAnimationPhase("initial");
      onCloseComplete?.();
    }, 400);
  }, [onClose, onCloseComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") navigateNext();
      if (e.key === "ArrowLeft") navigatePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose, navigateNext, navigatePrev]);

  useLayoutEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationPhase("initial");
      setIsClosing(false);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase("animating");
        });
      });
      
      const timer = setTimeout(() => {
        setAnimationPhase("complete");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender || !currentProject) return null;

  const getInitialStyles = (): React.CSSProperties => {
    if (sourceRect) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const targetWidth = Math.min(800, viewportWidth - 32);
        const targetHeight = Math.min(viewportHeight * 0.8, 600); 
        
        const targetX = (viewportWidth - targetWidth) / 2;
        const targetY = (viewportHeight - targetHeight) / 2;
        
        const scaleX = sourceRect.width / targetWidth;
        const scaleY = sourceRect.height / targetHeight;
        const scale = Math.max(scaleX, scaleY); 
        
        const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2);
        const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2);

        return {
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          opacity: 0,
        };
    }
    return { transform: `scale(0.8)`, opacity: 0 };
  };

  const getFinalStyles = (): React.CSSProperties => ({
    transform: "translate(0, 0) scale(1)",
    opacity: 1,
  });

  const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles();

  return (
    <div
      className={cn("fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-8 cursor-default")}
      onClick={handleClose}
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-400"
        style={{ opacity: (animationPhase === "initial" || isClosing) ? 0 : 1 }}
      />
      
      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-[410] w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#00FA9A] text-white hover:text-black transition-all duration-300 hover:scale-110"
      >
        <X className="w-6 h-6" strokeWidth={2.5} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
        disabled={!(hasPrev || hasGalleryPrev) || isSliding}
        className="absolute left-2 md:left-8 z-[410] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/50 hover:bg-[#00FA9A] text-white hover:text-black border border-white/10 backdrop-blur-md transition-all duration-300 disabled:opacity-0 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); navigateNext(); }}
        disabled={!(hasNext || hasGalleryNext) || isSliding}
        className="absolute right-2 md:right-8 z-[410] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/50 hover:bg-[#00FA9A] text-white hover:text-black border border-white/10 backdrop-blur-md transition-all duration-300 disabled:opacity-0 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <div
        ref={containerRef}
        className="relative z-[405] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...currentStyles,
          transition: "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease-out",
        }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl">
          <div className="relative overflow-hidden aspect-[16/10] md:aspect-[16/9] bg-black">
            <div
              className="flex w-full h-full transition-transform duration-400 ease-[cubic-bezier(0.19,1,0.22,1)]"
              style={{ transform: `translateX(-${internalIndex * 100}%)` }}
            >
              {projects.map((project, idx) => {
                 const pGallery = project.gallery || [project.image];
                 return (
                  <div key={project.id} className="min-w-full h-full relative">
                    {Math.abs(idx - internalIndex) <= 1 && (
                        <div className="w-full h-full relative">
                            {pGallery.map((imgSrc, gIdx) => (
                               <img
                                  key={gIdx}
                                  src={imgSrc || PLACEHOLDER_IMAGE}
                                  className={cn(
                                      "absolute inset-0 w-full h-full object-contain bg-black transition-opacity duration-400",
                                      (idx === internalIndex && gIdx === currentGalleryIndex) ? "opacity-100" : "opacity-0 pointer-events-none"
                                  )}
                                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                              />
                            ))}
                        </div>
                    )}
                  </div>
              )})}
            </div>
            {galleryImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                  {galleryImages.map((_, dotIdx) => (
                       <div key={dotIdx} className={cn("w-2 h-2 rounded-full transition-all duration-300", dotIdx === currentGalleryIndex ? "bg-[#00FA9A] w-6" : "bg-white/40")} />
                  ))}
              </div>
            )}
          </div>
          
          <div className="p-6 md:p-8 bg-[#0a0a0a] border-t border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                   <EditableText value={currentProject?.title} onSave={(val) => onUpdateText(internalIndex, val)} />
                </h3>
                <p className="text-sm text-[#00FA9A] uppercase tracking-widest font-medium">
                   {currentProject?.category || "Étude de cas"} • {internalIndex + 1}/{totalProjects}
                </p>
              </div>
              <button 
                onClick={() => onOpenDetail(internalIndex)}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#00FA9A] hover:bg-[#00d180] text-black font-bold uppercase tracking-widest text-sm rounded-xl transition-all hover:scale-105"
              >
                <span>Voir le projet complet</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    const cardEl = cardRefs.current[index];
    if (cardEl) setSourceRect(cardEl.getBoundingClientRect());
    setSelectedIndex(index);
    setHiddenCardId(project.id);
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
      <ImageLightbox 
        projects={projects} 
        currentIndex={selectedIndex ?? 0} 
        isOpen={selectedIndex !== null} 
        onClose={handleCloseLightbox} 
        sourceRect={sourceRect} 
        onCloseComplete={handleCloseComplete} 
        onNavigate={handleNavigate} 
        onOpenDetail={handleOpenDetail}
        onUpdateText={(idx, txt) => onProjectTitleUpdate && onProjectTitleUpdate(idx, txt)}
      />
    </>
  );
};
