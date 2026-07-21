# Africa Digital Pulse — MVP

Prototype fonctionnel construit à partir du dossier projet. Il comprend le site éditorial public, les pages de confiance, le corpus par pays/secteur, les données structurées, le RSS, le sitemap et un studio éditorial local.

## Lancer

```bash
python3 -m http.server 4173
```

Ouvrir `http://localhost:4173`. Le bouton **Studio éditorial** donne accès à la console. Les données sont conservées dans `localStorage` du navigateur.

## Tester

```bash
npm test
```

## Garde-fous implémentés

- brouillon privé par défaut ;
- source primaire obligatoire ;
- quatre contrôles éditoriaux obligatoires ;
- approbation humaine explicite ;
- séparation visuelle des faits, incertitudes et analyse ;
- contenus de démonstration identifiés comme tels.

## Passage en production

Ce prototype valide l’expérience et les règles métier. La phase suivante consiste à remplacer `localStorage` par D1, ajouter une authentification Cloudflare Access, stocker les médias dans R2 et implémenter collecte/Workflows sans modifier le garde-fou d’approbation.
