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