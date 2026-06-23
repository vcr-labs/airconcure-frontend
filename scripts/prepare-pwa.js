const fs = require('fs');
const path = require('path');

const IS_PROVIDER = process.env.EXPO_PUBLIC_APP_VARIANT === 'provider';

const manifest = {
  short_name: IS_PROVIDER ? 'AC Pro' : 'AirConCure',
  name: IS_PROVIDER ? 'AirConCure Pro' : 'AirConCure',
  description: IS_PROVIDER
    ? 'Manage bookings and grow your AC service business'
    : 'Book aircon cleaning and maintenance services',
  icons: [
    {
      src: '/icon-192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: '/icon-512.png',
      type: 'image/png',
      sizes: '512x512',
    },
  ],
  start_url: '/',
  display: 'standalone',
  theme_color: '#0D9488',
  background_color: '#F0F9FF',
};

const outputPath = path.join(__dirname, '..', 'public', 'manifest.json');
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${IS_PROVIDER ? 'provider' : 'client'} manifest to ${outputPath}`);
