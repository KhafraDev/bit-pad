# v1.0.0
* Initial release (bare bones).

# v1.0.1
* Encodes all user-input.
* Replaces textarea with QuillJS rich text editor.
* Other smaller changes.

# v1.0.2
* Catch more errors.
* Fail requests larger than 100kb (100,000 bytes). Likewise, uploading images has been disabled both browser and server side.
* Other smaller changes.

# v1.1.0
* Add status to all calls.
* Replaced JQuery and Bootstrap JS with vanilla JS.
* Refactored code allowing for production usage.
* Fixed errors with encoding pad names that would cause them to not get saved correctly.
* Save pads as strings rather than an array of objects.
* Fixed an error on the error URL (ironic).

# v1.1.5
* Replaced local resources with CDNs; if other services use Quill or Bootstrap from the respective CND, it will be already cached when loaded.
* Replaced references to my own server with the server currently running Bit-Pad.
* Added in meta tags so it can be embedded into Discord/Twitter, etc. - WIP
* Better error "handling" to notify the user when an error occurs, instead of doing nothing.

# v1.1.6
* Remove "patch" that disallowed $ or . to be included in the paste name.
* Upped the limit of data allowed in body-parser from 100kb max to 5mb.
* Cleaner database connection.
* Removed Quill from dependencies and references to it on the backend. 
* Text-editor now has more options (blockquote, strikethrough, bullet/numbered lists).

# v1.2.0
* Complete rewrite.
* Added accounts: login, register, and own pads that only you can access.
* Separated functions into different files.
* Disable browser caching of pads.
* A lot more I am forgetting.

# v1.2.1
* Add users to pads (/profile).
* Password is hashed before being inserted into the database.