# bit-pad
 Fast, free, and opensource platform to save notes without any tracking.

# v1.2.0
* Do NOT use.
    * Passwords stored in plaintext.
    * No way to add users to a pad.
    * Possible re-re-structuring of database(s) in the future to accomodate for new features.
    * Secret key for express-session is not very secret.

# Installation
1. Download or clone the repo to a folder of your choice.
2. Install NodeJS, tested on v12 and v13.
3. In the folder, ``npm i``.
4. ``npm i -g pm2``
5. Install and configure MongoDB (you may need to edit the [connection handler](./src/lib/Connect.js)).
6. OPTIONAL; Configure nginx to run a reverse proxy on port 3000.
7. OPTIONAL; but RECOMMENDED: Download LetsEncrypt and a certificate.
8. ``pm2 start index.js --name bitpad``.

# Demo
https://www.khafra.bid/ (v1.1.6)

# API
* The API was built to be simple to use and easy to figure out. These docs document what could easily be found in production and within the source.
    * GET / 
    * GET /pad/:name?
    * GET /profile
    * GET /login
    * POST /register
    * POST /login
    * POST /logout
    * POST /create
    * POST /save

# Updating 
* A list of major updates that may occur.

## v1.1.6 -> 1.2.0
* Database restructured.