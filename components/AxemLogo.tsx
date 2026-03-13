
import React, { useState } from 'react';

interface AxemLogoProps {
  className?: string;
  src?: string | null;
}

const AxemLogo: React.FC<AxemLogoProps> = ({ className, src }) => {
  const [imageError, setImageError] = useState(false);

  // Nouvelle URL du logo (ajout de ?raw=true pour le lien direct)
  const defaultLogoUrl = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/2f26fe2397aace5c78ce849d72dafbbb7214c34a/Photo/1770837152620-de4f2566-704d-4148-aa50-16ed3e49b1ca-removebg-preview.png";

  const imageSource = src || defaultLogoUrl;

  if (!imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img 
          src={imageSource} 
          alt="AXEM IA" 
          className="h-full w-auto object-contain"
          onError={(e) => {
            console.warn("Impossible de charger le logo depuis :", imageSource);
            setImageError(true);
          }} 
        />
      </div>
    );
  }

  // Fallback SVG si l'image ne charge pas
  return (
    <div className={`flex items-center justify-center select-none ${className}`} title="AXEM IA">
      <span className="font-bold text-xl tracking-tighter text-white">AXEM</span>
    </div>
  );
};

export default AxemLogo;
