import MainController from "./MainController";
function start() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
        document.body.appendChild(canvas);
        canvas.width = window.innerWidth - 50;
        canvas.height = window.innerHeight - 50;

        const mainController = new MainController(canvas, ctx);
        mainController.start();
    }
}

start();
