if [ ! -d "extension" ]; then 
    mkdir "extension"
fi

browserify  content_script_src.js > extension/content_script.js
browserify  background_src.js > extension/background.js

rm -rf ../extension
mv extension ../extension

