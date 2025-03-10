type pos = {
    x: number;
    y: number;
};

export function calculateAngle(touchPos: pos, elementCenter: pos, radius: number) {
    let x;
    let y;
    // + +
    if (touchPos.x > elementCenter.x && touchPos.y < elementCenter.y) {
        x = touchPos.x - elementCenter.x;
        y = elementCenter.y - touchPos.y;
    }
    // - -
    if (touchPos.x < elementCenter.x && touchPos.y > elementCenter.y) {
        x = touchPos.x - elementCenter.x;
        y = elementCenter.y - touchPos.y;
    }
    // + -
    if (touchPos.x > elementCenter.x && touchPos.y > elementCenter.y) {
        x = touchPos.x - elementCenter.x;
        y = elementCenter.y - touchPos.y;
    }

    // - +
    if (touchPos.x < elementCenter.x && touchPos.y < elementCenter.y) {
        x = touchPos.x - elementCenter.x;
        y = elementCenter.y - touchPos.y;
    }

    if (x && y) {
        const angle = (Math.atan2(y, x) * 180) / Math.PI;
        const intensity = calculateIntensity({ x: x, y: y }, { x: 0, y: 0 }, radius);
        return {
            angle: angle,
            intensity: intensity,
        };
    }

    return {
        angle: 1,
        intensity: 1,
    };
}

export function calculateIntensity(touchPos: pos, elemCenter: pos, radius: number) {
    const distance = Math.hypot(touchPos.x, touchPos.y, elemCenter.x, elemCenter.y);
    const ratio = distance / radius;
    return ratio;
}

/*
right     |22.5| - |-22.5|
upright   |22.5| - |67.5|
up        |67.5| - |112.5|
upleft    |112.5| - |157.5|
left      |157.5| - |180| && |-180| - |-157.5|
downleft  |-157.5| - |-112.5|
down      |-112.5| - |-67.5|
downright  |-67.5| - |-22.5|
*/

export function calculateDirection(angle: number, intensity: number) {
    const base = 10;
    const pos: pos = {
        x: 0,
        y: 0,
    };
    switch (true) {
        //RIGHT
        case angle <= 22.5 && angle > -22.5:
            pos.x = Math.trunc(base * intensity);
            break;
        //UPRIGHT
        case angle > 22.5 && angle < 67.5:
            pos.x = Math.trunc(base * intensity);
            pos.y = Math.trunc(-base * intensity);
            break;
        //UP
        case angle >= 67.5 && angle < 112.5:
            pos.y = Math.trunc(-base * intensity);
            break;
        //UPLEFT
        case angle >= 112.5 && angle < 157.5:
            pos.x = Math.trunc(-base * intensity);
            pos.y = Math.trunc(-base * intensity);
            break;
        //LEFT
        case (angle >= 157.5 && angle <= 180) || (angle >= -180 && angle < -157.5):
            pos.x = Math.trunc(-base * intensity);
            break;
        //DOWNLEFT
        case angle >= -157.5 && angle < -112.5:
            pos.x = Math.trunc(-base * intensity);
            pos.y = Math.trunc(base * intensity);
            break;
        //DOWN
        case angle >= -112.5 && angle < -67.5:
            pos.y = Math.trunc(base * intensity);
            break;
        //DOWN RIGHT
        case angle >= -67.5 && angle <= -22.5:
            pos.x = Math.trunc(base * intensity);
            pos.y = Math.trunc(base * intensity);
            break;
    }

    return pos;
}
