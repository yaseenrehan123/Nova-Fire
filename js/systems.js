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
        const req = ['rotation', 'sceneOrientedRotation', 'baseRotation'];
        const entities = Object.values(this.game.ecs.entityEngine.entities);

        for (let e of entities) {
            if (!req.every(c => e.hasComponent(c))) continue;

            let baseRotation = e.getComponent('baseRotation');
            let rotation = 0;
            rotation = baseRotation + this.game.sceneRotation;
            e.setComponent('rotation', rotation);
        }
    }
    setBaseRotation() {
        const req = ['rotation', 'sceneOrientedRotation', 'baseRotation'];
        const entities = Object.values(this.game.ecs.entityEngine.entities);
        for (let e of entities) {
            if (!req.every(c => e.hasComponent(c))) continue;
            const rotation = e.getComponent('rotation');
            let baseRotation = 0;
            baseRotation = rotation - this.game.sceneRotation;

            e.setComponent('baseRotation', baseRotation)// set base rotation to rotation
        }
    }
    debugMatterBodies() {
        if (this.game.matter.debugBodies) {
            //const builder = this.shapeBuilder.builder;
            //builder.clear();

            const req = ['pos', 'matterBody', 'matterBodyType', 'rotation'];
            const entities = Object.values(this.game.ecs.entityEngine.entities);

            for (let e of entities) {
                if (!req.every(c => e.hasComponent(c))) continue;

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
                        const rotatedOffset = this.game.rotateOffset(offset, rotation)
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
        }

    }
    drawSprites() {
        const req = ['imgKey', 'pos', 'width', 'height', 'rotation', 'centerImage'];
        const entities = Object.values(this.game.ecs.entityEngine.entities);

        for (let e of entities) {
            // only draw if it has every required component
            if (!req.every(c => e.hasComponent(c))) continue;

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
                continue;
            }

            // call your helper
            this.game.drawImage({
                img,
                pos,
                width,
                height,
                rotation,
                centerImage
            });
        }


    }
    traceMatterBodies() {// draws a line from center of screen to all body positions
        if (!this.game.matter.debugBodies) return
        const req = ['matterBody'];
        const entities = Object.values(this.game.ecs.entityEngine.entities);

        const ctx = this.game.ctx;
        const color = 'red';

        for (let e of entities) {
            // only draw if it has every required component
            if (!req.every(c => e.hasComponent(c))) continue;

            const matterBody = e.getComponent('matterBody');

            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(this.game.screenCenterPos.x, this.game.screenCenterPos.y);
            ctx.lineTo(matterBody.position.x, matterBody.position.y);
            ctx.stroke();
        }
    };
    DebugShootingDirection() {
        const req = ['rotation', 'pos', 'spawnPos', 'shootBullet'];
        const entities = Object.values(this.game.ecs.entityEngine.entities);

        for (let e of entities) {

            if (!req.every(c => e.hasComponent(c))) continue;

            const rotation = e.getComponent('rotation');
            const pos = e.getComponent('pos');
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
    }
    trackPlayerRotation() {
        const req = ['player', 'rotation'];
        const entities = Object.values(this.game.ecs.entityEngine.entities);

        for (let e of entities) {

            if (!req.every(c => e.hasComponent(c))) continue;

            const rotation = e.getComponent('rotation');
            console.log("Player Rotation:", rotation)
        }
    };
    depleteShootEnergy(e) {
        const req = ['shootEnergy', 'shootBullet'];

        if (!req.every(c => e.hasComponent(c))) return;

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
        };

        shootEnergy.current = newValue;// assign it back
        shootEnergy.regenCooldown = shootEnergy.regenDelay;

        //if(isPlayer){

        //}
        console.log("ShootEnergyNewValue", newValue);
        console.log("ShootEnergyComponent", shootEnergy);

        e.setComponent('shootEnergy', shootEnergy);
        e.setComponent('shootBullet', shootBullet);

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
            (entity, { player, speed, moveVector, pos, matterBody }) => {
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
    moveEntitiesSystem() {//used to move all entities 
        const engine = this.game.ecs.entityEngine;
        engine.system('moveObjects', ['pos', 'rotation', 'matterBody', 'moveVector', 'speed', 'notPlayer'],
            (entity, { pos, rotation, matterBody, moveVector, speed, notPlayer }) => {
                const rad = rotation * (Math.PI / 180)
                //console.log(`${entity.name} + ${pos.x}`)
                moveVector = {
                    x: Math.sin(rad),
                    y: -Math.cos(rad)
                };

                const EPSILON = 0.0001;
                if (Math.abs(moveVector.x) < EPSILON) moveVector.x = 0;
                if (Math.abs(moveVector.y) < EPSILON) moveVector.y = 0;

                //console.log(moveVector);

                Body.setVelocity(matterBody, {
                    x: moveVector.x * speed,
                    y: moveVector.y * speed
                });

                pos.x = matterBody.position.x;
                pos.y = matterBody.position.y;

                entity.setComponent('moveVector', moveVector);
                entity.setComponent('pos', pos);
            }
        )
    };
    shootBulletsSystem() {
        const engine = this.game.ecs.entityEngine;
        engine.system('shootBullets', ['pos', 'shootBullet', 'rotation', 'spawnPos', 'shootTimes',],
            (entity, { pos, shootBullet, rotation, spawnPos, shootTimes }) => {

                //console.log("Rotation from shootBullets System:",rotation);

                // ✅ Always update spawn positions
                spawnPos.forEach((point) => {
                    const rotated = this.game.rotateOffset(point.offset, rotation);
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

                this.game.ecs.customSystems.depleteShootEnergy(entity);

                const playerComp = entity.hasComponent('player');
                let shotByPlayer = false;
                let matterBodyOptions = {};

                if (playerComp) {// exists
                    shotByPlayer = true
                }

                if (shotByPlayer) {
                    matterBodyOptions = {
                        label: "playerBullet",
                        isSensor: false,
                        collisionFilter: {
                            group: 0,
                            category: this.game.collisionCategories.playerBulletCategory,
                            mask: this.game.collisionCategories.enemyCategory
                        }
                    };
                }
                else {
                    matterBodyOptions = {
                        label: "enemyBullet",
                        isSensor: true,
                        collisionFilter: {
                            group: -1,
                            category: this.game.collisionCategories.enemyBulletCategory,
                            mask: this.game.collisionCategories.playerCategory
                        }
                    };
                }

                // ✅ Actually spawn bullets now
                let remainingShots = shootTimes; // clone so `forEach` isn't blocked by early return
                spawnPos.forEach((point) => {
                    if (remainingShots <= 0) return;

                    this.game.spawnEntity({
                        passedKey: shootBullet.spawnKey,
                        componentsToModify: {
                            pos: {
                                x: point.pos.x,
                                y: point.pos.y
                            },
                            rotation: rotation,
                            baseRotation: rotation,
                            matterBodyOptions: matterBodyOptions
                        }
                    });

                    remainingShots--;
                });

                shootBullet.counter = shootBullet.delayInSeconds;
                entity.setComponent('shootBullet', shootBullet);
            }
        );
    };
    manageShootEnergySystem() {
        const engine = this.game.ecs.entityEngine;

        engine.system('manageShootEnergySystem', ['shootEnergy', 'shootBullet'], (entity, { shootEnergy, shootBullet }) => {
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
                console.log("ShootEnergy In PlayerEnergyBar:", shootEnergy);
                if (shootEnergy.isDepleted) {
                    this.game.ui.playerUi.energyBar.setFillColor('rgb(44, 6, 50)');
                }
                else {
                    this.game.ui.playerUi.energyBar.setFillColor('purple');
                }
            }
        )
    }

}
