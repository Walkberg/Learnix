# Projet SaaS : Application de création de fiches de révision et quizz boostée par IA

---

## Étape 1 : Brainstorming du projet

**Objectif :**  
Créer une application permettant aux utilisateurs de générer des fiches de révision et des quizz à partir de cours textuels, avec l’aide de l’IA.

**Fonctionnalités principales :**  
- Génération automatique de résumés de cours  
- Création de quizz et flashcards à partir des résumés  
- Possibilité de réviser et de tester ses connaissances  
- Gestion des utilisateurs et rôles  

---

## Étape 2 : MVP (Minimum Viable Product)

**Fonctionnalités minimales pour la première version :**  
1. Authentification : login / logout  
2. Création de fiches de révision à partir d’un texte de cours  
3. Création de quizz à partir d’un cours  
4. Complétion d’un quizz  
5. Déconnexion  

---

## Étape 3 : Architecture de base

**Gestion des sessions et rôles :**  
- Rôle **Free** : créer jusqu’à 3 cours et 3 quizz  
- Rôle **Premium** : création illimitée de cours et quizz  
- Middleware pour protéger les routes selon les rôles  

**Technologies :**  

### Frontend
- Vite  
- React  
- React Router (routing)  
- Shadcn (UI)  
- Axios (fetching)  
- Architecture feature-based  

### Backend

- NestJS  
- Prisma (base de données)  
- DDD (Domain-Driven Design) + Hexagonal Architecture  
- Architecture feature-based  

### Tests
- Vite test  

---

## Étape 4 : Gestion des features et use cases

### Feature : Auth
- Signin  
- Login  

### Feature : Gestion utilisateur
- Email  
- Pseudo  
- Date de naissance  
- Statut : Collégien / Lycéen / Études supérieures / Professeur / Autre  

### Feature : Course
- Un cours contient :  
  - Titre + emoji  
  - Résumé généré par IA  
- Actions :  
  - Générer / régénérer résumé  
  - Éditer le cours  

### Feature : Quizz
- Relié à un cours (relation n → 1)  
- Plusieurs quizz par cours  
- Contenu :  
  - X questions  
  - Types de questions :  
    - QCM : duo (2 choix), trio (3 choix), carré (4 choix)  
    - Réponse ouverte  
  - Généré automatiquement depuis le résumé du cours  
- Actions : créer, éditer, supprimer  

### Feature : Flashcards
- Reliées à un cours (relation n → 1)  
- Une question / une réponse  
- Actions : créer, éditer, supprimer  

---

## Étape 5 : UX et design du site

### Architecture des pages

#### Page d’accueil
routing :/
- 3 cartes principales :  
  - Générer une fiche  
  - Créer un quizz  
  - Réviser avec Learnix 
- header" Mes cours"(left) +   avec bouton “Ajouter un cours” (right)  Liste des cours sous forme de cards
  La carte est composé de l'icone du cours en haut à gauche un kebab menu qui ouvre un popover permetant de supprimer la fiche
  dans le content le nom du cours et dans le footer la date de création
- header "Mes quizz" (left) +  bouton “Ajouter un quizz” (right)  Liste des quizz sous forme de cards 
  La carte est composé d'une icone genereique (illustration)  en haut à gauche un kebab menu qui ouvre un popover permetant de supprimer la fiche
  dans le content le nom du cours associé en dessous un bar de progression avec la progression sous forme 5/10
  la bar de progression est rouge si inferieur à 30 % vert si superieur à 70 % jaune sinon
  Avec un tag corrspondant Non apris, Acquis et A revoir

#### Page liste de cours
En haut Mes cours + le nombre de cours total dans tag
En header : 
  - Search bar  
  - Bouton “Ajouter un cours”  même design que sur la page d'accueil
En content:
- Liste des cours  même design que sur la page d'acceuil

#### Page récap de cours
routing: /courses/:id
- Deux sous-onglets :  
 - **À gauche :** Fiche / Flashcards 
routing: /courses/:id/summary
  
  routing: /courses/:id/flashcards
  - **À droite :** Entraînement / Résumé des quizz / Liste des quizz  

#### Page liste des quizz
En haut Mes quizz + le nombre de cours total dans tag
- Bouton “Créer un quizz” → dialogue : 
  1. Sélection du cours pour générer le quizz  
  2. Formulaire de création  
  3. Confirmation : “Ton quizz a été généré !”  
     - 2 CTA : “Générer un autre quizz” / “Voir mon quizz”   
- Liste des quizz groupé par cours pour la liste même design que sur la page d'acceuil



#### Page détail de quizz
routing /quizzes/:id/result
- Possibilité de compléter le quizz  
- Si déjà complété : affichage du récapitulatif  
  header:
    Quizz du {dte}
    nom du cours
  en desosus :
  un progression circulaire avec au milieu le score + emoji corepondant au niveau

  2 cta "retour à l'acceuil" "rejouer le quiz"

  Un zone de correction
  header "Correction"

  avec une carte par question
  en header une icon check entouré par un rond vert si question validé + le nom de a question
  en content la liste des propositions avec en vert la bonne reponse en rouge la question repondu si fausse
  une explication avec une fleche + explanation si reponse est fausse
Page quizz attempt
routing /quizzes/:id/attempt

une zonne de progression avec un petit carré gris pour toute les question possible dans le quizz
en dessous "Question x/y"
en dessous le nom de la question
en dessous des caree avec les propositions
Au click sur une des proposition
on passe sur un etat de validation
  en plus des question, 
  un icon check vert entouré d'un rond vert si bonne reponse suivit du texte "Bonne" ou "mauvaise réponse !" la reponse fausse (si elle existe )est rouge la bonne réponse et verte
  un cta qui permet de passer à la question suivante: "Question suivante"

  quand toute les reponse sont coché à la place de questoin suivante on a "Voir mon score 🏆" qui redirige vers la page de result

#### Page de chat

-> un picker sur une des lessons
-> une discussion
-> un chat pour discuter avec l'ia

#### Page de parametre

Plusieurs sous page

##### Compte
Mon compte
Changer de mot de passe

##### Abonnement

passer premium
parainage

##### Autre

condition general
signaler un bug
nous contacter
laisser un avis

se deconnecter
supprimer mon compte