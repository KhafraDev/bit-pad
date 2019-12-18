# bit-pad
 Etherpad replacement

# How does it work?
* Allows editing in the browser, press the "save" button to save the content of the pad to the server.
* Instead of automatically saving (I presume through websockets which are unreliable), allows the user to manually save.

* Uses MongoDB and Express to save, load, and work through the browser.

# WIP
* Login system, whitelist ("share") pads with other users to allow editing.