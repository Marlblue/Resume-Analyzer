async function testCanvas() {
    try {
        const canvas = await import('@napi-rs/canvas');
        console.log("Canvas keys:", Object.keys(canvas));
        console.log("DOMMatrix in canvas:", !!canvas.DOMMatrix);
    } catch (e) {
        console.error("Canvas load failed:", e);
    }
}
testCanvas();
