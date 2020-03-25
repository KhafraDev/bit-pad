# bit-pad
 Fast, free, and opensource platform to save notes without any tracking.

# Privacy
* Passwords are hashed before being inserted into the database using bcryptjs.
* No tracking done client or server-side (I cannot verify this with Bootstrap 4 or Quilljs).
* Back and front end are opensource; these claims can be verified.
* Be aware: your password is sent in plaintext to the server, but it is not read (in the unmodified repo). A malicious host **could** log or steal passwords. I could add in more JS client-side and hash the password, but it would be more overhead for the user. Plus, only people with something to hide would provide that much privacy.

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
    * POST /add

# Updating 
* A list of major updates that may occur.

## v1.1.6 -> 1.2.0
* Database restructured.