# bit-pad
 Fast, free, and opensource platform to save notes without any tracking.

# Platforms:
* NodeJS: v12 and v13 (at the time, LTS and current/beta).
* Windows 10 (locally), Ubuntu 18.04 in production.
* Nginx on Ubuntu and a stand-alone server.
* Firefox (v73), Firefox Nightly, Tor, and Microsoft Edge.

# Installation
1. Download or clone the repo to a folder of your choice.
2. Install NodeJS, tested on v12 and v13.
3. In the folder, ``npm i express mongodb ejs``.
4. ``npm i -g pm2``
5. Install and configure MongoDB (you may need to edit the [connection handler](./src/lib/Connect.js)).
6. OPTIONAL; Configure nginx to run a reverse proxy on port 3000 (if you want SSL).
7. OPTIONAL; but RECOMMENDED: Download LetsEncrypt and a certificate.
8. ``pm2 start index.js --name bitpad``.

# Demo
https://www.khafra.bid/