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

# v1.2.2
* Fixed an issue where adding users to pads did not work.
* Small changes to HTML to be "up to standard". Future releases will contain more about this.
* Added in a hotkey. Press CTRL+S to save pads automatically, does not work on old browsers.
* Nuke browser caching once and for all: this fixes users having access to pads after they logged out and users not being able to access pads.
* Greatly improved speeds, most likely related to browser caching.
* Clear ``connect.sid`` cookie on logout.

# v1.2.3
* Fixed crash when saving a pad that was not modified.
* Removed all JavaScript and CSS from /profile. When adding a user to a pad the page will be refreshed.
* Add static resources.
* Add XMLHttpRequest support if the browser does not support fetch or Promises.