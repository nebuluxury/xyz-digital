# DV8 Web - hosting, domain & security

## Where it's hosted (free)
The site is a hand-coded static site. It's hosted **free on GitHub Pages** from the
`nebuluxury/xyz-digital` repo - the same free static hosting used for the other studio
sites. Live URL today: https://nebuluxury.github.io/xyz-digital/

GitHub Pages includes:
- Free hosting with a global CDN
- **Free automatic HTTPS/SSL** (Let's Encrypt) - including on a custom domain
- DDoS protection at the platform edge

There is no monthly hosting cost.

## Going live on deviateweb.com

### Step 1 - you: register the domain (if not already)
Register **deviateweb.com** at any registrar (Namecheap, Cloudflare, Google/Squarespace, GoDaddy...).

### Step 2 - you: add these DNS records
At whoever manages the domain's DNS, add:

**Apex (deviateweb.com) - four A records:**
```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```
(Optional IPv6 - AAAA records: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153)

**www (www.deviateweb.com) - one CNAME record:**
```
CNAME   www   nebuluxury.github.io
```

### Step 3 - me: attach the domain
Once the records are in, tell me and I'll add the `CNAME` file + turn on
"Enforce HTTPS." (I'm holding this step so the current live URL keeps working until
your DNS is ready.) The cert provisions automatically within minutes to a few hours.

## Security added
- `_headers` - CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy (applied automatically on Cloudflare Pages / Netlify).
- `404.html` - branded not-found page.
- `robots.txt` + `sitemap.xml` - clean crawling + SEO.
- No secrets, no server, no database = almost nothing to attack. The lead form posts
  to Web3Forms over HTTPS (no backend to breach).

## Optional security upgrade (recommended, still free): Cloudflare in front
GitHub Pages can't set custom HTTP security headers on its own. To get the full
`_headers` set plus a Web Application Firewall, bot protection, and analytics - all on
Cloudflare's **free** plan - point the domain's **nameservers** at Cloudflare instead of
adding the records above at your registrar, then add the same A/CNAME records inside
Cloudflare (proxied), set SSL mode to **Full**, and turn on "Always Use HTTPS."
Say the word and I'll walk you through it.

## One to-do before the lead form works
`lead.html` still has a placeholder Web3Forms key (`REPLACE_WITH_WEB3FORMS_ACCESS_KEY`).
Grab a free key at https://web3forms.com and send it to me (or paste it in), and referral
submissions will start emailing through.
