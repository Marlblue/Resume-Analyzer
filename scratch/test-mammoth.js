async function testMammoth() {
    try {
        console.log("Testing mammoth...");
        const mammoth = await import('mammoth');
        console.log("Mammoth loaded");
        // mammoth.extractRawText({ buffer })
        console.log("mammoth keys:", Object.keys(mammoth));
    } catch (e) {
        console.error("Mammoth test failed:", e);
    }
}
testMammoth();
