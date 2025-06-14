import { Body } from "matter-js";

export class Systems {
    constructor(options) {
        const {
            game = null,
        } = options;

        this.game = game;

        this.customSystems = null;
        this.ecsSystems = null;

        this.start();
    }
    start() {
        this.customSystems = new CustomSystems(
            {
                game: this.game
            }
        );

        this.ecsSystems = new ECSSystems(
            {
                game: this.game
            }
        );

    }

}
class CustomSystems {
    constructor(options) {
        const {
            game = null
        } = options

        this.game = game;
    }
    addSceneRotation() {
        this.game.gameUtils.filterEntitiesByComponents(
            ['rotation', 'sceneOrientedRotation', 'baseRotation'],
            (e) => {
                if (!this.game.gameUtils.isEntityActive(e)) return;
                let baseRotation = e.getComponent('baseRotation');
                let rotation = 0;
                rotation = baseRotation + this.game.sceneRotation;
                e.setComponent('rotation', rotation);
            }
        )
    }
    setBaseRotation() {
        this.game.gameUtils.filterEntitiesByComponents(
            ['rotation', 'sceneOrientedRotation', 'baseRotation'],
            (e) => {
                if (!this.game.gameUtils.isEntityActive(e)) return;
                const rotation = e.getComponent('rotation');
                let baseRotation = 0;
                baseRotation = rotation - this.game.sceneRotation;

                e.setComponent('baseRotation', baseRotation)
            }
        );
    }
    debugMatterBodies() {
        if (!this.game.debugging.debugMatterBodies) return;

        this.game.gameUtils.filterEntitiesByComponents(
            ['pos', 'matterBody', 'matterBodyType', 'rotation'],
            (e) => {
                if (!this.game.gameUtils.isEntityActive(e)) return;
                //const pos = e.getComponent('pos');
                const body = e.getComponent('matterBody');
                const bodyType = e.getComponent('matterBodyType');
                const offset = e.getComponent('matterBodyOffset') || { x: 0, y: 0 };
                const color = e.getComponent('matterBodyColor') || 'white';
                const rotation = e.getComponent('rotation');
                //console.log(body.position);
                //console.log(body.position.x + offset.x)

                const ctx = this.game.ctx;

                switch (bodyType) {
                    case 'rectangle':
                        const bodyWidth = e.getComponent('matterBodyWidth');
                        const bodyHeight = e.getComponent('matterBodyHeight');

                        // --- Save the current context ---
                        ctx.save();

                        // --- Translate to center of the rectangle ---
                        const rotatedOffset = this.game.gameUtils.rotateOffset(offset, rotation)
                        ctx.translate(body.position.x + rotatedOffset.x, body.position.y + rotatedOffset.y);

                        // --- Rotate the context ---
                        ctx.rotate(body.angle);

                        // --- Draw the rectangle manually ---
                        ctx.fillStyle = color;
                        ctx.fillRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);

                        // --- Restore context to original (important) ---
                        ctx.restore();
                        break;

                    case 'circle':
                        const radius = e.getComponent('matterBodyRadius');

                        ctx.save();
                        ctx.translate(body.position.x + offset.x, body.position.y + offset.y);
                        ctx.beginPath();
                        ctx.arc(0, 0, radius, 0, Math.PI * 2);
                        ctx.fillStyle = color;
                        ctx.fill();

                        ctx.restore();

                        break;

                    default:
                        console.error("An unidentified shape type entered debugMatterBodies!");
                        break;
                }
            }
        );


    }
    drawSprite(e) {
        // grab them out
        const imgKey = e.getComponent('imgKey');
        const pos = e.getComponent('pos');
        const width = e.getComponent('width');
        const height = e.getComponent('height');
        const rotation = e.getComponent('rotation');
        const centerImage = e.getComponent('centerImage');
        //console.log(`rotation passed in drawSprites: ${rotation}`);
        // lookup your preloaded Image object
        const img = this.game.images[imgKey];
        if (!img) {
            console.warn(`No image for key "${imgKey}"`);
            return;
        }

        const shouldBlink = this.calculateShouldBlink(e);
        //console.log("SHOULD BLINK FROM DRAWSPRITE:",shouldBlink);

        // call your helper
        this.game.gameUtils.drawImage({
            img,
            pos,
            width,
            height,
            rotation,
            centerImage,
            shouldBlink
        });
    }
    traceMatterBodies() {// draws a line from center of screen to all body positions
        if (!this.game.debugging.debugMatterBodies) return
        const ctx = this.game.ctx;
        const color = 'red';
        this.game.gameUtils.filterEntitiesByComponents(
            ['matterBody'],
            (e) => {
                if (!this.game.gameUtils.isEntityActive(e)) return;
                const matterBody = e.getComponent('matterBody');

                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(this.game.screenCenterPos.x, this.game.screenCenterPos.y);
                ctx.lineTo(matterBody.position.x, matterBody.position.y);
                ctx.stroke();
            }
        );
    };
    DebugShootingDirection() {
        if (!this.game.debugging.debugShootDirection) return;
        this.game.gameUtils.filterEntitiesByComponents(
            ['rotation', 'pos', 'spawnPos', 'shootBullet'],
            (e) => {
                if (!this.game.gameUtils.isEntityActive(e)) return;
                //console.log(e);
                const rotation = e.getComponent('rotation');
                //const pos = e.getComponent('pos');
                const spawnPos = e.getComponent('spawnPos');

                //console.log("Spawn pos form debugShootingDirection",spawnPos);

                const length = 300;
                const ctx = this.game.ctx;
                ctx.strokeStyle = 'red';

                spawnPos.forEach((point) => {
                    const angleInRads = (rotation - 90) * (Math.PI / 180);
                    const endX = point.pos.x + Math.cos(angleInRads) * length;
                    const endY = point.pos.y + Math.sin(angleInRads) * length;

                    ctx.beginPath();
                    ctx.moveTo(point.pos.x, point.pos.y);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();

                });
            }
        )
    }
    trackPlayerRotation() {
        this.game.gameUtils.filterEntitiesByComponents(
            ['player', 'rotation'],
            (e) => {

                const rotation = e.getComponent('rotation');
                console.log("Player Rotation:", rotation)
            }
        )
    };
    depleteShootEnergy(e) {
        const shootEnergy = e.getComponent('shootEnergy');
        const shootBullet = e.getComponent('shootBullet');
        //const isPlayer = e.hasComponent('player');

        const current = shootEnergy.current;
        const depletionPerShot = shootEnergy.depletionPerShot;

        let newValue = current - depletionPerShot;
        if (newValue < 0) {
            newValue = 0;
            shootEnergy.isDepleted = true;
            shootBullet.active = false;
            this.game.gameUtils.playSfx('energyFinished');
        };

        shootEnergy.current = newValue;// assign it back
        shootEnergy.regenCooldown = shootEnergy.regenDelay;

        //if(isPlayer){

        //}
        //console.log("ShootEnergyNewValue", newValue);
        //console.log("ShootEnergyComponent", shootEnergy);

        e.setComponent('shootEnergy', shootEnergy);
        e.setComponent('shootBullet', shootBullet);

        this.game.ui.playerUi.updateEnergyBar();

    };
    drawBarEntity(e) {
        const ctx = this.game.ctx;
        const pos = e.getComponent('pos');
        const width = e.getComponent('width');
        const height = e.getComponent('height');
        const bar = e.getComponent('bar');

        const backgroundEnabled = bar.background.enabled;
        const outlineEnabled = bar.outline.enabled;
        const lerpingEnabled = bar.lerping.enabled;
        const flashEffectEnabled = bar.flashEffect.enabled;
        const x = pos.x;
        const y = pos.y;
        const w = width;
        const h = height;
        const fillAmount = bar.value / bar.maxValue * w;
        ctx.save();

        //background
        if (backgroundEnabled) {
            ctx.fillStyle = bar.background.color;
            ctx.fillRect(x, y, w, h);
        };
        //flash effect
        if (flashEffectEnabled) {
            ctx.fillStyle = bar.flashEffect.color;
            const prevValue = bar.flashEffect.prevValue;
            const targetValue = bar.flashEffect.targetValue;
            const step = bar.flashEffect.step;
            const value = this.game.gameUtils.lerp(prevValue, targetValue, step);
            bar.flashEffect.value = value;
            bar.flashEffect.prevValue = value;
            const flashFillAmount = value / bar.maxValue * w;
            ctx.fillRect(x, y, flashFillAmount, h);
            //console.log("FLASH VALUE",value);
        }
        //bar
        ctx.fillStyle = bar.fillColor;
        ctx.fillRect(x, y, fillAmount, h);

        //outline
        if (outlineEnabled) {
            ctx.strokeStyle = bar.outline.color;
            ctx.lineWidth = bar.outline.width;
            ctx.strokeRect(x, y, w, h);
        }
        ctx.restore();

        e.setComponent('bar', bar);
    };
    drawRectangle(e) {
        const ctx = this.game.ctx;
        const pos = e.getComponent('pos');
        const width = e.getComponent('width');
        const height = e.getComponent('height');
        const rectangleShape = e.getComponent('rectangleShape');
        const color = e.getComponent('shapeColor');
        //const alignment = e.getComponent('alignment');

        const x = pos.x;
        const y = pos.y;
        const w = width;
        const h = height;
        const isRoundedEnabled = rectangleShape.rounded.enabled;
        const isOutlineEnabled = rectangleShape.outline.enabled;

        //console.log("Entity:",e,"X:",pos.x);
        //console.log("Entity:",e,"Y:",pos.y);

        ctx.save();

        ctx.beginPath();
        //shape
        ctx.fillStyle = color;

        if (isRoundedEnabled) {
            const r = rectangleShape.rounded.radius;
            ctx.roundRect(x, y, w, h, r)
        }
        else {
            ctx.rect(x, y, w, h);
        }
        ctx.fill();

        //outline
        if (isOutlineEnabled) {
            ctx.strokeStyle = rectangleShape.outline.color;
            ctx.strokeWidth = rectangleShape.outline.width;
            ctx.strokeRect(x, y, w, h);
        }
        ctx.restore();
    };
    drawText(e) {
        const ctx = this.game.ctx;

        //console.log("Font system running");
        const pos = e.getComponent('pos');
        const color = e.getComponent('color');
        const size = e.getComponent('fontSize');
        const style = e.getComponent('style');
        const content = e.getComponent('fontContent');
        const anchoring = e.getComponent('anchoring');
        const x = pos.x;
        const y = pos.y;


        ctx.save();

        //console.log("Entity:",e,"X:",x);
        //console.log("Entity:",e,"Y:",y);
        ctx.textAlign = anchoring.anchorX;
        ctx.textBaseline = anchoring.anchorY;
        ctx.fillStyle = color;
        ctx.font = `${size}px ${style}`;
        ctx.fillText(content, x, y);

        ctx.restore();
    };
    debugBtnClickArea() {
        if (!this.game.debugging.debugUiClickBox) return;
        const ctx = this.game.ctx;
        this.game.gameUtils.filterEntitiesByComponents(
            ['pos', 'button'],
            (e) => {
                //console.log("DEBUG BTN CLICK SYSTEM RUNNING!");
                if (!this.game.gameUtils.isEntityActive(e)) return;
                const pos = e.getComponent('pos');
                const button = e.getComponent('button');

                const x = pos.x;
                const y = pos.y;
                const clickboxWidth = button.clickBoxWidth;
                const clickboxHeight = button.clickBoxHeight;

                const strokeColor = 'green';
                const strokeWidth = 5;

                ctx.save();

                ctx.beginPath();

                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = strokeWidth;

                ctx.rect(x, y, clickboxWidth, clickboxHeight);
                ctx.stroke();

                ctx.restore();

            }
        );
    };
    handleBtnTriggers() {
        //console.log("MOUSE PRESSED:",this.game.mouse.isPressed);
        //console.log("MOUSE RELEASED:",this.game.mouse.wasReleased);
        this.game.gameUtils.filterEntitiesByComponents(
            ['pos', 'button'],
            (e) => {
                if (!this.game.gameUtils.isEntityActive(e)) return;

                const pos = e.getComponent('pos');
                const button = e.getComponent('button');

                const buttonLayer = e.getComponent('orderingLayer') || 0;

                // Skip this button if something higher blocks the click
                if (this.game.gameUtils.isEntityBlockingMouseInput(pos.x, pos.y, buttonLayer)) {
                    return;
                }

                const x = pos.x;
                const y = pos.y;
                const w = button.clickBoxWidth;
                const h = button.clickBoxHeight;
                const mouse = this.game.mouse;

                const isMouseOver = this.game.gameUtils.isMouseOver(x, y, w, h);

                //onsole.log("MOUSE OVER:",isMouseOver);

                //Hover logic
                if (isMouseOver && button.onHover) {
                    button.isHovered = true;
                    this.game.canvas.style.cursor = 'pointer';
                    this.game.gameUtils.setMouseHoveredEntity(e);
                    const hoverFunction = button.onHover;
                    if (typeof hoverFunction === 'function') {
                        hoverFunction();
                    }
                    //console.log("BUTTON HOVERED");
                };

                //Unhover
                if (button.isHovered && !isMouseOver) {
                    button.isHovered = false;
                    this.game.canvas.style.cursor = 'default';
                    this.game.gameUtils.resetMouseHoveredEntity();
                    const onHoverReleasedFunction = button.onHoverReleased;
                    if (typeof onHoverReleasedFunction === 'function') {
                        onHoverReleasedFunction();
                    }
                    console.log("Hover Ended!!");
                }

                // Press logic
                if (mouse.isPressed && !button.isPressed) {
                    button.isPressed = true;
                    if (isMouseOver && button.onPress) {
                        const pressFunction = button.onPress;
                        if (typeof pressFunction === 'function') {
                            pressFunction();
                        }
                    }
                    console.log("BUTTON PRESSED");
                };

                // Release logic
                if (!mouse.isPressed && button.isPressed) {
                    button.isPressed = false;
                    if (isMouseOver && button.onRelease) {
                        const releaseFunction = button.onRelease;
                        if (typeof releaseFunction === 'function') {
                            releaseFunction();
                        }
                        console.log("BUTTON RELEASED");
                    }
                };

                mouse.reset();
            }
        );
    };
    drawAllEntities() {
        const allEntities = [];

        // Gather all drawable entities
        this.game.gameUtils.filterEntitiesByComponents(['drawType'], (e) => {
            if (this.game.gameUtils.isEntityActive(e)) {
                if (e.name === 'parallax') console.log("PARALLAX ENTITY IN DRAW ALL ENTITIES FILTER");
                allEntities.push(e);
            }
        });

        // Build a map of children
        const parentToChildren = new Map();
        const rootEntities = [];

        for (const entity of allEntities) {
            const parent = entity.getComponent('parent');
            if (parent && allEntities.includes(parent)) {
                if (!parentToChildren.has(parent)) {
                    parentToChildren.set(parent, []);
                }
                parentToChildren.get(parent).push(entity);
            } else {
                rootEntities.push(entity);
            }
        }

        // Sort by orderingLayer at the top level
        rootEntities.sort((a, b) => {
            return (a.getComponent('orderingLayer') || 0) - (b.getComponent('orderingLayer') || 0);
        });

        // Recursively flatten draw order
        const flattenedDrawList = [];

        const addEntityAndChildren = (entity) => {
            flattenedDrawList.push(entity);

            const children = parentToChildren.get(entity);
            if (children) {
                // Sort children by orderingLayer if they override it
                children.sort((a, b) => {
                    const aOrder = a.getComponent('orderingLayer') ?? entity.getComponent('orderingLayer') ?? 0;
                    const bOrder = b.getComponent('orderingLayer') ?? entity.getComponent('orderingLayer') ?? 0;
                    return aOrder - bOrder;
                });

                for (const child of children) {
                    addEntityAndChildren(child);
                }
            }
        };

        for (const root of rootEntities) {
            addEntityAndChildren(root);
        }

        // Draw in calculated order
        for (const e of flattenedDrawList) {
            const type = e.getComponent("drawType");
            switch (type) {
                case "sprite":
                    this.drawSprite(e);
                    break;
                case "rectangle":
                    this.drawRectangle(e);
                    break;
                case "bar":
                    this.drawBarEntity(e);
                    break;
                case "text":
                    this.drawText(e);
                    break;
                default:
                    console.warn("Unknown drawType:", type);
            }
        };

    };
    traceLocalPositions() {
        if (!this.game.debugging.debugLocalPos) return;
        //console.log("TRACE LOCAL POS RUNNING");
        const ctx = this.game.ctx;
        this.game.gameUtils.filterEntitiesByComponents(
            ['localPos', 'parent'],
            (e) => {
                if (!this.game.gameUtils.isEntityActive(e)) return;

                const globalPos = this.game.gameUtils.getGlobalFromLocalPos(e);
                const center = this.game.screenCenterPos;

                ctx.save();

                ctx.beginPath();

                ctx.strokeStyle = 'green';

                ctx.moveTo(center.x, center.y);
                ctx.lineTo(globalPos.x, globalPos.y);

                ctx.stroke();

                ctx.restore();
            }
        );
    };
    calculateShouldBlink(e) {
        const invincibilityComponent = e.getComponent('invincibility');
        if (invincibilityComponent && invincibilityComponent.active) {
            const blinkDelay = invincibilityComponent.blinkDelay;
            let blinkCounter = invincibilityComponent.blinkCounter || 0;
            let shouldBlink = false;

            if (blinkCounter > 0) {
                blinkCounter -= this.game.deltaTime;
            }
            else {
                blinkCounter = blinkDelay;
                shouldBlink = true;
            }
            invincibilityComponent.blinkCounter = blinkCounter;
            e.setComponent('invincibility', invincibilityComponent);
            //console.log("BLINK COUNTER:", blinkCounter)
            //console.log("BLINK COMPONENT DATA:", invincibilityComponent.blinkCounter, invincibilityComponent.blinkDelay);

            return shouldBlink;
        };
    }

}
class ECSSystems {
    constructor(options) {
        const {
            game = null,
        } = options;

        this.game = game;
    }
    changeBodyRotationSystem() {
        const engine = this.game.ecs.entityEngine;
        engine.system('rotationMatterBodies', ['rotation', 'matterBody', 'matterBodyType'], (entity, {
            rotation, matterBody, matterBodyType
        }) => {
            if (!this.game.gameUtils.isEntityActive(entity)) return;
            const typesToRotate = ['rectangle'];
            if (!typesToRotate.includes(matterBodyType)) return;
            const rotationInRadians = rotation * (Math.PI / 180);
            Body.setAngle(matterBody, rotationInRadians);
            //console.log(`entity rotation ${rotation}`);
        });
    }

    movePlayerSystem() {
        const engine = this.game.ecs.entityEngine;
        engine.system('movePlayer', ['player', 'speed', 'moveVector', 'pos', 'matterBody'],
            (entity, { player, speed, moveVector, pos, matterBody, }) => {
                if (!this.game.gameUtils.isEntityActive(entity)) return;
                //console.log("Plaayer move system running");
                const mouseX = this.game.mouse.pos.x;
                const mouseY = this.game.mouse.pos.y;
                const playerX = pos.x;
                const playerY = pos.y;

                let moveVectorX = mouseX - playerX;
                let moveVectorY = mouseY - playerY;
                const distance = Math.hypot(moveVectorX, moveVectorY);

                // Avoid division by zero
                if (distance > 50) {
                    const maxSpeed = speed;
                    const speedFactor = Math.min(distance / 20, 1); // Smoothly slow near target
                    const targetSpeed = maxSpeed * speedFactor;

                    moveVectorX /= distance;
                    moveVectorY /= distance;

                    Body.setVelocity(matterBody, {
                        x: moveVectorX * targetSpeed,
                        y: moveVectorY * targetSpeed,
                    });
                } else {
                    Body.setVelocity(matterBody, { x: 0, y: 0 });
                }

                pos.x = matterBody.position.x;
                pos.y = matterBody.position.y;
                entity.setComponent('moveVector', { x: moveVectorX, y: moveVectorY });
                entity.setComponent('pos', pos);
            }
        );
    }
    moveEntitiesSystem() {
        const engine = this.game.ecs.entityEngine;

        engine.system('moveObjects', ['pos', 'rotation', 'matterBody', 'speed', 'movementType', 'notPlayer'],
            (entity, { pos, rotation, matterBody, speed, movementType }) => {
                if (!this.game.gameUtils.isEntityActive(entity)) return;

                const movementState = entity.getComponent('movementState') || {};
                let moveVector = { x: 0, y: 0 };

                switch (movementType) {
                    case 'straight': {
                        const rad = rotation * (Math.PI / 180);
                        moveVector = {
                            x: Math.sin(rad),
                            y: -Math.cos(rad)
                        };
                        break;
                    }

                    case 'wander': {
                        if (!movementState.target || this.reachedTarget(pos, movementState.target)) {
                            movementState.target = this.getRandomScreenPos();
                        }
                        moveVector = this.getDirectionTo(pos, movementState.target);
                        break;
                    }

                    case 'patrol': {
                        moveVector = this.getPatrolVector(pos, movementState);
                        break;
                    }

                    case 'diagonalEdge': {
                        moveVector = this.getEdgeDiagonalVector(this.game.totalSceneRotation);
                        break;
                    }

                    default:
                        return;
                }

                // Normalize + Apply EPSILON cutoff
                const len = Math.hypot(moveVector.x, moveVector.y) || 1;
                moveVector.x /= len;
                moveVector.y /= len;

                const EPSILON = 0.0001;
                if (Math.abs(moveVector.x) < EPSILON) moveVector.x = 0;
                if (Math.abs(moveVector.y) < EPSILON) moveVector.y = 0;

                // Apply physics velocity
                Body.setVelocity(matterBody, {
                    x: moveVector.x * speed,
                    y: moveVector.y * speed
                });

                // Update pos + components
                pos.x = matterBody.position.x;
                pos.y = matterBody.position.y;
                entity.setComponent('pos', pos);
                entity.setComponent('moveVector', moveVector);
                entity.setComponent('movementState', movementState);
            }
        );
    }
    getDirectionTo(from, to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.hypot(dx, dy) || 1;
        return { x: dx / len, y: dy / len };
    }

    reachedTarget(pos, target, threshold = 10) {
        return Math.hypot(pos.x - target.x, pos.y - target.y) < threshold;
    }

    getRandomScreenPos() {
        return {
            x: Math.random() * this.game.canvasWidth,
            y: Math.random() * this.game.canvasHeight
        };
    }

    getPatrolVector(pos, state) {
        // Example: back and forth horizontally on top edge
        const patrolRange = { min: 100, max: this.game.width - 100 };
        if (!state.direction) state.direction = 1;

        if ((pos.x < patrolRange.min && state.direction < 0) ||
            (pos.x > patrolRange.max && state.direction > 0)) {
            state.direction *= -1;
        }

        return { x: state.direction, y: 0 };
    }

    getEdgeDiagonalVector(sceneRotation) {
        switch (sceneRotation) {
            case 0: return { x: 1, y: -1 };
            case 90: return { x: -1, y: -1 };
            case 180: return { x: -1, y: 1 };
            case 270: return { x: 1, y: 1 };
            default: {
                const rad = sceneRotation * (Math.PI / 180);
                return {
                    x: Math.cos(rad),
                    y: Math.sin(rad)
                };
            }
        }
    }

    shootBulletsSystem() {
        const engine = this.game.ecs.entityEngine;
        engine.system('shootBullets', ['pos', 'shootBullet', 'rotation', 'spawnPos', 'shootTimes'],
            (entity, { pos, shootBullet, rotation, spawnPos, shootTimes, }) => {
                if (!this.game.gameUtils.isEntityActive(entity)) return;
                //console.log("Rotation from shootBullets System:",rotation);

                // ✅ Always update spawn positions
                spawnPos.forEach((point) => {
                    const rotated = this.game.gameUtils.rotateOffset(point.offset, rotation);
                    point.pos.x = pos.x + rotated.x;
                    point.pos.y = pos.y + rotated.y;
                });

                // ❌ Don't spawn bullets if not active
                if (!shootBullet.active) return;

                // ✅ Countdown timer
                if (shootBullet.counter > 0) {
                    shootBullet.counter -= this.game.deltaTime;
                    entity.setComponent('shootBullet', shootBullet);
                    return;
                }


                const playerComp = entity.hasComponent('player');
                let shotByPlayer = false;
                let matterBodyOptions = {};

                if (playerComp) {// exists
                    shotByPlayer = true
                }

                if (shotByPlayer) {
                    this.game.ecs.customSystems.depleteShootEnergy(entity);
                    matterBodyOptions = {
                        label: "playerBullet",
                        collisionFilter: {
                            category: this.game.collisionCategories.playerBulletCategory,
                            mask: this.game.collisionCategories.enemyCategory
                        }
                    };
                    this.game.gameUtils.playPlayerShootSound();
                }
                else {
                    matterBodyOptions = {
                        label: "enemyBullet",
                        collisionFilter: {
                            category: this.game.collisionCategories.enemyBulletCategory,
                            mask: this.game.collisionCategories.playerCategory
                        }
                    };
                }

                // ✅ Actually spawn bullets now
                let remainingShots = shootTimes; // clone so `forEach` isn't blocked by early return
                spawnPos.forEach((point) => {
                    if (remainingShots <= 0) return;

                    const bullet = this.game.gameUtils.spawnEntity({
                        passedKey: shootBullet.spawnKey,
                        componentsToModify: {
                            pos: {
                                x: point.pos.x,
                                y: point.pos.y
                            },
                            rotation: rotation,
                            baseRotation: rotation,
                            matterBodyOptions: matterBodyOptions,
                        }
                    });

                    //this.game.assignParent(bullet,this.game.sceneEntity);

                    remainingShots--;
                });

                shootBullet.counter = shootBullet.delayInSeconds;
                entity.setComponent('shootBullet', shootBullet);
            }
        );
    };
    manageShootEnergySystem() {
        const engine = this.game.ecs.entityEngine;

        engine.system('manageShootEnergySystem', ['shootEnergy', 'shootBullet']
            , (entity, { shootEnergy, shootBullet, }) => {
                if (!this.game.gameUtils.isEntityActive(entity)) return;
                const delta = this.game.deltaTime;

                const fireActive = shootBullet.active;
                let energy = shootEnergy.current;
                const max = shootEnergy.max;
                const regenRate = shootEnergy.regenRate;
                const isPlayer = entity.hasComponent('player');

                // Handle regeneration delay cooldown
                if (shootEnergy.isDepleted) {
                    if (shootEnergy.regenCooldown > 0) {
                        shootEnergy.regenCooldown -= delta;
                        entity.setComponent('shootEnergy', shootEnergy);
                        return; // Still waiting before regen starts
                    }
                }

                // Can only regen if not firing and not over max
                if (!fireActive && energy < max) {
                    energy += regenRate * delta;

                    if (energy > max) {
                        energy = max;
                    }

                    shootEnergy.current = energy;

                    // Fully recharged → no longer depleted
                    if (shootEnergy.isDepleted && energy >= max) {
                        shootEnergy.isDepleted = false;
                        if (isPlayer) {
                            if (this.game.player.isFireHeld) {
                                const shootBullet = entity.getComponent('shootBullet');
                                shootBullet.active = true;
                                entity.setComponent('shootBullet', shootBullet);
                            }
                        }
                    }

                    entity.setComponent('shootEnergy', shootEnergy);
                }
            });
    }
    playerEnergyBarColorSystem() {
        const engine = this.game.ecs.entityEngine;
        engine.system('playerEnergyBarColorSystem', ['player', 'shootEnergy'],
            (entity, { player, shootEnergy }) => {
                //console.log("ShootEnergy In PlayerEnergyBar:", shootEnergy);
                if (shootEnergy.isDepleted) {
                    const depletedColor = 'rgb(44, 6, 50)';
                    const energyBarEntity = this.game.ui.playerUi.energyBarEntity;
                    const barComponent = energyBarEntity.getComponent('bar');
                    barComponent.fillColor = depletedColor;
                    energyBarEntity.setComponent('bar', barComponent);
                }
                else {
                    const energyBarEntity = this.game.ui.playerUi.energyBarEntity;
                    const barComponent = energyBarEntity.getComponent('bar');
                    barComponent.fillColor = 'purple';
                    energyBarEntity.setComponent('bar', barComponent);
                }
            }
        )
    };
    handleLocalPosSystem() {
        const engine = this.game.ecs.entityEngine;

        engine.system('handleLocalPosSystem', ['pos', 'localPos', 'parent'], (entity, { pos, localPos, parent }) => {
            if (!this.game.gameUtils.isEntityActive(entity)) return;
            const parentPos = parent.getComponent('pos');
            const calculatedLocalPos = {  // subtract global pos from parent pos
                x: pos.x - parentPos.x,
                y: pos.y - parentPos.y
            };

            localPos = calculatedLocalPos;

            entity.setComponent('localPos', localPos);

            //console.log("ENTITY NAME:", entity.name, "LOCAL POS:", localPos);
        });
    };
    handleInvincibilityCounterSystem() {
        const engine = this.game.ecs.entityEngine;

        engine.system('handleInvincibilityCounterSystem', ['invincibility'], (entity, { invincibility }) => {
            if (!this.game.gameUtils.isEntityActive(entity)) return;

            if (!invincibility.active) return;

            if (invincibility.invincibilityCounter > 0) {
                invincibility.invincibilityCounter -= this.game.deltaTime;
            }
            else {
                invincibility.active = false;// the counter is resetted in activatedInvincibility()
            };

            entity.setComponent('invincibility', invincibility);
        });
    };
    destroyOutOfBoundsEntitiesSystem() {
        const engine = this.game.ecs.entityEngine;

        engine.system('destroyOutOfBoundsEntitiesSystem', ['pos', 'destroyOutOfBounds'], (entity, { pos, destroyOutOfBounds }) => {
            if (!this.game.gameUtils.isEntityActive(entity)) return;

            const offset = 200;

            if (this.game.gameUtils.isOutOfScreenBounds(entity, offset)) {
                this.game.gameUtils.removeEntity(entity);
                //console.log("Entity out of bounds!",entity);
            }
        });
    }

}
