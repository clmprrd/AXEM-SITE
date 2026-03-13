
import React, { useState, useEffect, useRef } from 'react';
import { AnimatedFolder, Project } from './ui/3d-folder';
import { RotateCcw, Download } from 'lucide-react';
import EditableText from './ui/EditableText';

// --- Default Data with Specific Case Studies ---

const caseStudiesData = [
  {
    title: "FORMATION IA",
    gradient: "linear-gradient(135deg, #00c6ff, #0072ff)",
    projects: [
      { 
        id: "case1_1", 
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", 
        title: "L'Automatisation à Distance",
        category: "Formation Screencast",
        content: `
          <h1>Formation : L'Automatisation à Distance</h1>
          <p class="text-xl text-neutral-400 mb-8">Déploiement massif de compétences IA sans contrainte géographique.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Cette entreprise avait des équipes réparties dans toute la France. Ses collaborateurs perdaient un temps fou sur l'administratif, mais il était impossible et trop coûteux de bloquer tout le monde au même endroit pendant des jours pour les former.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Maîtrise des IA Textuelles :</strong> Apprendre à utiliser Claude et ChatGPT pour déléguer la rédaction d'e-mails et les synthèses de documents.</li>
                    <li><strong class="text-white">Création de Routines :</strong> Utilisation d'outils comme Google Antigravity pour automatiser les tâches répétitives sur le navigateur.</li>
                    <li><strong class="text-white">Pédagogie Inversée :</strong> Des exercices pratiques où chaque collaborateur devait résoudre un vrai problème de son quotidien avec l'IA.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Déploiement :</strong> Plus de 200 collaborateurs formés en un mois avec zéro frais de déplacement pour la direction.</li>
                    <li><strong class="text-white">Productivité :</strong> Un gain de temps mesuré de 40% sur les tâches administratives et répétitives.</li>
                    <li><strong class="text-white">Autonomie :</strong> Des équipes capables de créer leurs propres "prompts" sans faire appel à l'IT.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case1_2", 
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", 
        title: "Le 'Hackathon' IA en Présentiel",
        category: "Formation Immersive",
        content: `
          <h1>Formation : Le "Hackathon" IA en Présentiel</h1>
          <p class="text-xl text-neutral-400 mb-8">Passer de la théorie à la pratique en 48h chrono.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">La direction de cette entreprise voulait intégrer l'intelligence artificielle, mais les équipes restaient bloquées sur la théorie. Ils n'arrivaient pas à passer à l'action pour créer des outils vraiment utiles pour leurs services.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Idéation Encadrée :</strong> Les équipes (Marketing, RH, Ventes) ont été accompagnées pour cartographier leurs pires processus manuels.</li>
                    <li><strong class="text-white">Prototypage Rapide :</strong> Formation flash pour apprendre à construire de vrais outils IA "No-Code" (sans savoir programmer) pour résoudre ces problèmes.</li>
                    <li><strong class="text-white">Pitch & Validation :</strong> Chaque groupe a présenté son outil fonctionnel à la direction pour un passage en production immédiat.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Engagement :</strong> Une adoption totale et enthousiaste. L'IA a été complètement démystifiée.</li>
                    <li><strong class="text-white">ROI Immédiat :</strong> 5 projets d'automatisation concrets créés par les employés et déployés le jour même.</li>
                    <li><strong class="text-white">Transformation :</strong> Un changement de culture, passant de consommateurs passifs à créateurs de solutions.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case1_3", 
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800", 
        title: "La 'Machine à Vues' Instagram",
        category: "Formation Action",
        content: `
          <h1>Formation : La "Machine à Vues" Instagram</h1>
          <p class="text-xl text-neutral-400 mb-8">Hacker l'algorithme avec l'IA pour relancer la croissance.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">L'équipe de ce fast-food faisait tout à la main et "au feeling". Leurs vidéos Instagram stagnaient à 40 likes par manque de temps, de méthodes (pas d'accroches, vidéos muettes) et parce qu'ils publiaient dans l'urgence en plein "coup de feu".</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Ingénierie de Viralité :</strong> Apprendre à utiliser ChatGPT pour générer des accroches (Hooks) clivantes et scripter des "trends" audio en moins de 5 minutes.</li>
                    <li><strong class="text-white">Systématisation visuelle :</strong> Création de modèles générés par l'IA pour standardiser les textes à l'écran et identifier les moments "Food Porn" de leur cuisine.</li>
                    <li><strong class="text-white">Automatisation du calendrier :</strong> Formation à la programmation centralisée pour planifier toute la semaine de contenu en 15 minutes le lundi matin.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Engagement :</strong> Des vidéos optimisées pour retenir l'attention dès les 3 premières secondes, relançant la croissance du compte.</li>
                    <li><strong class="text-white">Sérénité :</strong> Fin du stress de la publication de dernière minute. L'équipe ne touche plus à son téléphone pendant le service.</li>
                    <li><strong class="text-white">Productivité :</strong> Une "brigade" autonome capable de transformer une idée ou un son viral en une vidéo prête à publier en moins de 10 minutes.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case1_4", 
        image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=800", 
        title: "Content Factory Marketing",
        category: "Formation à l'Industrialisation",
        content: `
          <h1>Formation : Content Factory Marketing</h1>
          <p class="text-xl text-neutral-400 mb-8">Internaliser la production pour gagner en vitesse et en coûts.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">La dépendance aux agences externes et la lenteur de création limitent souvent l'impact des équipes marketing. L'objectif était de transformer ce service en une "usine à contenus" ultra-rapide et autonome.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Maîtrise des Workflows IA :</strong> Apprendre à utiliser des "méta-prompts" pour générer une ligne éditoriale complète et 20 posts LinkedIn en un clic.</li>
                    <li><strong class="text-white">Design Génératif :</strong> Formation à la création de visuels et d'assets graphiques professionnels avec l'IA, sans compétences en graphisme.</li>
                    <li><strong class="text-white">Standardisation du Ton de Voix :</strong> Apprendre à "éduquer" l'IA sur l'ADN de la marque pour garantir une cohérence parfaite sur chaque publication.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Productivité :</strong> Une capacité de production de contenus multipliée par 10 à effectif constant.</li>
                    <li><strong class="text-white">Indépendance :</strong> Suppression totale des délais et division par deux du budget alloué aux prestataires externes.</li>
                    <li><strong class="text-white">Agilité :</strong> L'équipe est désormais capable de transformer une idée en une campagne multicanale publiée en moins d'une heure.</li>
                </ul>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "CONNEXION & AUTOMATISATION",
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    projects: [
      { 
        id: "case2_1", 
        image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=800", 
        title: "La Comptabilité 'Zéro Saisie'",
        category: "Intégration Intelligente",
        content: `
          <h1>Déploiement : La Comptabilité "Zéro Saisie"</h1>
          <p class="text-xl text-neutral-400 mb-8">Automatisation du traitement des factures fournisseurs.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Le service comptable perdait un temps précieux à retaper manuellement chaque facture fournisseur reçue en PDF. C'était un processus lent, frustrant, et qui générait des erreurs de paiement ou des pénalités de retard.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Extraction IA :</strong> Le système "lit" automatiquement les factures reçues par mail et comprend les montants et la TVA, quel que soit le format du PDF.</li>
                    <li><strong class="text-white">Rapprochement Automatique :</strong> L'outil vérifie tout seul que la facture correspond bien au bon de commande initial.</li>
                    <li><strong class="text-white">Injection Directe :</strong> Les données sont poussées automatiquement dans le logiciel comptable de l'entreprise (ERP) pour validation finale.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Gain de Temps :</strong> Le temps consacré à la saisie des factures a été divisé par 5.</li>
                    <li><strong class="text-white">Fiabilité :</strong> Les erreurs de frappe, les doublons et les pénalités de retard ont totalement disparu.</li>
                    <li><strong class="text-white">Valeur Ajoutée :</strong> Les comptables se concentrent désormais sur l'analyse financière plutôt que sur la saisie de données.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case2_2", 
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800", 
        title: "La Synchronisation Commerciale Invisible",
        category: "Automatisation Transparente",
        content: `
          <h1>Déploiement : La Synchronisation Commerciale Invisible</h1>
          <p class="text-xl text-neutral-400 mb-8">Fiabilisation des données CRM sans effort humain.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Les commerciaux détestaient remplir le logiciel de suivi (CRM). Résultat : la base de données était vide, les historiques d'échanges se perdaient, et la direction naviguait totalement à l'aveugle.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Capture Automatique :</strong> Chaque e-mail envoyé ou reçu d'un prospect est copié et classé au bon endroit dans le CRM de manière invisible.</li>
                    <li><strong class="text-white">Création de Fiches :</strong> Le système détecte les nouveaux contacts et crée leur profil automatiquement en lisant leur signature d'e-mail (téléphone, poste).</li>
                    <li><strong class="text-white">Catégorisation IA :</strong> L'IA détecte si l'e-mail est une plainte, une demande de devis ou un simple suivi.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Visibilité :</strong> La direction a enfin une vue claire, précise et en temps réel sur l'activité commerciale.</li>
                    <li><strong class="text-white">Temps Commercial :</strong> Chaque vendeur a récupéré plusieurs heures par semaine puisqu'il n'y a plus aucune saisie manuelle.</li>
                    <li><strong class="text-white">Adoption :</strong> 100% d'utilisation du CRM par les équipes, car le système travaille à leur place.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case2_3", 
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", 
        title: "Le Pont 'E-commerce & Vieux Logiciels'",
        category: "Passerelle Sur-Mesure",
        content: `
          <h1>Déploiement : Le Pont "E-commerce & Vieux Logiciels"</h1>
          <p class="text-xl text-neutral-400 mb-8">Unification des stocks entre le web et l'entrepôt.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Leur site e-commerce flambant neuf et leur vieux logiciel de gestion de stock des années 2000 ne communiquaient pas. Les clients achetaient sur internet des produits qui étaient en fait en rupture de stock dans l'entrepôt.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Synchronisation Temps Réel :</strong> Le système interroge l'ancien logiciel toutes les minutes et met à jour les stocks sur le site internet.</li>
                    <li><strong class="text-white">Gestion des Alertes :</strong> Des notifications automatiques sont envoyées à l'entrepôt dès qu'un produit web passe sous un seuil critique.</li>
                    <li><strong class="text-white">Sécurisation des Flux :</strong> Un mécanisme qui garantit qu'aucune commande internet ne se perd, même en cas de panne de l'ancien logiciel.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Expérience Client :</strong> Fin des frustrations liées aux annulations de commandes pour rupture de stock.</li>
                    <li><strong class="text-white">Économie :</strong> L'entreprise a évité un projet de migration de logiciel extrêmement coûteux et risqué.</li>
                    <li><strong class="text-white">Tranquillité :</strong> Les équipes logistiques et e-commerce travaillent enfin avec les mêmes informations à la seconde près.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case2_4", 
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800", 
        title: "L'Onboarding RH 100% Automatisé",
        category: "Orchestration RH",
        content: `
          <h1>Déploiement : L'Onboarding RH 100% Automatisé</h1>
          <p class="text-xl text-neutral-400 mb-8">Accueillir chaque talent avec fluidité et professionnalisme, sans effort administratif.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">L'intégration d'un nouveau salarié prenait des heures aux RH (création de comptes, rédaction de contrats, envoi de mails). C'était chronophage et les nouveaux arrivants manquaient souvent d'informations le jour J.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Génération Documentaire :</strong> Dès qu'un candidat est validé, le contrat de travail est généré, pré-rempli et envoyé pour signature électronique.</li>
                    <li><strong class="text-white">Provisioning IT :</strong> Création automatique de l'adresse e-mail, des accès aux logiciels et ajout aux bons canaux de communication.</li>
                    <li><strong class="text-white">Séquence d'Accueil :</strong> Envoi programmé de livrets d'accueil et d'e-mails de bienvenue la semaine précédant l'arrivée.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Gain de Temps :</strong> 3 heures de tâches administratives économisées par nouvelle recrue.</li>
                    <li><strong class="text-white">Expérience Employé :</strong> Un accueil fluide et professionnel qui valorise la marque employeur dès le premier jour.</li>
                    <li><strong class="text-white">Zéro Oubli :</strong> 100% des accès et matériels sont prêts à la seconde où l'employé commence son contrat.</li>
                </ul>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "STRATÉGIE COMMERCIALE",
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
    projects: [
      { 
        id: "case3_1", 
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", 
        title: "Les Fiches Prospects 100% Automatiques",
        category: "Enrichissement IA",
        content: `
          <h1>Déploiement : Les Fiches Prospects 100% Automatiques</h1>
          <p class="text-xl text-neutral-400 mb-8">Qualification instantanée pour des appels plus pertinents.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Quand un prospect entrant remplissait un formulaire web, il ne laissait que son prénom et son e-mail. Les commerciaux perdaient 15 minutes par personne à enquêter sur LinkedIn et Google avant de l'appeler.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Scraping Ciblé :</strong> Dès qu'un e-mail arrive, l'outil fouille le web de manière automatisée pour trouver la société et le profil LinkedIn de la personne.</li>
                    <li><strong class="text-white">Synthèse de Profil :</strong> L'IA analyse le parcours du prospect, la taille de son entreprise et les dernières actualités de sa société.</li>
                    <li><strong class="text-white">Préparation d'Appel :</strong> L'outil rédige un résumé d'une page avec des suggestions de phrases d'accroche personnalisées pour le vendeur.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Réactivité :</strong> Les commerciaux ont un dossier complet sous les yeux en 30 secondes au lieu de 15 minutes.</li>
                    <li><strong class="text-white">Volume d'Appels :</strong> L'équipe de vente a pu doubler sa capacité d'appels quotidiens.</li>
                    <li><strong class="text-white">Pertinence :</strong> Des appels beaucoup plus chaleureux et précis, augmentant drastiquement le taux de prise de rendez-vous.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case3_2", 
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800", 
        title: "La Relance Commerciale 'Zéro Oubli'",
        category: "Séquençage Intelligent",
        content: `
          <h1>Déploiement : La Relance Commerciale "Zéro Oubli"</h1>
          <p class="text-xl text-neutral-400 mb-8">Maximisation du taux de conversion par l'automatisation du suivi.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">L'entreprise perdait des dizaines de milliers d'euros d'opportunités simplement parce que les commerciaux, débordés par l'urgence, oubliaient de relancer les prospects qui ne répondaient pas au premier devis.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Détection d'Inactivité :</strong> Le système scanne la boîte mail et repère les prospects qui n'ont pas donné signe de vie depuis X jours.</li>
                    <li><strong class="text-white">Rédaction Ultra-Personnalisée :</strong> L'IA rédige des e-mails de relance très naturels, reprenant le contexte exact du dernier échange (sans faire "robot").</li>
                    <li><strong class="text-white">Espacement Stratégique :</strong> Le système envoie ces relances de manière espacée jusqu'à obtenir une réponse (positive ou négative).</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Taux de Réponse :</strong> Un bond de 35% du taux de réponse sur les prospects considérés comme "perdus".</li>
                    <li><strong class="text-white">Pipeline Sécurisé :</strong> Plus aucune proposition commerciale qualifiée n'est abandonnée en cours de route.</li>
                    <li><strong class="text-white">Charge Mentale :</strong> Les vendeurs ne se posent plus la question "Qui dois-je relancer aujourd'hui ?", le système gère tout le suivi froid.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case3_3", 
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", 
        title: "La 'Boule de Cristal'",
        category: "Analyse Prédictive",
        content: `
          <h1>Déploiement : La "Boule de Cristal"</h1>
          <p class="text-xl text-neutral-400 mb-8">Concentrer l'énergie humaine sur les prospects prêts à signer.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">L'équipe de vente s'épuisait à appeler des centaines de contacts "froids" qui n'étaient pas prêts à acheter, pendant que les meilleurs prospects partaient chez les concurrents faute d'avoir été rappelés assez vite.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Tracking Comportemental :</strong> L'outil analyse combien de fois le prospect ouvre l'e-mail, clique sur le site web ou lit la plaquette commerciale.</li>
                    <li><strong class="text-white">Attribution de Note :</strong> L'IA attribue une "Note de Chaleur" de 0 à 100 à chaque contact en fonction de son engagement.</li>
                    <li><strong class="text-white">Routage Prioritaire :</strong> Le système alerte le commercial en temps réel avec un message : "Ce prospect lit votre devis en ce moment, appelez-le tout de suite".</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Conversion :</strong> Le taux de transformation des appels a été multiplié par 3.</li>
                    <li><strong class="text-white">Chiffre d'Affaires :</strong> Un bond de 17% des ventes générées, sans avoir eu besoin d'acheter un seul lead supplémentaire.</li>
                    <li><strong class="text-white">Efficacité :</strong> 100% de l'énergie humaine est désormais concentrée sur les clients prêts à signer.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case3_4", 
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800", 
        title: "Le Détecteur de Signaux d'Affaires",
        category: "Veille Augmentée",
        content: `
          <h1>Déploiement : Le Détecteur de Signaux d'Affaires</h1>
          <p class="text-xl text-neutral-400 mb-8">Une surveillance de marché intelligente pour saisir chaque opportunité.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Les commerciaux passaient à côté de belles opportunités car ils ne pouvaient pas surveiller en permanence l'actualité de leurs milliers de comptes cibles (levées de fonds, recrutements, déménagements).</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Tracking Ciblé :</strong> L'IA scanne quotidiennement les sites carrières et la presse économique pour détecter des mots-clés spécifiques au secteur.</li>
                    <li><strong class="text-white">Analyse de Pertinence :</strong> L'outil filtre le bruit et ne conserve que les actualités qui constituent un vrai motif d'achat (un "signal d'affaire").</li>
                    <li><strong class="text-white">Alerte Actionnable :</strong> Le commercial reçoit une notification sur Slack avec un brouillon d'e-mail d'approche tout prêt, basé sur l'actualité détectée.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Timing Parfait :</strong> Les vendeurs contactent les prospects exactement au moment où ils ont un besoin avéré (ex: recrutement d'un nouveau directeur).</li>
                    <li><strong class="text-white">Personnalisation :</strong> Des taux d'ouverture d'e-mails record grâce à des accroches ultra-contextualisées.</li>
                    <li><strong class="text-white">Avantage Concurrentiel :</strong> L'entreprise arrive systématiquement avant ses concurrents sur les nouveaux projets.</li>
                </ul>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "AGENTS IA",
    gradient: "linear-gradient(135deg, #f80759, #bc4e9c)",
    projects: [
      { 
        id: "case4_1", 
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800", 
        title: "Le Service Client qui ne dort jamais",
        category: "Agent Conversationnel",
        content: `
          <h1>Déploiement : Le Service Client qui ne dort jamais</h1>
          <p class="text-xl text-neutral-400 mb-8">Support client 24/7 pour soulager les équipes humaines.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Le SAV de cette entreprise était inondé par les mêmes questions basiques ("Où est mon colis ?", "Quels sont vos tarifs ?"). L'équipe frôlait le burn-out, et les clients s'impatientaient le soir et le week-end.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Ingestion des Connaissances :</strong> Nous avons "nourri" l'IA avec toutes les conditions générales, les historiques de tickets et la FAQ de l'entreprise.</li>
                    <li><strong class="text-white">Dialogue Naturel :</strong> L'Agent a été déployé sur le site web pour converser de manière humaine, comprendre les nuances et trouver le numéro de suivi d'un client.</li>
                    <li><strong class="text-white">Escalade Intelligente :</strong> Si la demande est trop complexe ou que le client est mécontent, l'IA transfère immédiatement la conversation à un humain avec un résumé du problème.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Résolution :</strong> 70% des demandes entrantes sont traitées et résolues instantanément sans aucune intervention humaine.</li>
                    <li><strong class="text-white">Disponibilité :</strong> Un service client de haute qualité ouvert 24h/24 et 7j/7.</li>
                    <li><strong class="text-white">Qualité de Vie :</strong> L'équipe support ne gère plus les tâches ingrates et se concentre sur la fidélisation et les cas complexes.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case4_2", 
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", 
        title: "L'Assistant de Réunion Infaillible",
        category: "Agent de Synthèse",
        content: `
          <h1>Déploiement : L'Assistant de Réunion Infaillible</h1>
          <p class="text-xl text-neutral-400 mb-8">Automatisation des comptes-rendus et du suivi de projets.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">La direction passait ses journées en visioconférence. Résultat : personne ne prenait de notes, les comptes-rendus arrivaient 3 jours plus tard, et les actions décidées à l'oral étaient souvent oubliées.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Transcription Intégrale :</strong> L'outil écoute et retranscrit avec précision tout ce qui se dit, en différenciant la voix de chaque participant.</li>
                    <li><strong class="text-white">Structuration Intelligente :</strong> L'IA transforme 1 heure de conversation chaotique en un compte-rendu clair (Décisions prises, Points de blocage).</li>
                    <li><strong class="text-white">Extraction d'Actions :</strong> Le système isole automatiquement les tâches et envoie un e-mail avec la liste exacte de "Qui doit faire quoi et pour quand".</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Gain de Temps :</strong> 30 minutes récupérées à l'issue de chaque réunion (fin de la rédaction manuelle).</li>
                    <li><strong class="text-white">Fiabilité :</strong> 100% de suivi sur les projets, plus aucune action ne passe à la trappe.</li>
                    <li><strong class="text-white">Focus :</strong> Les participants écoutent et débattent vraiment, puisqu'ils n'ont plus le nez collé à leur clavier pour prendre des notes.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case4_3", 
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", 
        title: "Le Chasseur de Clients Autonome",
        category: "Agent Prospecteur",
        content: `
          <h1>Déploiement : Le Chasseur de Clients Autonome</h1>
          <p class="text-xl text-neutral-400 mb-8">Prospection automatisée de bout en bout pour remplir l'agenda.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">L'entreprise peinait à trouver de nouveaux clients car la prospection à froid (chercher les bonnes cibles, écrire des e-mails, relancer) était trop chronophage, pénible pour les vendeurs, et coûtait trop cher.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Ciblage Hyper-Précis :</strong> L'Agent fouille quotidiennement le web et LinkedIn pour trouver des entreprises qui correspondent exactement au client idéal.</li>
                    <li><strong class="text-white">Hyper-Personnalisation :</strong> L'IA rédige des e-mails uniques pour chaque prospect en rebondissant sur l'actualité de son entreprise pour briser la glace.</li>
                    <li><strong class="text-white">Gestion de l'Agenda :</strong> L'Agent traite les réponses aux e-mails, gère les objections courantes, et cale directement un rendez-vous dans l'agenda des vendeurs humains.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Volume :</strong> L'Agent traite des milliers de prospects par mois, une cadence impossible pour un humain sans faire de burn-out.</li>
                    <li><strong class="text-white">Nouveau Rôle :</strong> Les commerciaux humains ne font plus aucune prospection à froid ; ils se contentent de faire les rendez-vous en visio et de signer les contrats.</li>
                    <li><strong class="text-white">Chiffre d'Affaires :</strong> Cette IA a généré à elle seule 2,7 millions d'euros d'opportunités commerciales qualifiées sur l'année.</li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case4_4", 
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", 
        title: "Le 'Copilote' Interne Support RH/IT",
        category: "Agent de Support Interne",
        content: `
          <h1>Déploiement : Le "Copilote" Interne Support RH/IT</h1>
          <p class="text-xl text-neutral-400 mb-8">Un assistant personnel pour chaque employé, disponible instantanément.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Le défi</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Les responsables RH et IT perdaient 30% de leur journée à répondre aux mêmes questions internes des employés sur Slack ("Comment poser des congés ?", "Où est le wifi ?", "Où trouver la mutuelle ?").</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">Notre approche</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Base de Connaissance Centralisée :</strong> L'IA a assimilé l'intégralité du règlement intérieur, des process IT et des conventions collectives.</li>
                    <li><strong class="text-white">Réponse Instantanée :</strong> L'employé pose sa question en langage naturel sur Slack/Teams, l'Agent lui donne la réponse exacte avec le lien vers le document source.</li>
                    <li><strong class="text-white">Exécution de Tâches :</strong> L'Agent peut effectuer des actions simples, comme ouvrir un ticket informatique ou générer une attestation sur demande.</li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-4">L'impact</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-disc pl-4">
                    <li><strong class="text-white">Désengorgement :</strong> Les requêtes répétitives adressées aux services supports ont chuté de 80%.</li>
                    <li><strong class="text-white">Instantanéité :</strong> Les salariés obtiennent leurs réponses en 2 secondes, même à 23h ou le week-end.</li>
                    <li><strong class="text-white">Focus :</strong> Les équipes RH et IT peuvent enfin se concentrer sur des projets structurants à forte valeur ajoutée.</li>
                </ul>
            </div>
          </div>
        `
      }
    ] as Project[]
  }
];

interface FolderShowcaseProps {
  onOpenProject?: (id: number | string, data: Project, saveCallback: (id: number | string, data: Project) => void) => void;
}

const FolderShowcase: React.FC<FolderShowcaseProps> = ({ onOpenProject }) => {
  // State for data
  const [data, setData] = useState(caseStudiesData);
  const [hasCustomData, setHasCustomData] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedCases = localStorage.getItem('axem_cases_data');
      if (storedCases) {
        setData(JSON.parse(storedCases));
        setHasCustomData(true);
      }
    } catch (e) {
      console.error("Failed to load data from storage", e);
    }
  }, []);

  const saveData = (newData: any) => {
    setData(newData);
    localStorage.setItem('axem_cases_data', JSON.stringify(newData));
    setHasCustomData(true);
  };

  const updateFolderContents = (folderIndex: number, newImages: string[]) => {
    const newData = [...data];
    const targetFolder = { ...newData[folderIndex] };
    const targetProjects = [...targetFolder.projects];

    if (targetProjects.length > 0) {
        targetProjects[0] = {
            ...targetProjects[0],
            image: newImages[0],
            gallery: newImages
        };
    } else {
         targetProjects.push({
            id: `case-${folderIndex}-new`,
            title: "Nouveau Cas",
            image: newImages[0],
            gallery: newImages
         });
    }

    targetFolder.projects = targetProjects;
    newData[folderIndex] = targetFolder;
    saveData(newData);
  };

  const handleTitleUpdate = (folderIndex: number, newTitle: string) => {
    const newData = [...data];
    newData[folderIndex] = { ...newData[folderIndex], title: newTitle };
    saveData(newData);
  };

  const handleOpenDetail = (folderIndex: number, projectIndex: number) => {
    const project = data[folderIndex].projects[projectIndex];
    
    if (onOpenProject) {
        onOpenProject(project.id, project, (id, newDataFromDetail) => {
            const currentData = [...data];
            const projects = [...currentData[folderIndex].projects];
            projects[projectIndex] = { ...projects[projectIndex], ...newDataFromDetail };
            currentData[folderIndex] = { ...currentData[folderIndex], projects };
            saveData(currentData);
        });
    }
  };

  const handleReset = () => {
    if (window.confirm("Voulez-vous réinitialiser les études de cas ?")) {
        localStorage.removeItem('axem_cases_data');
        setData(caseStudiesData);
        setHasCustomData(false);
    }
  };

  return (
    <section 
        id="realisations" 
        className="bg-background relative z-20 py-32 border-t border-white/5 overflow-hidden"
        ref={containerRef}
    >
      {/* Background Gradient Static - No Mouse Tracking */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 bg-[#00FA9A]/5 opacity-30"
        style={{
            background: `radial-gradient(circle at 50% 50%, rgba(0, 250, 154, 0.03), transparent 70%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-6 text-center mb-24 relative z-10">
        <span className="inline-block px-3 py-1 mb-6 text-[10px] tracking-widest text-primary border border-primary/20 rounded-full bg-primary/5 uppercase">
            <EditableText value="Réalisations" storageKey="showcase_badge" />
        </span>
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground mb-6">
          <EditableText value="Nos" storageKey="showcase_title_1" /> <span className="font-playfair italic text-neutral-400"><EditableText value="Études de Cas" storageKey="showcase_title_2" /></span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
          <EditableText value="Découvrez comment nous avons transformé les processus de nos clients." storageKey="showcase_desc" />
          <br/><span className="text-xs text-neutral-600"><EditableText value="Cliquez sur un dossier pour voir les détails." storageKey="showcase_hint" /></span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-24 md:gap-40">
            {data.map((folder, folderIdx) => (
            <div key={`case-${folderIdx}`} className="w-full md:w-[calc(50%-80px)] lg:w-[calc(25%-120px)] flex justify-center">
                <AnimatedFolder 
                    title={folder.title} 
                    projects={folder.projects} 
                    gradient={folder.gradient}
                    className="w-full max-w-[300px]"
                    onFolderUpdate={(imgs) => updateFolderContents(folderIdx, imgs)}
                    onTitleUpdate={(t) => handleTitleUpdate(folderIdx, t)}
                    onOpenDetail={(pIdx) => handleOpenDetail(folderIdx, pIdx)}
                />
            </div>
            ))}
        </div>

        <div id="catalogue" className="mt-32 max-w-5xl mx-auto relative z-20 px-6">
            <div className="text-center mb-12">
                <h3 className="text-2xl font-medium mb-4">Catalogue Complet des Formations</h3>
                <p className="text-neutral-400">Consultez notre catalogue interactif pour découvrir le détail de nos 12 formations.</p>
            </div>
            
            <div 
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00FA9A]/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
                
                <div className="relative w-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] h-[120px] md:h-[140px] group-hover:h-[600px] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl transform-gpu">
                    
                    {/* Cover State (Visible when not hovered) */}
                    <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12 transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-8">
                        {/* Background accents */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00FA9A]/5 to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-[#00FA9A]/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-xl md:text-3xl font-medium text-white mb-2">Catalogue Formations IA</h3>
                            <p className="text-[#00FA9A] font-mono text-xs md:text-sm tracking-widest uppercase">Édition 2025/2026</p>
                        </div>
                        <div className="relative z-10 flex items-center gap-4">
                            <span className="hidden md:inline-block text-sm text-neutral-400 font-medium">Survolez pour explorer</span>
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                <Download className="w-5 h-5 text-[#00FA9A]" />
                            </div>
                        </div>
                    </div>

                    {/* PDF Viewer State (Visible on hover) */}
                    <div className="absolute inset-0 opacity-0 translate-y-12 transition-all duration-700 delay-100 group-hover:opacity-100 group-hover:translate-y-0 flex flex-col pointer-events-none group-hover:pointer-events-auto">
                        {/* Viewer Header/Toolbar */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050505] shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                <span className="hidden md:inline-block ml-4 text-xs font-mono text-neutral-500 uppercase tracking-widest">Axem_IA_Catalogue_2025.pdf</span>
                            </div>
                            <a 
                                href="https://github.com/AlexisZtn/Axem-IA/raw/b9c2e7deafb343bda455228e14a45556301829af/Photo/Catalogue%20FORMATIONS%20AXEM%20IA%202025-2026%20(1).pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#00FA9A]/10 text-[#00FA9A] hover:bg-[#00FA9A]/20 rounded-full transition-all"
                            >
                                <Download className="w-3 h-3" />
                                Télécharger le PDF
                            </a>
                        </div>
                        
                        {/* PDF Container */}
                        <div className="w-full flex-1 bg-neutral-900 flex items-center justify-center overflow-hidden relative">
                            {/* Loading state behind iframe */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-[#00FA9A]/20 border-t-[#00FA9A] rounded-full animate-spin"></div>
                            </div>
                            {isHovered && (
                                <iframe 
                                    src={`https://docs.google.com/viewer?url=https://github.com/AlexisZtn/Axem-IA/raw/b9c2e7deafb343bda455228e14a45556301829af/Photo/Catalogue%20FORMATIONS%20AXEM%20IA%202025-2026%20(1).pdf&embedded=true`}
                                    className="w-full h-full border-none relative z-10"
                                    title="Catalogue Formations IA"
                                    loading="lazy"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {hasCustomData && (
            <div className="flex justify-center pt-16">
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-500 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Réinitialiser les cas
                </button>
            </div>
        )}
      </div>
    </section>
  );
};

export default FolderShowcase;
