const pdf = require('pdf-parse');
const fs = require('fs');

async function test() {
    try {
        console.log("Testing pdf-parse...");
        // Create a dummy PDF buffer or just check if the module loads
        if (typeof pdf === 'function') {
            console.log("pdf-parse is a function");
        } else {
            console.log("pdf-parse is NOT a function:", typeof pdf);
            console.log("Keys:", Object.keys(pdf));
        }
    } catch (e) {
        console.error("Test failed:", e);
    }
}

test();
