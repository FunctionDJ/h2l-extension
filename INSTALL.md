# how to install

- unpack the zip file somewhere
- the zip contains a `crx` folder which you can extract and name however you like
- don't change the folder name or move it as long as you have the extension installed
- i recommend putting the folder somewhere into Desktop or Documents, but you can really put it anywhere you want
- the files always get read from that folder when you use the extension. the installation doesn't copy them somewhere else, that's why moving the folder or renaming it breaks the extension and you'd have to remove and install it again and will lose your configuration.

- go to `chrome://extensions` (or 3-dot-menu at the top right, then `More tools`, then `Extensions`)
- at the top right, enable `Developer mode`
- this is the danger zone. you're now able to load all kinds of shady, unverified extensions - just like the one i made :)
- click `Load unpacked` at the top left and choose the `crx` folder (or the renamed folder).
- the folder you choose must have the file `manifest.json` in it's root
- the extension is now installed and shows up with a little `h` in the top-right extension dropdown
- you can pin the extension/button and pressing it will open the output window

# how to use

- click the extension button to open the output window
- when the output window opens, the extension will import the data from **all tabs in the same browser window that contain `beatport.com/release/...`**
- you should immediately see text in the output panels on the right if the browser window has beatport release tabs
- there's an update button to fetch the newest tabs, i hope the output window is intuitive enough to be mostly self-explanatory
- make sure you fill out the patch/capitalisation rules. you might never need the capitalisation rules for labels, but this way it's consistent and easy to manage in the code.
- patch rules replace words, not parts of a string
- capitalisations make words (not parts) uppercase

## a few additional notes

- the extension never closes tabs, it only runs a tiny bit of code inside each tabs to get the raw information
- to read the information from a tab, it must be "alive" and not discarded. maybe you know how when you have many tabs open, clicking on a tab that you haven't opened for a while will refresh the tab fully. that's because the browser basically put that tab into sleep mode (discarded). the extension will check for this state and reload a tab if it's discarded, but i wasn't able to test it and i don't know if this works or how fast it will be. you should test that scenario with the 70+ tabs you mentioned and maybe have some other programs open to fill your RAM. you should be able to use the same beatport tab multiple times for testing because the code doesn't de-duplicate the tab scanning (or the releases).

# storage

i'm using the localStorage API to store the configuration. that means that basically the browser stores the config internally, and the data is bound to the extension id that the browser creates when you install the extension, which is why the config will be gone if you re-install the extension. i could build import/export tools, but that's probably not worth it, but if you want that i could make it for an extra fee. otherwise you can import/export the configuration yourself by opening the devtools on the output window and going to `Application` and then on the left side `Local storage` and there you'll find the tools to inspect and modify the data.
