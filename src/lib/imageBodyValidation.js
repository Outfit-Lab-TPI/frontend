import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs"; 
import "@tensorflow/tfjs-backend-webgl";

let modeloPersonas = null;
let modeloPose = null;
let modelosCargandose = null;

export async function cargarModelosSiNoEstan() {
  if (modelosCargandose) return modelosCargandose; // si ya se está cargando, esperar la misma promesa

  modelosCargandose = (async () => {
    await tf.ready();

    if (tf.getBackend() !== "webgl") {
      await tf.setBackend("webgl");
      await tf.ready();
    }

    console.log("Backend inicializado:", tf.getBackend());

    if (!modeloPersonas) {
      console.log("Cargando modelo COCO...");
      modeloPersonas = await cocoSsd.load();
      console.log("Modelo COCO cargado");
    }

    if (!modeloPose) {
      console.log("Cargando modelo MoveNet...");
      modeloPose = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
        }
      );
      console.log("Modelo MoveNet cargado");
    }
  })();

  return modelosCargandose;
}

function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function validateCustomImageLogic(file) {
  try {
    await cargarModelosSiNoEstan();

    const img = await fileToImage(file);

    const detecciones = await modeloPersonas.detect(img);
    const persona = detecciones.find(
      d => d.class === "person" && d.score >= 0.60
    );

    if (!persona) {
      return "No se detectó una persona en la imagen.";
    }

    const poses = await modeloPose.estimatePoses(img);
    if (!poses || poses.length === 0) {
      return "La persona no pudo ser reconocida correctamente.";
    }

    const keypoints = poses[0].keypoints;

    const ok = name => {
      const p = keypoints.find(k => k.name === name);
      return p && p.score >= 0.50;
    };

    const cabeza   = ok("nose") || ok("left_eye") || ok("right_eye");
    const hombros  = ok("left_shoulder") && ok("right_shoulder");
    const caderas  = ok("left_hip") && ok("right_hip");
    const rodillas = ok("left_knee") && ok("right_knee");
    const tobillos = ok("left_ankle") && ok("right_ankle");

    if (cabeza && hombros && caderas && rodillas && tobillos) {
        return "✔ Imagen válida: Persona completa detectada.";
    }

    return "La persona no está completa en la imagen. Intenta con otra foto.";

  } catch (error) {
    console.error("Error en validateCustomImageLogic:", error);
    return "Error procesando la imagen. Intenta nuevamente.";
  }
}
