Sentient Dog Runner - Ready-to-deploy static site
------------------------------------------------

Files:
- index.html
- style.css
- main.js
- sw.js (Service Worker for offline)
- manifest.json
- assets/dog.png

How to use:
1) Unzip and open index.html locally or host on any static host.
2) To deploy to GitHub + Vercel:
   - Create a GitHub repo and push these files.
   - On Vercel, import the repo (or run 'vercel' CLI) and deploy.
3) After first load the Service Worker caches assets so the game runs offline in Chrome.

Commands (example):
  git init
  git add .
  git commit -m "initial commit - Sentient Dog Runner"
  git branch -M main
  git remote add origin https://github.com/<you>/sentient-dog-runner.git
  git push -u origin main

Vercel:
- Sign up at https://vercel.com/signup and import the GitHub repo.
- No build step needed for static site; Vercel will serve the files.
