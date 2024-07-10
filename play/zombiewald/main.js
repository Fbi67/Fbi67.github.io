import * as THREE from "three";
import { PointerLockControls } from "./lib/PointerLockControls.js";
import { GLTFLoader } from "./lib/GLTFLoader.js";

let camera, scene, renderer, controls;
const objects = [];
const zombies = [];
const zombienumber = 10;
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const balls = [];
const leben = 10;

const Func = {
  loadModel(file) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        `./assets/models/${file}`,
        function (gltf) {
          const model = gltf.scene;
          scene.add(model);
          resolve(model);
        },
        undefined,
        function (error) {
          reject(error);
        }
      );
    });
  },

  addSound(file, loop, volume) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("./assets/audios/" + file, function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(loop);
      sound.setVolume(volume);
      sound.play();
    });
  },

  onKeyDown(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;
      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;
      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  },

  onKeyUp(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;
      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;
      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  },

  shootBall() {
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);

    ball.position.copy(camera.position);

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    ball.userData.velocity = direction.multiplyScalar(100);
    ball.userData.startPosition = ball.position.clone();
    Func.addSound("pistole.mp3", false, 1);
    scene.add(ball);
    balls.push(ball);
  },

  onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  endGame() {
    const blocker = document.getElementById("blocker");
    const instructions = document.getElementById("instructions");
    instructions.style.display = "block";
    document.getElementById("title").innerHTML = "Game Over";
    document.getElementById("text").innerHTML = "Game Over!";
    blocker.style.display = "flex";
    controls.unlock();
    blocker.removeEventListener("click", function () {
      controls.lock();
    });
    document.removeEventListener("click", Func.shootBall);
  },

  win() {
    const blocker = document.getElementById("blocker");
    const instructions = document.getElementById("instructions");
    instructions.style.display = "block";
    document.getElementById("title").innerHTML = "You Win!";
    document.getElementById("text").innerHTML = "You Win!";
    blocker.style.display = "flex";
    controls.unlock();
    blocker.removeEventListener("click", function () {
      controls.lock();
    });
    document.removeEventListener("click", Func.shootBall);
  },

  addTree(x, y, z) {
    const loader = new GLTFLoader();

    loader.load(
      "./assets/models/pine_tree.glb",
      function (gltf) {
        gltf.scene.position.set(x, y, z);
        scene.add(gltf.scene);
        objects.push(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  },

  addZombie(x, y, z) {
    const loader = new GLTFLoader();

    loader.load(
      "./assets/models/zombie.glb",
      function (gltf) {
        gltf.scene.position.set(x, y, z);
        gltf.scene.scale.set(2, 2, 2); // Zombie vergrößern

        // Erstellen eines unsichtbaren Würfels für den Kopf des Zombies
        const headSize = 1; // Größe des Kopfwürfels anpassen
        const headGeometry = new THREE.BoxGeometry(
          headSize,
          headSize,
          headSize
        );
        const headMaterial = new THREE.MeshBasicMaterial({
          visible: false,
        }); // Unsichtbares Material
        const headCollider = new THREE.Mesh(headGeometry, headMaterial);
        headCollider.position.set(0, 1, 0); // Position des Kopfwürfels anpassen (abhängig von der Zombie-Geometrie)
        gltf.scene.add(headCollider); // Kopfwürfel zur Zombie-Szene hinzufügen

        gltf.scene.userData = {
          velocity: new THREE.Vector3(),
          state: "idle",
          leben: leben,
          headCollider: headCollider, // Kopfwürfel als Teil der Benutzerdaten speichern
        };

        scene.add(gltf.scene);
        zombies.push(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  },

  addCamera() {
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.y = 10;
    camera.position.z = 20;
  },

  addControls() {
    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById("blocker");
    const instructions = document.getElementById("instructions");

    blocker.addEventListener("click", function () {
      controls.lock();
    });

    controls.addEventListener("lock", function () {
      instructions.style.display = "none";
      blocker.style.display = "none";
    });

    controls.addEventListener("unlock", function () {
      blocker.style.display = "flex";
      instructions.style.display = "block";
    });

    scene.add(controls.getObject());
  },
};

function init() {
  Func.addCamera();
  scene = new THREE.Scene();
  const loader = new THREE.TextureLoader();
  loader.load("./assets/img/wallpaper.jpg", function (texture) {
    scene.background = texture;
  });

  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 2.5);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  for (let i = 0; i < 100; i++) {
    Func.addTree(
      Func.getRandomInt(-1000, 1000),
      -10,
      Func.getRandomInt(-1000, 1000)
    );
  }

  for (let i = 0; i < zombienumber; i++) {
    Func.addZombie(
      Func.getRandomInt(-1000, 1000),
      0,
      Func.getRandomInt(-1000, 1000)
    );
  }

  document.addEventListener("keydown", Func.onKeyDown);
  document.addEventListener("keyup", Func.onKeyUp);
  document.addEventListener("click", Func.shootBall);

  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x007700 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.name = "floor";
  scene.add(floor);
  objects.push(floor);
  Func.addSound("hintergrund.ogg", true, 0.5);
  Func.addControls();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", Func.onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);
    const onObject = intersections.length > 0;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // Ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 800.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 800.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // New behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;
      canJump = true;
    }
  }

  // Update balls
  balls.forEach((ball, index) => {
    ball.position.add(ball.userData.velocity.clone().multiplyScalar(delta));

    if (ball.position.distanceTo(ball.userData.startPosition) > 200) {
      scene.remove(ball);
      balls.splice(index, 1);
    } else {
      const ballRaycaster = new THREE.Raycaster(
        ball.position,
        ball.userData.velocity.clone().normalize()
      );
      const intersections = ballRaycaster.intersectObjects(
        zombies.map((zombie) => zombie.userData.headCollider),
        false
      ); // Überprüfe Kollisionen mit Kopfwürfeln der Zombies
      if (intersections.length > 0) {
        const target = intersections[0].object.parent; // Erhalte das Elternelement des Kopfwürfels (der Zombie)
        if (target.userData.leben === 0) {
          scene.remove(target); // Entferne den getroffenen Zombie aus der Szene
          zombies.splice(zombies.indexOf(target), 1); // Entferne den Zombie aus dem Zombies-Array
        } else {
          target.userData.leben--; // Zombie verliert Leben
        }

        scene.remove(ball);
        balls.splice(index, 1);

        // Check win condition
        if (zombies.length === 0) {
          Func.win();
        }
      }
    }
  });

  // Update zombies
  zombies.forEach((zombie) => {
    const zombieDirection = new THREE.Vector3();
    zombieDirection.subVectors(camera.position, zombie.position).normalize();

    const distanceToPlayer = zombie.position.distanceTo(camera.position);
    if (distanceToPlayer > 2) {
      zombie.position.add(zombieDirection.multiplyScalar(delta * 14));
    } else {
      Func.endGame();
    }
  });

  prevTime = time;
  renderer.render(scene, camera);
}

init();
animate();
