
// Behaviors store their parameters inside target object.
// Constructors construct init() with initial values, everything else is static.

var Behavior = {}

Behavior.Move = function(vx, vy, va) {
    this.init = function(obj) {
        obj.moveXSpeed = vx || 0;
        obj.moveYSpeed = vy || 0;
        obj.moveAngSpeed = va || 0;
    };
};
Behavior.Move.prototype = {
    name: "move",
    exec: function(obj, delta) {
        var newx = obj.x;
        var newy = obj.y;
        var newAngle = obj.angle;

        if(obj.moveYSpeed != 0) {
            newx -= Math.sin(obj.angle) * delta * obj.moveYSpeed;
            newy += Math.cos(obj.angle) * delta * obj.moveYSpeed;
        }

        if(obj.moveXSpeed != 0) {
            newx -= Math.cos(obj.angle) * delta * obj.moveXSpeed;
            newy += Math.sin(obj.angle) * delta * obj.moveXSpeed;
        }

        if(obj.moveAngSpeed != 0) {
            newAngle += delta * obj.moveAngSpeed / 180 * Math.PI;
            if( newAngle < 0)
                newAngle += Math.PI * 2;
            if( newAngle > Math.PI * 2)
                newAngle -= Math.PI * 2;
        }

        var apply = true;

        if (obj.collider){
            var objRect = new Geom.Rect(newx, newy, obj.width, obj.height, newAngle);
            if (obj.collider.IsCollided(objRect)){
                apply = false;
                if (obj.OnCollision){
                    obj.OnCollision();
                }
            }
        }

        if (apply){
            obj.x = newx;
            obj.y = newy;
            obj.angle = newAngle;
        }
    }
};

Behavior.MoveTank = function(leftTrackSpeed, rightTrackSpeed) {
    this.init = function(obj) {
        obj.speed = 0;
        obj.maxSpeed = 60/1000; //px/msec
        obj.rotationSpeed = 0;
        obj.maxRotationSpeed = 90/1000; //deg/msec
    };
};
Behavior.MoveTank.prototype = {
    name: "move",
    exec: function(obj, delta) {
        var newx = obj.x;
        var newy = obj.y;
        var newAngle = obj.angle;

        obj.rotationSpeed = obj.rotationSpeed + (obj.LeftTrack.torque - obj.RightTrack.torque) * delta * obj.maxRotationSpeed / 500;
        if (Math.abs(obj.rotationSpeed) > obj.maxRotationSpeed) obj.rotationSpeed = Math.sign(obj.rotationSpeed) * obj.maxRotationSpeed;
        
        obj.speed = obj.speed + (obj.LeftTrack.torque + obj.RightTrack.torque) / 2 * delta * obj.maxSpeed / 500;
        if (Math.abs(obj.speed) > obj.maxSpeed) obj.speed = Math.sign(obj.speed) * obj.maxSpeed;
        
        if(obj.speed != 0) {
            newx -= Math.sin(obj.angle) * delta * obj.speed;
            newy += Math.cos(obj.angle) * delta * obj.speed;
        }

        if(obj.rotationSpeed != 0) {
            newAngle += delta * obj.rotationSpeed / 180 * Math.PI;
            if( newAngle < 0)
                newAngle += Math.PI * 2;
            if( newAngle > Math.PI * 2)
                newAngle -= Math.PI * 2;
        }

        obj.speed *= 0.95; // get coef from terrain
        obj.rotationSpeed *= 0.95; // get coef from terrain

        var apply = true;

        if (obj.collider){
            var objRect = new Geom.Rect(newx, newy, obj.width, obj.height, newAngle);
            if (obj.collider.IsCollided(objRect)){
                apply = false;
                if (obj.OnCollision){
                    obj.OnCollision();
                }
            }
        }

        if (apply){
            obj.x = newx;
            obj.y = newy;
            obj.angle = newAngle;
        }
    }
};

Behavior.TimedLife = function(time) {
    this.init = function(obj){
        obj.lifeTimeout = time || -1;
    }
};
Behavior.TimedLife.prototype = {
    name: "lifetimeout",
    exec: function(obj, delta) {
        if(obj.lifeTimeout < 0)
            return;
        
        obj.lifeTimeout -= delta;
        if(obj.lifeTimeout <= 0)
            obj.dead = true;
    }
};

Behavior.LifeInBounds = function(minx, miny, maxx, maxy) {
    // here value of 0 is meaningful, so testing for undefined
    if(typeof minx === 'undefined') minx = Number.MIN_VALUE;
    if(typeof miny === 'undefined') miny = Number.MIN_VALUE;
    if(typeof maxx === 'undefined') maxx = Number.MAX_VALUE;
    if(typeof maxy === 'undefined') maxy = Number.MAX_VALUE;
    this.init = function(obj) {
        obj.lifeMinX = minx;
        obj.lifeMinY = miny;
        obj.lifeMaxX = maxx;
        obj.lifeMaxY = maxy;
    }
};
Behavior.LifeInBounds.prototype = {
        name: "lifebounds",
        exec: function(obj, delta) {
            if(obj.dead)
                return;
            if( obj.x < obj.lifeMinX ||
                obj.y < obj.lifeMinY ||
                obj.x > obj.lifeMaxX ||
                obj.y > obj.lifeMaxY)
                obj.dead = true;
    }
};

Behavior.Custom = function(func) {
    this.init = function(obj) {
        obj.customFunc = func
    }
};
Behavior.Custom.prototype = {
        name: "custom",
        exec: function(obj, delta) {
            obj.customFunc(delta)
    }
};