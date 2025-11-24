// clothingValidation.js
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-backend-webgl";

let modeloRopa = null;
let modelosCargandose = null;

const ALLOWED = [
  "t-shirt", "jersey", "suit", "maillot", "sweatshirt",
  "dress", "miniskirt", "jean", "jeans", "trousers",
  "pant", "pants", "shorts", "skirt", "blouse",
  "coat", "jacket", "hoodie", "vest", "top"
];

export async function cargarModeloRopaSiNoEsta() {
  if (modelosCargandose) return modelosCargandose;

  modelosCargandose = (async () => {
    await tf.ready();

    if (tf.getBackend() !== "webgl") {
      await tf.setBackend("webgl");
      await tf.ready();
    }

    console.log("Backend inicializado:", tf.getBackend());

    if (!modeloRopa) {
      console.log("Cargando modelo MobileNet para prendas...");
      modeloRopa = await mobilenet.load();
      console.log("Modelo MobileNet cargadooo");
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

export async function validarImagenDeRopa(file) {
  try {
    await cargarModeloRopaSiNoEsta();

    const img = await fileToImage(file);

    const predictions = await modeloRopa.classify(img);

    console.log("Predicciones:", predictions);

    const labels = predictions.map(p => p.className.toLowerCase());

    const esRopa = labels.some(label =>
      ALLOWED.some(a => label.includes(a))
    );

    return {
      ok: esRopa,
      predictions,
      message: esRopa
        ? "Es una prenda válida."
        : "No parece ser una prenda de ropa."
    };

  } catch (error) {
    console.error("Error en validarImagenDeRopa:", error);
    return {
      ok: false,
      message: "Error procesando la imagen."
    };
  }
}
