
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
        image: "", 
        title: "L'Automatisation à Distance",
        category: "Formation Scaling",
        content: `
          <h1>Formation : Déploiement IA à l'Échelle</h1>
          <p class="text-xl text-[#00FA9A] mb-8 font-bold">+40% de productivité mesurée sur 200 collaborateurs sans aucun frais logistique.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gouffre Financier</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Des équipes réparties sur tout le territoire perdaient jusqu'à 3 heures par jour sur des tâches administratives à faible valeur ajoutée. Bloquer 200 personnes en présentiel pour une formation représentait un coût inacceptable (déplacements, hôtels, arrêt de production).</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">La Solution AXEM</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2">✓ <span class="flex-1">Déploiement d'un programme 100% asynchrone axé sur les <strong>IA textuelles (Claude, GPT-4)</strong>.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1">Création de <strong>routines automatisées</strong> pour supprimer la saisie manuelle.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1">Pédagogie inversée : validation des acquis par la résolution d'un <strong>vrai problème métier</strong>.</span></li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-[#00FA9A]"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gain Brut</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">ROI Logistique :</strong> <span class="flex-1">Formation de masse avec zéro frais de déplacement.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Temps Sauvé :</strong> <span class="flex-1">Réduction de 40% du temps passé sur les process administratifs.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Autonomie :</strong> <span class="flex-1">Des employés capables de scripter l'IA sans faire appel au pôle IT.</span></li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case1_2", 
        image: "", 
        title: "Le 'Hackathon' IA",
        category: "Bootcamp Intensif",
        content: `
          <h1>Formation : Le "Hackathon" IA en Présentiel</h1>
          <p class="text-xl text-[#00FA9A] mb-8 font-bold">5 projets d'automatisation majeurs créés et déployés en 48 heures chrono.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gouffre Financier</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">La direction investissait lourdement dans des licences IA, mais les équipes restaient paralysées par la théorie. L'absence d'outils concrets créait une "dette d'innovation" face aux concurrents qui, eux, accéléraient.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">La Solution AXEM</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Idéation Commando :</strong> Cartographie express des goulots d'étranglement par département.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Prototypage No-Code :</strong> Formation accélérée pour construire des applications internes viables en quelques heures.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Déploiement Flash :</strong> Validation par la direction pour un passage en production immédiat à l'issue des 48h.</span></li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-[#00FA9A]"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gain Brut</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Time-to-Market :</strong> <span class="flex-1">5 outils opérationnels déployés en 2 jours, un processus qui prend normalement 6 mois.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Économies IT :</strong> <span class="flex-1">Des dizaines de milliers d'euros économisés en développement externe.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Culture :</strong> <span class="flex-1">Transformation totale des équipes : de spectateurs à bâtisseurs d'IA.</span></li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case1_3", 
        image: "", 
        title: "Content Factory Marketing",
        category: "Industrialisation",
        content: `
          <h1>Formation : Content Factory Marketing</h1>
          <p class="text-xl text-[#00FA9A] mb-8 font-bold">Capacité de production x10 et division par 2 du budget agence.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gouffre Financier</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Une dépendance totale aux prestataires externes entraînait des factures marketing mensuelles exorbitantes. Le délai de livraison des campagnes (plusieurs semaines) rendait la marque incapable de réagir vite aux tendances du marché.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">La Solution AXEM</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Méta-Prompting :</strong> Création de workflows capables de générer des lignes éditoriales entières en 1 clic.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Design Génératif :</strong> Formation pour produire des assets graphiques premium en interne, sans logiciel complexe.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Clonage de l'ADN :</strong> Entraînement des modèles sur le ton de voix exact de la marque pour une cohérence parfaite.</span></li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-[#00FA9A]"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gain Brut</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">ROI Budgétaire :</strong> <span class="flex-1">-50% sur les coûts d'agence de communication externes.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Scalabilité :</strong> <span class="flex-1">Production de 30 posts et assets par semaine au lieu de 4, à effectif constant.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Réactivité :</strong> <span class="flex-1">Lancement d'une campagne multicanale de l'idée à la publication en moins de 2 heures.</span></li>
                </ul>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "AUTOMATISATION & SYSTÈMES",
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    projects: [
      { 
        id: "case2_1", 
        image: "", 
        title: "Comptabilité 'Zéro Saisie'",
        category: "ERP & Flux Financiers",
        content: `
          <h1>Déploiement : Comptabilité "Zéro Saisie"</h1>
          <p class="text-xl text-[#00FA9A] mb-8 font-bold">100% des pénalités de retard éliminées et temps de saisie divisé par 5.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gouffre Financier</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Le département comptable était asphyxié par la saisie manuelle des factures fournisseurs. Les erreurs de frappe, les doublons et la lenteur du traitement généraient des milliers d'euros de pénalités de retard chaque trimestre.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">La Solution AXEM</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Extraction OCR Intelligente :</strong> L'IA lit, comprend et extrait les montants et la TVA de n'importe quel PDF reçu par e-mail.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Audit Automatique :</strong> Le système rapproche instantanément la facture du bon de commande initial pour valider la conformité.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Injection ERP :</strong> Les données sont poussées sans intervention humaine dans le logiciel comptable.</span></li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-[#00FA9A]"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gain Brut</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Cash-Flow Sauvé :</strong> <span class="flex-1">Éradication totale des amendes de retard et optimisation de la trésorerie.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Heures Récupérées :</strong> <span class="flex-1">-80% de temps passé sur la saisie de données pures.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Montée en Gamme :</strong> <span class="flex-1">Les comptables redeviennent des analystes financiers stratégiques.</span></li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case2_2", 
        image: "", 
        title: "Synchronisation CRM Invisible",
        category: "Productivité Commerciale",
        content: `
          <h1>Déploiement : Synchronisation CRM Invisible</h1>
          <p class="text-xl text-[#00FA9A] mb-8 font-bold">+15% de temps de vente récupéré par commercial et 100% de data fiable.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gouffre Financier</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Les vendeurs refusaient de remplir le CRM car cela tuait leur temps de prospection. Résultat : la direction pilotait à l'aveugle, l'historique client disparaissait au moindre départ, et les prévisions de ventes étaient fausses.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">La Solution AXEM</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Écoute Passive :</strong> Chaque e-mail entrant/sortant est analysé, classé et rattaché au bon prospect en arrière-plan.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Création de Fiches :</strong> L'IA lit les signatures d'e-mails pour créer et mettre à jour les contacts sans aucune saisie.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Tagging Automatique :</strong> Le système catégorise l'intention de l'échange (Plainte, Devis, Relance) pour trier le pipeline.</span></li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-[#00FA9A]"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gain Brut</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Force de Frappe :</strong> <span class="flex-1">Récupération de 5 heures par semaine par vendeur, réinvesties dans le closing.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Data Quality :</strong> <span class="flex-1">Un CRM toujours à jour, permettant un pilotage financier exact.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Risque Sécurisé :</strong> <span class="flex-1">La mémoire commerciale appartient enfin à l'entreprise, plus aux carnets d'adresses personnels.</span></li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case2_3", 
        image: "", 
        title: "Onboarding RH 100% Automatisé",
        category: "Orchestration & Marque Employeur",
        content: `
          <h1>Déploiement : L'Onboarding RH Automatisé</h1>
          <p class="text-xl text-[#00FA9A] mb-8 font-bold">3 heures d'administratif sauvées par recrutement et zéro friction d'accueil.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gouffre Financier</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Les processus d'intégration manuels s'éternisaient. Les recrues perdaient leur première semaine à réclamer leurs accès informatiques et à signer des papiers, plombant la rentabilité immédiate et dégradant l'image de l'entreprise.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">La Solution AXEM</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Génération Documentaire :</strong> Contrats, DPAE et NDA générés et envoyés pour signature électronique dès l'accord verbal.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Provisioning IT :</strong> Création instantanée des adresses e-mails, accès logiciels (Google Workspace, Slack) et invitations agenda.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Séquençage d'Accueil :</strong> E-mails de pre-boarding programmés automatiquement pour préparer le jour J.</span></li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-[#00FA9A]"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gain Brut</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Rentabilité Initiale :</strong> <span class="flex-1">L'employé est opérationnel à la seconde où il franchit la porte.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Gain de Temps RH :</strong> <span class="flex-1">Suppression totale du goulot d'étranglement administratif des RH et de l'IT.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Rétention :</strong> <span class="flex-1">Une expérience d'intégration premium qui réduit drastiquement le turn-over de la période d'essai.</span></li>
                </ul>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "STRATÉGIE DE REVENUS",
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
    projects: [
      { 
        id: "case3_1", 
        image: "", 
        title: "Enrichissement B2B Instantané",
        category: "Machine à Leads",
        content: `
          <h1>Déploiement : L'Enrichissement B2B Instantané</h1>
          <p class="text-xl text-[#00FA9A] mb-8 font-bold">Doublement de la capacité d'appels et taux de conversion en hausse de 45%.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gouffre Financier</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Les commerciaux brûlaient la moitié de leur journée sur Google et LinkedIn pour trouver le contexte d'une entreprise avant d'appeler un lead entrant. Ces heures de "recherche" coûtaient des dizaines de milliers d'euros en salaire pur.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">La Solution AXEM</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Scraping Chirurgical :</strong> Dès la réception d'un e-mail, l'outil scanne le web pour retrouver le bilan, l'actualité et le profil LinkedIn de la cible.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Synthèse LLM :</strong> L'intelligence artificielle résume le contexte stratégique de l'entreprise en 5 points clés.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Icebreakers Générés :</strong> Rédaction automatique d'accroches ultra-personnalisées pour le vendeur.</span></li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-[#00FA9A]"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gain Brut</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Productivité Vente :</strong> <span class="flex-1">Les vendeurs ont le dossier en 30 secondes et peuvent doubler leur volume d'appels.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Conversion :</strong> <span class="flex-1">Des approches chirurgicales qui explosent le taux de prise de rendez-vous qualifiés.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">ROI Lead :</strong> <span class="flex-1">Rentabilisation maximale des dépenses d'acquisition marketing.</span></li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case3_2", 
        image: "", 
        title: "Relance Commerciale Automatisée",
        category: "Séquençage & Closing",
        content: `
          <h1>Déploiement : Relance Automatisée "Zéro Fuite"</h1>
          <p class="text-xl text-[#00FA9A] mb-8 font-bold">Réactivation de 35% des opportunités "mortes" et sécurisation totale du pipeline.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gouffre Financier</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Le syndrome du "devis envoyé, jamais relancé". Submergés par l'urgence des nouveaux contrats, les commerciaux abandonnaient les deals plus lents, laissant des centaines de milliers d'euros dormir dans la base de données.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">La Solution AXEM</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Surveillance Passive :</strong> Détection algorithmique des prospects n'ayant pas répondu au devis depuis 7, 14 ou 30 jours.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Ghost-Writing IA :</strong> Rédaction automatique de relances contextuelles reprenant le fil exact de la dernière conversation.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Auto-Pilot :</strong> Espacement stratégique des e-mails jusqu'à l'obtention d'un "Oui" ou d'un "Non".</span></li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-[#00FA9A]"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gain Brut</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Chiffre d'Affaires :</strong> <span class="flex-1">Des dizaines de deals ressuscités grâce à la persévérance mécanique de la machine.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Charge Mentale :</strong> <span class="flex-1">Finis les post-its et les rappels, le système orchestre le suivi froid.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Étanchéité :</strong> <span class="flex-1">100% du pipeline de vente est exploité jusqu'au bout, sans aucune déperdition.</span></li>
                </ul>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "AGENTS IA AUTONOMES",
    gradient: "linear-gradient(135deg, #f80759, #bc4e9c)",
    projects: [
      { 
        id: "case4_1", 
        image: "", 
        title: "Agent Support Client 24/7",
        category: "Résolution Instantanée",
        content: `
          <h1>Déploiement : L'Agent de Support Client 24/7</h1>
          <p class="text-xl text-[#00FA9A] mb-8 font-bold">70% de résolution au premier contact sans aucune intervention humaine.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gouffre Financier</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Une équipe support surdimensionnée pour répondre à des questions récurrentes à faible valeur. La lenteur des réponses la nuit et le week-end dégradait violemment le taux de satisfaction client (NPS) et l'image de marque.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">La Solution AXEM</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Knowledge Graph :</strong> Ingestion massive de la FAQ, des historiques de tickets et des bases de données internes.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Action Autonome :</strong> L'Agent ne fait pas que répondre : il peut vérifier le statut d'une commande via API et modifier une adresse.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Escalade Humaine :</strong> Transfert immédiat à un opérateur humain avec résumé du problème en cas de litige complexe.</span></li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-[#00FA9A]"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gain Brut</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Réduction des Coûts :</strong> <span class="flex-1">Traitement de milliers de requêtes simultanées pour un coût marginal proche de zéro.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Satisfaction Client :</strong> <span class="flex-1">Un support Premium qui répond instantanément, 365 jours par an.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Revalorisation :</strong> <span class="flex-1">Les équipes humaines se concentrent enfin sur la rétention des comptes clés (VIP).</span></li>
                </ul>
            </div>
          </div>
        `
      },
      { 
        id: "case4_2", 
        image: "", 
        title: "Le Chasseur de Clients",
        category: "Génération de Revenus",
        content: `
          <h1>Déploiement : L'Agent Prospecteur Autonome</h1>
          <p class="text-xl text-[#00FA9A] mb-8 font-bold">+2,7M€ d'opportunités qualifiées générées en pilotage 100% automatique.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gouffre Financier</h3>
                <p class="text-sm text-neutral-300 leading-relaxed">Les commerciaux coûtaient extrêmement cher à l'entreprise pour réaliser des tâches d'ouvriers : extraire des listes, nettoyer des données, et envoyer des e-mails à froid qui finissaient dans les spams.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-blue-500/50"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">La Solution AXEM</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Ciblage Hyper-Actif :</strong> L'Agent identifie les entreprises présentant des signaux d'achats forts (levées de fonds, recrutements clés).</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Séquences Uniques :</strong> Génération de centaines d'approches ultra-personnalisées indétectables comme provenant d'une machine.</span></li>
                    <li class="flex items-start gap-2">✓ <span class="flex-1"><strong>Négociation d'Agenda :</strong> L'Agent répond aux objections initiales et bloque lui-même le rendez-vous dans l'agenda du commercial.</span></li>
                </ul>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-[#00FA9A]"></div>
                <h3 class="text-white font-bold uppercase tracking-widest text-sm mb-4">Le Gain Brut</h3>
                <ul class="text-sm text-neutral-300 space-y-3 list-none p-0">
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Scale Infini :</strong> <span class="flex-1">Une machine capable de traiter le volume de 5 SDR à temps plein, sans fatigue.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Délivrance :</strong> <span class="flex-1">Les commerciaux humains n'ont plus qu'une mission : se connecter au zoom et closer la vente.</span></li>
                    <li class="flex items-start gap-2"><strong class="text-[#00FA9A]">Explosion du Pipeline :</strong> <span class="flex-1">Une croissance mathématique, prédictible et scalable de l'acquisition B2B.</span></li>
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
