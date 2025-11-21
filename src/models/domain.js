/**
 * @typedef {object} ClimaModel
 * @property {number} id
 * @property {string} nombre
 */

/**
 * @typedef {object} OcasionModel
 * @property {number} id
 * @property {string} nombre
 */


/**
 * @typedef {object} BrandModel
 * @property {string} codigoMarca
 * @property {string} nombre
 */

/**
 * @typedef {object} PrendaModel
 * @property {string} nombre
 * @property {BrandModel} marca
 * @property {string} tipo
 * @property {string} imagenUrl
 * @property {string} garmentCode
 * @property {string} color
 * @property {ClimaModel} climaAdecuado
 * @property {OcasionModel[]} ocasiones
 */


/**
 * @typedef {object} ConjuntoDTO
 * @property {string} nombre 
 * @property {PrendaModel[]} prendas
 */

/**
 * @typedef {object} RecommendationCategoriesDTO
 * @property {ClimaModel[]} climas
 * @property {OcasionModel[]} ocasiones
 */
