
function l(what) {return document.getElementById(what);}

var App = {
    Inputs: {},
    UpdateFrame: function(delta) {
        Game.Logic(delta);
        Game.RootEntity.update(delta);
    },
    globalScale: 1.5,
    DrawFrame: function(interpolationPercentage) {
        var ctx = App.Context;
        ctx.clearRect(0, 0, App.Canvas.width, App.Canvas.height);
        ctx.save();
        ctx.scale(App.globalScale, App.globalScale);
        Game.Map.drawMap(ctx, 0, 0);
        Game.RootEntity.draw(ctx);
        ctx.restore();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#f00";
        ctx.strokeRect(0, 0, 1024, 768);
        ctx.strokeStyle = "#0a0";
        ctx.strokeRect(8, 8, 752, 752);
        ctx.drawImage(App.tankPH, 776, 136, 240, 240);
        ctx.drawImage(App.tankPH, 776, 520, 240, 240);
    },
    EndFrame: function(fps, panic) {
            if (panic) {
                var discardedTime = Math.round(MainLoop.resetFrameDelta());
                console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
            }
    },
    EntryPoint: function() {

        App.tankPH = new Image();
        App.tankPH.src = "./images/tank.png";


        App.Keyboard = new Keyboard();
        App.Canvas = document.getElementById('gameCanvas');
        App.Canvas.width = window.innerWidth;
        App.Canvas.height = window.innerHeight;
        App.Context = App.Canvas.getContext('2d');
        App.Context.mozImageSmoothingEnabled = false;
        App.Context.webkitImageSmoothingEnabled = false;
        App.Context.msImageSmoothingEnabled = false;
        App.Context.imageSmoothingEnabled = false;

        Game.Setup();

        Game.Tank.Inputs = {};
        Game.Tank.Inputs.ThrottleInput = new KeyboardBiDiInput(App.Keyboard, 'W', 'S');
        Game.Tank.Inputs.TankTurnInput = new KeyboardBiDiInput(App.Keyboard, 'D', 'A');
        //Game.Tank.Inputs.LeftTrackInput = new KeyboardBiDiInput(App.Keyboard, 'A', 'Z');
        //Game.Tank.Inputs.RightTrackInput = new KeyboardBiDiInput(App.Keyboard, 'D', 'C');
        //Game.Tank.Inputs.StrafeInput = new KeyboardBiDiInput(App.Keyboard, 'E', 'Q');
        Game.Tank.Inputs.TurretTurnInput = new KeyboardBiDiInput(App.Keyboard, 'E', 'Q');
        Game.Tank.Inputs.FireInput = new KeyboardCooldownInput(App.Keyboard, '2', 300, false);

        Game.Tank1.Inputs = {};
        Game.Tank1.Inputs.ThrottleInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'moveForward', 'moveBackward');
        Game.Tank1.Inputs.TankTurnInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'turnRight', 'turnLeft');
        Game.Tank1.Inputs.LeftTrackInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'leftTrackForward', 'leftTrackBackward');
        Game.Tank1.Inputs.RightTrackInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'rightTrackForward', 'rightTrackBackward');
        Game.Tank1.Inputs.StrafeInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'strafeRight', 'strafeLeft');
        Game.Tank1.Inputs.TurretTurnInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'turretLeft', 'turretRight');
        Game.Tank1.Inputs.FireInput = new KeyboardCooldownInput(new NetworkCooldownInputKeyboardStub(function() {return Sockets.ViewModel.team1;}, 'fire'), '2', 300, false);


        Game.Tank2.Inputs = {};
        Game.Tank2.Inputs.ThrottleInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team2;}, 'moveForward', 'moveBackward');
        Game.Tank2.Inputs.TankTurnInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team2;}, 'turnRight', 'turnLeft');
        Game.Tank2.Inputs.LeftTrackInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team2;}, 'leftTrackForward', 'leftTrackBackward');
        Game.Tank2.Inputs.RightTrackInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team2;}, 'rightTrackForward', 'rightTrackBackward');
        Game.Tank2.Inputs.StrafeInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team2;}, 'strafeRight', 'strafeLeft');
        Game.Tank2.Inputs.TurretTurnInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team2;}, 'turretLeft', 'turretRight');
        Game.Tank2.Inputs.FireInput = new KeyboardCooldownInput(new NetworkCooldownInputKeyboardStub(function() {return Sockets.ViewModel.team2;}, 'fire'), '2', 300, false);


        /*
        App.Inputs.ThrottleInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'moveForward', 'moveBackward');
        App.Inputs.TankTurnInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'turnRight', 'turnLeft');
        App.Inputs.LeftTrackInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'leftTrackForward', 'leftTrackBackward');
        App.Inputs.RightTrackInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'rightTrackForward', 'rightTrackBackward');
        App.Inputs.StrafeInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'strafeRight', 'strafeLeft');
        App.Inputs.TurretTurnInput = new NetworkBiDiInput(function() {return Sockets.ViewModel.team1;}, 'turretLeft', 'turretRight');
        App.Inputs.FireInput = new KeyboardCooldownInput(new NetworkCooldownInputKeyboardStub(function() {return Sockets.ViewModel.team1;}, 'fire'), '2', 300, false);
*/

        /*
        App.Inputs.ThrottleInput = new KeyboardBiDiInput(App.Keyboard, 'W', 'S');
        App.Inputs.TankTurnInput = new KeyboardBiDiInput(App.Keyboard, 'D', 'A');
        // App.Inputs.LeftTrackInput = new KeyboardBiDiInput(App.Keyboard, 'A', 'Z');
        // App.Inputs.RightTrackInput = new KeyboardBiDiInput(App.Keyboard, 'D', 'C');
        //App.Inputs.StrafeInput = new KeyboardBiDiInput(App.Keyboard, 'E', 'Q');
        App.Inputs.TurretTurnInput = new KeyboardBiDiInput(App.Keyboard, 'E', 'Q');
        App.Inputs.FireInput = new KeyboardCooldownInput(App.Keyboard, '2', 300, false);
*/


        //PlaySound("./sound/bl-slaughter.mp3", 90, true);

        MainLoop.setBegin(Game.ConsumeInputs).setUpdate(App.UpdateFrame).setDraw(App.DrawFrame).setEnd(App.EndFrame).start();
    }
};

var documentReadyInterval = setInterval(function() {
    if (document.readyState === 'complete') {
        App.EntryPoint();
        clearInterval(documentReadyInterval);
        window.onresize = function() {
            if (App.Canvas != undefined) {
                App.Canvas.width = window.innerWidth;
                App.Canvas.height = window.innerHeight;
            }
        };
    }
}, 50);
