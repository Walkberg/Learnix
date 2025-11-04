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
- 3 cartes principales :  
  - Créer un cours  
  - Créer un quizz  
  - Réviser avec l’IA  
- Liste des cours sous forme de cards avec bouton “Ajouter un cours”  
- Liste des quizz sous forme de cards avec bouton “Ajouter un quizz”  

#### Page liste de cours
- Search bar  
- Bouton “Ajouter un cours”  
- Liste des cours  

#### Page récap de cours
- Deux sous-onglets :  
  - **À gauche :** Fiche / Flashcards  
  - **À droite :** Entraînement / Résumé des quizz / Liste des quizz  

#### Page liste des quizz
- Liste des quizz  
- Bouton “Créer un quizz” → dialogue :  
  1. Sélection du cours pour générer le quizz  
  2. Formulaire de création  
  3. Confirmation : “Ton quizz a été généré !”  
     - 2 CTA : “Générer un autre quizz” / “Voir mon quizz”  

#### Page détail de quizz
- Possibilité de compléter le quizz  
- Si déjà complété : affichage du récapitulatif  


#### Page de chat

-> un picker sur une des lessons
-> une discussion
-> un chat pour discuter avec l'ia

#### Page de parametre

Plusieu sous page

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