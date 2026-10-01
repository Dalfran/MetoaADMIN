# 🛡️ METOA Admin — Application Administrateur

Application web Angular dédiée à l'**administration de la plateforme de covoiturage METOA**.

Cette application constitue l'interface destinée aux administrateurs pour superviser et administrer les différents éléments de la plateforme.

---

# 📌 Présentation

**METOA** est une plateforme de covoiturage composée de plusieurs applications clientes communiquant avec un backend commun développé avec Spring Boot.

Ce dépôt correspond à l'application **Administrateur**.

## Écosystème METOA

| Composant | Technologie | Port |
|---|---|---:|
| Backend METOA | Spring Boot / Java 17 | `8089` |
| Application Passager | Angular | `4200` |
| Application Chauffeur | Angular | `4201` |
| Application Administrateur | Angular | `4202` |

Architecture générale :

```text id="qv65ap"
                         ┌──────────────────────┐
                         │    METOA BACKEND     │
                         │ Spring Boot / Java 17│
                         │    localhost:8089    │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │   PASSAGER   │  │  CHAUFFEUR   │  │    ADMIN     │
          │ Angular :4200│  │ Angular :4201│  │ Angular :4202│
          └──────────────┘  └──────────────┘  └──────────────┘
```

---

# 🛠️ Technologies utilisées

## Frontend

- Angular `21.2.24`
- Angular CLI `21.2.24`
- TypeScript `5.9.3`
- RxJS `7.8.2`
- Node.js `20.20.2`
- npm `10.8.2`
- Angular SSR
- Express `5.1.0`

## Backend

L'application communique avec le backend METOA :

- Spring Boot `3.3.7`
- Java `17`
- MySQL
- Spring Security
- JWT
- REST API

Backend :

```text id="r2ifv7"
http://localhost:8089
```

---

# 📋 Prérequis

Vérifier les versions installées :

```bash id="1pj7h5"
node -v
npm -v
npx ng version
```

Versions utilisées :

```text id="5w0u2d"
Node.js       20.20.2
npm           10.8.2
Angular       21.2.24
Angular CLI   21.2.24
TypeScript    5.9.3
RxJS          7.8.2
```

---

# 📥 Installation

Cloner le dépôt :

```bash id="1rj4cc"
git clone https://github.com/Dalfran/MetoaADMIN.git
```

Entrer dans le projet :

```bash id="3bmx0y"
cd MetoaADMIN
```

Installer les dépendances :

```bash id="z2ij5q"
npm install
```

---

# ▶️ Démarrage

Le port de l'application est configuré directement dans `package.json`.

Lancer :

```bash id="lh7h2o"
npm start
```

L'application est disponible sur :

```text id="kq1r29"
http://localhost:4202
```

Le script utilisé est :

```json id="0wnspq"
"start": "ng serve --port 4202"
```

---

# 🔐 Authentification et sécurité

L'application d'administration utilise une authentification basée sur **JWT**.

Le principe général est :

```text id="3yg5r5"
Administrateur
      │
      ▼
   Connexion
      │
      ▼
     JWT
      │
      ▼
Spring Security
      │
      ▼
Vérification des droits
      │
      ▼
Accès aux fonctionnalités administratives
```

Les appels authentifiés utilisent :

```http id="8jtyzu"
Authorization: Bearer <JWT>
```

Les fonctionnalités administratives doivent être protégées côté backend par les mécanismes de sécurité Spring Security.

---

# 🛡️ Rôle de l'administrateur

L'application Admin constitue l'interface de supervision de la plateforme.

Elle est destinée notamment à :

- consulter les informations de la plateforme ;
- superviser les utilisateurs ;
- contrôler les profils ;
- superviser les conducteurs ;
- contrôler les documents conducteurs ;
- suivre les trajets ;
- suivre les réservations ;
- administrer les éléments nécessitant une intervention administrative.

Les opérations réellement disponibles dépendent des endpoints exposés par le backend METOA.

---

# 👥 Gestion des utilisateurs

L'administration peut s'appuyer sur les données utilisateurs fournies par le backend.

Les informations principales d'un utilisateur peuvent notamment comprendre :

```text id="h08wnu"
identifiant
nom
prénom
email
téléphone
sexe
rôle
statut
photo
photo de couverture
```

Les opérations administratives doivent être effectuées via les services REST du backend.

---

# 🚗 Gestion des conducteurs

L'administrateur peut superviser les profils conducteurs et les informations nécessaires au fonctionnement de la plateforme.

Le profil conducteur peut notamment contenir :

```text id="f5xjq7"
adresse
bio
préférences
véhicule
note moyenne
nombre d'avis
nombre de trajets
taux d'acceptation
badge
statut d'activité
```

---

# 📄 Vérification des documents conducteurs

Une fonctionnalité importante de l'administration concerne la **vérification des documents des conducteurs**.

Les documents peuvent être associés à différents types :

```text id="e1c1cz"
PERMIS_CONDUIRE
CARTE_IDENTITE
ASSURANCE
CARTE_GRISE
AUTRE
```

Chaque document peut suivre un processus de vérification :

```text id="e90k5x"
                 ┌─────────────┐
                 │  EN_ATTENTE │
                 └──────┬──────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
       ┌───────────┐        ┌───────────┐
       │  APPROUVE │        │   REJETE  │
       └───────────┘        └───────────┘
```

Les informations associées à la vérification peuvent notamment comprendre :

```text id="v5d5wt"
statut de vérification
motif de rejet
date de vérification
administrateur ayant effectué la vérification
```

L'objectif est de permettre à l'administration de contrôler les documents transmis par les conducteurs.

---

# 🚘 Supervision des trajets

L'administration peut s'appuyer sur les informations relatives aux trajets.

Les statuts de trajet utilisés par le backend sont notamment :

```text id="xuw5jl"
PLANIFIE
EN_COURS
TERMINE
ANNULE
```

Le schéma général est :

```text id="ux9i9w"
Conducteur
    │
    ▼
Trajet
    │
    ├── Planifié
    ├── En cours
    ├── Terminé
    └── Annulé
```

---

# 📑 Supervision des réservations

Les réservations sont liées aux trajets et aux passagers.

Les statuts utilisés sont notamment :

```text id="vq4svu"
EN_ATTENTE
CONFIRMEE
ANNULEE
TERMINEE
```

L'administration peut utiliser ces informations pour assurer la supervision de l'activité de la plateforme.

---

# ⭐ Notation et avis

Le système METOA comprend également une fonctionnalité de notation et d'avis.

Les données de réputation peuvent notamment être utilisées pour suivre :

- les notes moyennes ;
- le nombre d'avis ;
- l'activité des conducteurs ;
- l'évolution de leur réputation.

Les règles de calcul de réputation sont gérées côté backend.

---

# 🌐 Communication avec le backend

Le backend METOA est disponible sur :

```text id="fq48o5"
http://localhost:8089
```

Architecture :

```text id="f5pnks"
METOA Admin
      │
      │ HTTP + JWT
      ▼
METOA Backend
      │
      ├── Utilisateurs
      ├── Conducteurs
      ├── Documents
      ├── Trajets
      ├── Réservations
      └── Avis
             │
             ▼
           MySQL
```

---

# 🗂️ Organisation du projet

Structure Angular simplifiée :

```text id="x9d5v5"
src/
└── app/
    │
    ├── core/
    │   ├── services/
    │   ├── guards/
    │   ├── interceptors/
    │   └── ...
    │
    ├── features/
    │   ├── auth/
    │   ├── dashboard/
    │   ├── users/
    │   ├── conducteurs/
    │   ├── trajets/
    │   ├── reservations/
    │   └── ...
    │
    └── ...
```

Cette organisation peut évoluer avec l'ajout de nouvelles fonctionnalités administratives.

---

# 🔒 Sécurité

Les informations sensibles ne doivent jamais être versionnées.

Ne jamais ajouter au dépôt :

```text id="5z5m89"
mots de passe
clés JWT
clés API
tokens personnels
identifiants privés
```

La sécurité des opérations administratives doit être assurée à la fois :

- côté frontend pour l'expérience utilisateur ;
- côté backend pour le contrôle réel des autorisations.

---

# 🌿 Organisation Git

Le dépôt utilise la structure :

```text id="gjr9kc"
main
 │
 └── develop
       │
       ├── feature/...
       ├── fix/...
       └── refactor/...
```

## `main`

Version stable.

## `develop`

Branche d'intégration.

## `feature/*`

Nouvelle fonctionnalité.

Exemple :

```bash id="47pt86"
git checkout develop
git pull origin develop
git checkout -b feature/verification-documents
```

## `fix/*`

Correction d'un problème.

Exemple :

```bash id="yg7qhv"
git checkout develop
git pull origin develop
git checkout -b fix/correction-dashboard
```

---

# 🔄 Workflow collaboratif

Avant de commencer :

```bash id="w9byci"
git checkout develop
git pull origin develop
```

Créer une branche :

```bash id="4ypx54"
git checkout -b feature/nom-fonctionnalite
```

Après développement :

```bash id="bbq6ap"
git add .
git commit -m "feat: description de la fonctionnalite"
```

Publier :

```bash id="vnj5g8"
git push -u origin feature/nom-fonctionnalite
```

Créer ensuite une **Pull Request vers `develop`**.

Les développements fonctionnels ne doivent pas être effectués directement sur `main`.

---

# 🧪 Tests

Lancer les tests :

```bash id="x1r6o9"
npm test
```

---

# 🏗️ Build

Construire l'application :

```bash id="2vwxks"
npm run build
```

Le résultat est généré dans :

```text id="9qf5i7"
dist/
```

Le dossier `dist/` ne doit pas être versionné.

---

# 🚀 Développement local

Pour travailler avec l'ensemble de l'écosystème METOA :

### Backend

```text id="0cn0b4"
http://localhost:8089
```

### Passager

```text id="mb4oij"
http://localhost:4200
```

### Chauffeur

```text id="oh9r5m"
http://localhost:4201
```

### Administrateur

```bash id="4uw4y1"
cd MetoaADMIN
npm install
npm start
```

Disponible sur :

```text id="f47d7e"
http://localhost:4202
```

---

# 👥 Collaboration GitHub

Chaque développeur doit utiliser son propre compte GitHub.

Les collaborateurs sont ajoutés directement au dépôt GitHub.

Les identifiants et mots de passe personnels ne doivent jamais être partagés.

---

# 📚 Dépôts METOA

| Projet | Repository |
|---|---|
| Backend | `METOA` |
| Passager | `METOA_front` |
| Chauffeur | `MetoaDriver` |
| Administrateur | `MetoaADMIN` |

---

# 👨‍💻 Projet

**METOA — Plateforme de covoiturage**

Application développée dans le cadre d'un projet académique.

**Frontend Administrateur — Angular**
