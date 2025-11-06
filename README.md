# 📚 Système de Gestion de Bibliothèque

Un template HTML/CSS/JavaScript pur pour gérer une bibliothèque de manière simple et intuitive.

## 🎯 Fonctionnalités

- **Gestion des livres** : Ajoutez, modifiez et supprimez des livres facilement
- **Système d'emprunts** : Empruntez et retournez des livres avec suivi en temps réel
- **Recherche avancée** : Recherchez par titre, auteur ou ISBN
- **Filtrage par catégorie** : Organisez vos livres par catégories
- **Statistiques** : Visualisez les statistiques de votre bibliothèque
- **Stockage local** : Les données sont sauvegardées automatiquement dans le navigateur
- **Design responsive** : Fonctionne parfaitement sur tous les appareils
- **Interface moderne** : Design épuré avec animations fluides

## 📋 Catégories disponibles

- Fiction
- Non-fiction
- Science
- Histoire
- Biographie
- Enfants
- Technologie

## 🚀 Installation

1. Téléchargez ou clonez ce projet
2. Ouvrez le fichier `index.html` dans votre navigateur
3. C'est tout ! Aucune installation supplémentaire n'est nécessaire

## 📖 Utilisation

### Ajouter un livre

1. Cliquez sur le bouton **"Ajouter un livre"**
2. Remplissez les informations du livre :
   - Titre (obligatoire)
   - Auteur (obligatoire)
   - ISBN (obligatoire)
   - Catégorie
   - Année de publication
   - Nombre d'exemplaires
   - Description
   - Couleur de couverture
3. Cliquez sur **"Ajouter le livre"**

### Rechercher des livres

Utilisez la barre de recherche pour trouver des livres par :
- Titre
- Auteur
- ISBN

### Filtrer par catégorie

Sélectionnez une catégorie dans le menu déroulant pour filtrer les livres.

### Emprunter un livre

1. Cliquez sur le bouton **"Emprunter"** sur la carte du livre
2. Le nombre d'exemplaires disponibles diminuera automatiquement

### Retourner un livre

1. Cliquez sur le bouton **"Retourner"** sur la carte du livre
2. Le nombre d'exemplaires disponibles augmentera

### Éditer un livre

1. Cliquez sur le bouton **"Éditer"** sur la carte du livre
2. Modifiez les informations
3. Cliquez sur **"Mettre à jour"**

### Supprimer un livre

1. Cliquez sur le bouton **"Supprimer"** sur la carte du livre
2. Confirmez la suppression

### Voir les statistiques

Cliquez sur le bouton **"Stats"** pour afficher :
- Nombre total de livres
- Nombre de livres empruntés
- Nombre de livres disponibles

## 🎨 Personnalisation

### Modifier les couleurs

Vous pouvez personnaliser les couleurs en modifiant les variables CSS dans `styles.css` :

```css
:root {
    --primary-color: #2563eb;
    --primary-dark: #1e40af;
    --success-color: #22c55e;
    --danger-color: #ef4444;
    /* ... autres couleurs ... */
}
```

### Ajouter des catégories

Pour ajouter une nouvelle catégorie :

1. Ouvrez `index.html`
2. Trouvez la section `<select id="categoryFilter">`
3. Ajoutez une nouvelle option :
```html
<option value="Nouvelle Catégorie">Nouvelle Catégorie</option>
```
4. Faites la même chose dans le formulaire d'ajout de livre

### Ajouter des couleurs de couverture

Pour ajouter une nouvelle couleur de couverture :

1. Ouvrez `index.html`
2. Trouvez la section "Color picker"
3. Ajoutez un nouveau bouton :
```html
<button type="button" class="color-btn" data-color="from-couleur-500 to-couleur-700" style="background: linear-gradient(135deg, #couleur1, #couleur2);"></button>
```

## 💾 Données

Les données sont stockées dans le `localStorage` du navigateur. Elles persisteront même après la fermeture du navigateur.

**Important** : Les données sont stockées localement. Si vous videz le cache de votre navigateur, les données seront perdues.

## 🌐 Compatibilité

- Chrome/Chromium (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)

## 📱 Responsive Design

L'application est entièrement responsive et fonctionne sur :
- Ordinateurs de bureau
- Tablettes
- Téléphones mobiles

## 🔧 Structure du projet

```
bibliotheque_template/
├── index.html       # Structure HTML
├── styles.css       # Styles CSS
├── script.js        # Logique JavaScript
└── README.md        # Documentation
```

## 📝 Notes

- Aucune dépendance externe requise (sauf Font Awesome pour les icônes)
- Aucun serveur backend nécessaire
- Fonctionne complètement hors ligne
- Code facilement modifiable et extensible

## 🎓 Apprentissage

Ce template est parfait pour :
- Apprendre HTML, CSS et JavaScript
- Comprendre la gestion d'état en JavaScript
- Découvrir le localStorage
- Pratiquer la création d'interfaces utilisateur

## 📄 Licence

Ce projet est libre d'utilisation et de modification.

## 🤝 Contribution

N'hésitez pas à modifier et améliorer ce template selon vos besoins !

---

**Créé avec ❤️ pour les amateurs de livres et de code**
