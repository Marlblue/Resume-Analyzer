async function test() {
    try {
        console.log("Testing pdf-parse v2...");
        const { PDFParse } = await import('pdf-parse');
        console.log("PDFParse class found:", !!PDFParse);
        
        // Try to initialize it with empty data just to see if it throws
        const parser = new PDFParse({ data: new Uint8Array([0]) });
        console.log("Parser initialized");
        
        // This will likely fail because the data is invalid, but let's see HOW it fails
        try {
            await parser.getText();
        } catch (e) {
            console.log("Expected failure during getText (invalid data):", e.message || e);
        }
        
        await parser.destroy();
        console.log("Test finished successfully");
    } catch (e) {
        console.error("Test failed at top level:", e);
    }
}

test();
