// Animation was created with https://beta.rive.app
;
(function () {
    // first, instantiate the Rive engine and load the WASM file(s)
    Rive({
        locateFile: (file) => "https://unpkg.com/rive-canvas@0.6.1/" + file
    }).then((rive) => {
        // Rive's ready to rock 'n roll
        // Let's load up a Rive animation file, typically ending in '.riv'
        const req = new Request(
            "https://cdn.rive.app/animations/off_road_car_blog_0_6.riv"
        );
        fetch(req)
            .then((res) => {
                return res.arrayBuffer();
            })
            .then((buf) => {
                const file = rive.load(new Uint8Array(buf));
                const canvas = document.getElementById("riveCanvas1");
                const ctx = canvas.getContext("2d");

                const artboard = file.defaultArtboard();

                const renderer = new rive.CanvasRenderer(ctx);

                const idleAnim = artboard.animation("idle");
                const idleInstance = new rive.LinearAnimationInstance(idleAnim);

                const wipersAnim = artboard.animation("windshield_wipers");
                const wipersInstance = new rive.LinearAnimationInstance(wipersAnim);

                let wipersTarget = false;
                let wipersEnabled = false;
                let stopTime;

                let lastTime = 0;

                function draw(time) {
                    // work out how many seconds have passed since a previous frame was
                    // drawn
                    if (!lastTime) {
                        lastTime = time;
                    }
                    const elapsedTime = (time - lastTime) / 1000;
                    lastTime = time;

                    idleInstance.advance(elapsedTime);
                    idleInstance.apply(artboard, 1.0);

                    if (wipersEnabled) {
                        wipersInstance.advance(elapsedTime);
                        wipersInstance.apply(artboard, 1.0);

                        if (wipersTarget == false && wipersInstance.time < stopTime) {
                            wipersEnabled = false;
                        }
                    }
                    // advance the artboard
                    artboard.advance(elapsedTime);

                    // render the animation frame
                    // first, clear the canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // let's resize it to fit the canvas
                    ctx.save();
                    renderer.align(
                        rive.Fit.contain,
                        rive.Alignment.center, {
                            minX: 0,
                            minY: 0,
                            maxX: canvas.width,
                            maxY: canvas.height
                        },
                        artboard.bounds
                    );
                    // and now we can draw our frame to our canvas
                    artboard.draw(renderer);
                    ctx.restore();

                    // and kick off the next frame
                    requestAnimationFrame(draw);
                }
                // now kick off the animation
                requestAnimationFrame(draw);

                // resize the canvas to fill browser window dynamically
                window.addEventListener("resize", resizeCanvas, false);
                document.getElementById("wiperToggle").addEventListener("click", toggleWipers);

                function toggleWipers() {
                    wipersTarget = !wipersTarget;
                    if (wipersTarget) {
                        wipersEnabled = true;
                    } else {
                        stopTime = wipersInstance.time;
                    }
                }

                function resizeCanvas() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight - 50;
                    requestAnimationFrame(draw);
                }
                resizeCanvas();
            });
    });
})();