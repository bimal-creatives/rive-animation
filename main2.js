// Animation was created with https://beta.rive.app
;
  (function() {
    // first, instantiate the Rive engine and load the WASM file(s)
    Rive({
      locateFile: (file) => 'https://unpkg.com/rive-canvas@0.0.10/' + file,
    }).then((rive) => {
      // Rive's ready to rock 'n roll
      // Let's load up a Rive animation file, typically ending in '.riv'
      const req = new Request('https://cdn.rive.app/animations/vapor_loader.riv');
      fetch(req).then((res) => {
        return res.arrayBuffer();
      }).then((buf) => {
        // we've got the raw bytes of the animation, let's load them into a Rive
        // file
        const file = rive.load(new Uint8Array(buf));
        // get the default artboard, where the animations we want to interact
        // with live in this file
        const artboard = file.defaultArtboard();
        // now we can access the animations; let's get one called 'vibration'
        const exampleAnim = artboard.animation('test');
        const exampleInstance = new rive.LinearAnimationInstance(exampleAnim);
        // let's grab our canvas
        const canvas = document.getElementById('riveCanvas');
        const ctx = canvas.getContext('2d');
        // nw we can create a Rive renderer and wire it up to our 2D context
        const renderer = new rive.CanvasRenderer(ctx);
        // track the last time a frame was rendered
        let lastTime = 0;
        // okay, so we have an animation and a renderer; how do we play an
        // animation? First, let's set up our animation loop with
        // requestFrameAnimation
        function draw(time) {
          // work out how many seconds have passed since a previous frame was
          // drawn
          if (!lastTime) {
            lastTime = time;
          }
          const elapsedTime = (time - lastTime) / 1000;
          lastTime = time;

          // advance our animation by the elapsed time
          exampleInstance.advance(elapsedTime);
          // apply the animation to the artboard 
          exampleInstance.apply(artboard, 1.0);
          // advance the artboard
          artboard.advance(elapsedTime);

          // render the animation frame
          // first, clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // let's resize it to fit the canvas
          ctx.save();
          renderer.align(rive.Fit.contain, rive.Alignment.center, {
            minX: 0,
            minY: 0,
            maxX: canvas.width,
            maxY: canvas.height
          }, artboard.bounds);
          // and now we can draw our frame to our canvas
          artboard.draw(renderer);
          ctx.restore();

          // and kick off the next frame
          requestAnimationFrame(draw);
        }
        // now kick off the animation
        requestAnimationFrame(draw);

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          requestAnimationFrame(draw);
        }
        resizeCanvas();
      });
    });
  })();
