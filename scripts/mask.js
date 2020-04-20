//build the 3D. called once when Jeeliz Face Filter is OK
function init(spec) {
  const threeStuffs = THREE.JeelizHelper.init(spec, null);

  // IMPORT THE GLTF MODEL:
  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.load(
    // "https://mbkassets.s3-eu-west-1.amazonaws.com/dev/ar/ad_glasses.glb",
    "./glTF3/scene.gltf",
    function (gltf) {
      const ambientLight = new THREE.AmbientLight(0xffffff);
      const pointLight = new THREE.DirectionalLight(0xffffff, 1);

      gltf.scene; // THREE.Scene
      gltf.scene.add(ambientLight);
      gltf.scene.add(pointLight);
      // gltf.animations; // Array<THREE.AnimationClip>
      // gltf.scenes; // Array<THREE.Scene>
      // gltf.cameras; // Array<THREE.Camera>
      // gltf.asset; // Object
      // console.log(gltf);

      gltf.scene.scale.multiplyScalar(10);
      gltf.scene.rotation.set(0, 0, 0);
      gltf.scene.position.set(0, -0.5, 1);

      threeStuffs.faceObject.add(gltf.scene);
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    }
  );

  //CREATE THE CAMERA
  THREECAMERA = THREE.JeelizHelper.create_camera();
} //end init()

//entry point, launched by body.onload():
function main() {
  JeelizResizer.size_canvas({
    canvasId: "jeeFaceFilterCanvas",
    isFullScreen: true,
    callback: start,
    onResize: function () {
      THREE.JeelizHelper.update_camera(THREECAMERA);
    },
  });
}

function start() {
  JEEFACEFILTERAPI.init({
    videoSettings: {
      //increase the default video resolution since we are in full screen
      idealWidth: 1280, //ideal video width in pixels
      idealHeight: 800, //ideal video height in pixels
      maxWidth: 1920, //max video width in pixels
      maxHeight: 1920, //max video height in pixels
    },
    followZRot: false,
    canvasId: "jeeFaceFilterCanvas",
    NNCpath: "./jeeliz/NNC.json", //root of NNC.json file

    callbackReady: function (errCode, spec) {
      if (errCode) {
        console.log("AN ERROR HAPPENS. SORRY BRO :( . ERR =", errCode);
        return;
      }

      console.log("INFO : JEEFACEFILTERAPI IS READY");
      init(spec);
    }, //end callbackReady()

    //called at each render iteration (drawing loop):
    callbackTrack: function (detectState) {
      THREE.JeelizHelper.render(detectState, THREECAMERA);
    },
  }); //end JEEFACEFILTERAPI.init call
} //end start()
