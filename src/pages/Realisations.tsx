import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import FolderShowcase from '../../components/FolderShowcase';
import Footer from '../../components/Footer';
import ProjectDetailPage from '../../components/ProjectDetailPage';

interface RealisationsProps {
  customLogo: string | null;
  onUpdateLogo: (newLogoBase64: string) => void;
}

const Realisations: React.FC<RealisationsProps> = ({ customLogo, onUpdateLogo }) => {
  const [activeProject, setActiveProject] = useState<{
    id: string | number;
    data: any;
    saveCallback: (id: string | number, data: any) => void;
  } | null>(null);
  const [pageKey, setPageKey] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleOpenProject = (
    id: string | number,
    data: any,
    saveCallback: (id: string | number, data: any) => void
  ) => {
    setActiveProject({ id, data, saveCallback });
  };

  const handleCloseProject = () => {
    setActiveProject(null);
    setPageKey((prev) => prev + 1);
  };

  const handleSaveProject = (id: string | number, newData: any) => {
    if (activeProject && activeProject.saveCallback) {
      activeProject.saveCallback(id, newData);
      setActiveProject((prev) => (prev ? { ...prev, data: newData } : null));
    }
  };

  if (activeProject) {
    return (
      <ProjectDetailPage
        projectId={activeProject.id}
        initialData={activeProject.data}
        onClose={handleCloseProject}
        onSave={handleSaveProject}
      />
    );
  }

  return (
    <div key={pageKey}>
      <Navbar customLogo={customLogo} onUpdateLogo={onUpdateLogo} />
      <main className="pt-32">
        {/* Mini-hero */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-8">
          <span className="inline-block px-3 py-1 mb-6 text-[10px] tracking-widest text-[#00FA9A] border border-[#00FA9A]/20 rounded-full bg-[#00FA9A]/5 uppercase">
            Portfolio
          </span>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white leading-[1.05] mb-6">
            Nos <span className="font-playfair italic">réalisations</span>.
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed">
            Livrables production. Cliquez sur un dossier pour voir le détail d'un projet.
          </p>
        </section>

        <FolderShowcase onOpenProject={handleOpenProject} />
      </main>
      <Footer customLogo={customLogo} />
    </div>
  );
};

export default Realisations;
