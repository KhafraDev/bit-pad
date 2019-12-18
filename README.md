# bit-pad
 Etherpad replacement

# How does it work?
* Allows editing in the browser, press the "save" button to save the content of the pad to the server.
* Uses manual saves instead of automatic saving (websockets are unreliable).
* Uses MongoDB and Express to save, load, and work through the browser.
* Uses [QuillJS](https://quilljs.com/) for rich text editing.

# WIP
* Login system, whitelist ("share") pads with other users to allow editing.