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

    if (!modeloPersonas) {
      modeloPersonas = await cocoSsd.load();
    }

    if (!modeloPose) {
      modeloPose = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
        }
      );
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

// Constantes para estados de validación
export const VALIDATION_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
};

export const VALIDATION_MESSAGES = {
  SUCCESS: 'Imagen válida: Persona completa detectada',
  NO_PERSON: 'No se detectó una persona en la imagen',
  PERSON_NOT_RECOGNIZED: 'La persona no pudo ser reconocida correctamente',
  INCOMPLETE_PERSON: 'La persona no está completa, intenta con otra foto',
  PROCESSING_ERROR: 'Error procesando la imagen. Intenta nuevamente'
};

export async function validateCustomImageLogic(file) {
  try {
    await cargarModelosSiNoEstan();

    const img = await fileToImage(file);

    const detecciones = await modeloPersonas.detect(img);
    const persona = detecciones.find(
      d => d.class === "person" && d.score >= 0.60
    );

    if (!persona) {
      return {
        status: VALIDATION_STATUS.ERROR,
        message: VALIDATION_MESSAGES.NO_PERSON
      };
    }

    // Estimar poses para validar completitud de la persona
    const poses = await modeloPose.estimatePoses(img);
    if (!poses || poses.length === 0) {
      return {
        status: VALIDATION_STATUS.ERROR,
        message: VALIDATION_MESSAGES.PERSON_NOT_RECOGNIZED
      };
    }

    const keypoints = poses[0].keypoints;

    // Función helper para verificar keypoints
    const hasValidKeypoint = name => {
      const point = keypoints.find(k => k.name === name);
      return point && point.score >= 0.50;
    };

    // Verificar partes del cuerpo necesarias
    const bodyParts = {
      head: hasValidKeypoint("nose") || hasValidKeypoint("left_eye") || hasValidKeypoint("right_eye"),
      shoulders: hasValidKeypoint("left_shoulder") && hasValidKeypoint("right_shoulder"),
      hips: hasValidKeypoint("left_hip") && hasValidKeypoint("right_hip"),
      knees: hasValidKeypoint("left_knee") && hasValidKeypoint("right_knee"),
      ankles: hasValidKeypoint("left_ankle") && hasValidKeypoint("right_ankle")
    };

    const isCompleteBody = Object.values(bodyParts).every(Boolean);

    if (isCompleteBody) {
      return {
        status: VALIDATION_STATUS.SUCCESS,
        message: VALIDATION_MESSAGES.SUCCESS
      };
    }

    return {
      status: VALIDATION_STATUS.ERROR,
      message: VALIDATION_MESSAGES.INCOMPLETE_PERSON
    };

  } catch (error) {
    console.error("Error en validateCustomImageLogic:", error);
    return {
      status: VALIDATION_STATUS.ERROR,
      message: VALIDATION_MESSAGES.PROCESSING_ERROR
    };
  }
}
