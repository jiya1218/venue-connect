import fs from 'fs';
fetch('http://localhost:3000/ahmedabad/vendors/photographers/')
  .then(r => r.text())
  .then(html => {
    console.log('TITLE:', html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]);
    console.log('DESC:', html.match(/<meta[^>]*name=\"description\"[^>]*content=\"(.*?)\"/i)?.[1]);
    console.log('H1:', html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  });
