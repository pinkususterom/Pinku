// Premium fallback photos (Unsplash high-resolution celebratory and sibling placeholders)

export interface PhotoPlaceholder {
  id: string;
  url: string;
  caption: string;
}

export const DEFAULT_PHOTOS: PhotoPlaceholder[] = [
  {
    id: 'photo_1',
    url: 'https://images.unsplash.com/photo-1504437484262-5bff4d32a76d?auto=format&fit=crop&q=80&w=600',
    caption: 'My absolute favorite person! 🌟'
  },
  {
    id: 'photo_2',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600',
    caption: 'The life of every single party! 🎉'
  },
  {
    id: 'photo_3',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600',
    caption: 'Floating on balloons of happiness!'
  },
  {
    id: 'photo_4',
    url: 'https://images.unsplash.com/photo-1481887328591-3e277f9473dc?auto=format&fit=crop&q=80&w=600',
    caption: 'Our cutest little baby times 👶'
  },
  {
    id: 'photo_5',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    caption: 'Swagger max! Moti wearing cool glasses 😎'
  },
  {
    id: 'photo_6',
    url: 'https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?auto=format&fit=crop&q=80&w=600',
    caption: 'Pure magic and sibling sparkles ✨'
  },
  {
    id: 'photo_7',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    caption: 'Our princess and mini-me dolls!'
  },
  {
    id: 'photo_8',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    caption: 'Keep shining and keep teasing me! 💕'
  },
  {
    id: 'photo_9',
    url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
    caption: 'Let\'s cut the ultimate birthday cake! 🎂'
  }
];
