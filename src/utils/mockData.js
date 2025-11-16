// Mock data para pruebas mientras el backend no esté disponible
export const mockMarcas = [
  {
    codigoMarca: "nike",
    nombre: "Nike",
    logoUrl: "https://logoeps.com/wp-content/uploads/2013/03/nike-vector-logo.png"
  },
  {
    codigoMarca: "adidas",
    nombre: "Adidas",
    logoUrl: "https://logoeps.com/wp-content/uploads/2014/09/adidas-vector-logo.png"
  },
  {
    codigoMarca: "puma",
    nombre: "Puma srl",
    logoUrl: "https://logoeps.com/wp-content/uploads/2013/03/puma-vector-logo.png"
  },
  {
    codigoMarca: "element",
    nombre: "Element",
    logoUrl: "https://www.nicepng.com/png/full/387-3879094_element-logo-png-transparent-element-skateboards.png"
  }
];

// Mock data para detalles de marca
export const mockMarcaDetails = {
  nike: {
    nombre: "Nike",
    logoUrl: "https://logoeps.com/wp-content/uploads/2013/03/nike-vector-logo.png",
    sitioUrl: "https://www.nike.com",
    prendas: [
      {
        nombre: "Dri-FIT Polo",
        tipo: "superior",
        imagenUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Camisa"
      },
      {
        nombre: "Dri-FIT Shirt",
        tipo: "superior",
        imagenUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61b4738b-e1e1-4786-8f6c-26aa0008e80b/dri-fit-adv-techknit-ultra-mens-short-sleeve-running-top-FN3300.png"
      },
      {
        nombre: "Tech Fleece Hoodie",
        tipo: "superior",
        imagenUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/86be332c-d2e0-458e-a4e5-d2e56f823c6d/tech-fleece-mens-full-zip-hoodie-CU4489.png"
      },
      {
        nombre: "Tech Fleece Pants",
        tipo: "inferior",
        imagenUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Pantalon"
      }
    ]
  },
  adidas: {
    nombre: "Adidas",
    logoUrl: "https://logoeps.com/wp-content/uploads/2014/09/adidas-vector-logo.png",
    sitioUrl: "https://www.adidas.com",
    prendas: [
      {
        nombre: "Originals Shirt",
        tipo: "superior",
        imagenUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Camisa"
      },
      {
        nombre: "3-Stripes Track Jacket",
        tipo: "superior",
        imagenUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/8827dce5c2314e09a321ad1e013f9d65_9366/3-Stripes_Track_Jacket_Black_GF3256_21_model.jpg"
      },
      {
        nombre: "Essentials T-Shirt",
        tipo: "superior",
        imagenUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/aec3b27d3c254949a7ceade300b8f7ee_9366/Essentials_Big_Logo_Tee_Black_GK9121_21_model.jpg"
      },
      {
        nombre: "Tiro Track Pants",
        tipo: "inferior",
        imagenUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/1d22c8ba24d54b74b4c2ae2f00e6ce33_9366/Tiro_Track_Pants_Black_GQ1043_21_model.jpg"
      }
    ]
  },
  puma: {
    nombre: "Puma srl",
    logoUrl: "https://logoeps.com/wp-content/uploads/2013/03/puma-vector-logo.png",
    sitioUrl: "https://www.puma.com",
    prendas: [
      {
        nombre: "Classic Polo",
        tipo: "superior",
        imagenUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Camisa"
      },
      {
        nombre: "Essentials Logo Hoodie",
        tipo: "superior",
        imagenUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/586688/01/mod01/fnd/PNA/fmt/png/Essentials-Big-Logo-Hoodie"
      },
      {
        nombre: "Active T-Shirt",
        tipo: "superior",
        imagenUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/520010/01/mod01/fnd/PNA/fmt/png/Active-Small-Logo-Men's-Tee"
      },
      {
        nombre: "Amplified Sweatpants",
        tipo: "inferior",
        imagenUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/581332/01/mod01/fnd/PNA/fmt/png/PUMA-x-AMPLIFIED-Men's-Sweatpants"
      }
    ]
  },
  element: {
    nombre: "Element",
    logoUrl: "https://www.nicepng.com/png/full/387-3879094_element-logo-png-transparent-element-skateboards.png",
    sitioUrl: "https://www.elementbrand.com",
    prendas: [
      {
        nombre: "Nature Logo Shirt",
        tipo: "superior",
        imagenUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Camisa"
      },
      {
        nombre: "Tree Logo Hoodie",
        tipo: "superior",
        imagenUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Hoodie"
      },
      {
        nombre: "Vertical T-Shirt",
        tipo: "superior",
        imagenUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=T-Shirt"
      },
      {
        nombre: "E-Town Pants",
        tipo: "inferior",
        imagenUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Pantalon"
      }
    ]
  }
};

// Simula delay de red
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simula llamada a API
export const fetchMockMarcas = async () => {
  await delay(800); // Simula tiempo de carga de red
  return {
    data: mockMarcas
  };
};

// Simula llamada a API para detalle de marca
export const fetchMockMarcaDetail = async (codigoMarca) => {
  await delay(600); // Simula tiempo de carga de red

  const marcaDetail = mockMarcaDetails[codigoMarca];
  if (!marcaDetail) {
    throw new Error(`Marca con código '${codigoMarca}' no encontrada`);
  }

  return {
    data: marcaDetail
  };
};

// Mock data para probador (todas las prendas de todas las marcas)
export const mockProbadorPrendas = [
  // Nike
  {
    id: 1,
    codigo: "nike_polo_001",
    nombre: "Dri-FIT Polo",
    tipo: "superior",
    marca: "Nike",
    color: "Negro",
    imagenUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Nike+Polo",
    esFavorita: false
  },
  {
    id: 2,
    codigo: "nike_shirt_001",
    nombre: "Dri-FIT Shirt",
    tipo: "superior",
    marca: "Nike",
    color: "Azul",
    imagenUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61b4738b-e1e1-4786-8f6c-26aa0008e80b/dri-fit-adv-techknit-ultra-mens-short-sleeve-running-top-FN3300.png",
    esFavorita: true
  },
  {
    id: 3,
    codigo: "nike_hoodie_001",
    nombre: "Tech Fleece Hoodie",
    tipo: "superior",
    marca: "Nike",
    color: "Gris",
    imagenUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/86be332c-d2e0-458e-a4e5-d2e56f823c6d/tech-fleece-mens-full-zip-hoodie-CU4489.png",
    esFavorita: false
  },
  {
    id: 4,
    codigo: "nike_pants_001",
    nombre: "Tech Fleece Pants",
    tipo: "inferior",
    marca: "Nike",
    color: "Negro",
    imagenUrl: "https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Nike+Pants",
    esFavorita: true
  },
  // Adidas
  {
    id: 5,
    codigo: "adidas_shirt_001",
    nombre: "Originals Shirt",
    tipo: "superior",
    marca: "Adidas",
    color: "Blanco",
    imagenUrl: "https://via.placeholder.com/400x400/ffffff/000000?text=Adidas+Shirt",
    esFavorita: false
  },
  {
    id: 6,
    codigo: "adidas_jacket_001",
    nombre: "3-Stripes Track Jacket",
    tipo: "superior",
    marca: "Adidas",
    color: "Negro",
    imagenUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/8827dce5c2314e09a321ad1e013f9d65_9366/3-Stripes_Track_Jacket_Black_GF3256_21_model.jpg",
    esFavorita: true
  },
  {
    id: 7,
    codigo: "adidas_tshirt_001",
    nombre: "Essentials T-Shirt",
    tipo: "superior",
    marca: "Adidas",
    color: "Negro",
    imagenUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/aec3b27d3c254949a7ceade300b8f7ee_9366/Essentials_Big_Logo_Tee_Black_GK9121_21_model.jpg",
    esFavorita: false
  },
  {
    id: 8,
    codigo: "adidas_pants_001",
    nombre: "Tiro Track Pants",
    tipo: "inferior",
    marca: "Adidas",
    color: "Negro",
    imagenUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/1d22c8ba24d54b74b4c2ae2f00e6ce33_9366/Tiro_Track_Pants_Black_GQ1043_21_model.jpg",
    esFavorita: false
  },
  // Puma
  {
    id: 9,
    codigo: "puma_polo_001",
    nombre: "Classic Polo",
    tipo: "superior",
    marca: "Puma",
    color: "Azul",
    imagenUrl: "https://via.placeholder.com/400x400/0066cc/ffffff?text=Puma+Polo",
    esFavorita: true
  },
  {
    id: 10,
    codigo: "puma_hoodie_001",
    nombre: "Essentials Logo Hoodie",
    tipo: "superior",
    marca: "Puma",
    color: "Rojo",
    imagenUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/586688/01/mod01/fnd/PNA/fmt/png/Essentials-Big-Logo-Hoodie",
    esFavorita: false
  },
  {
    id: 11,
    codigo: "puma_tshirt_001",
    nombre: "Active T-Shirt",
    tipo: "superior",
    marca: "Puma",
    color: "Verde",
    imagenUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/520010/01/mod01/fnd/PNA/fmt/png/Active-Small-Logo-Men's-Tee",
    esFavorita: false
  },
  {
    id: 12,
    codigo: "puma_pants_001",
    nombre: "Amplified Sweatpants",
    tipo: "inferior",
    marca: "Puma",
    color: "Gris",
    imagenUrl: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/581332/01/mod01/fnd/PNA/fmt/png/PUMA-x-AMPLIFIED-Men's-Sweatpants",
    esFavorita: true
  },
  // Element
  {
    id: 13,
    codigo: "element_shirt_001",
    nombre: "Nature Logo Shirt",
    tipo: "superior",
    marca: "Element",
    color: "Verde",
    imagenUrl: "https://via.placeholder.com/400x400/228B22/ffffff?text=Element+Shirt",
    esFavorita: false
  },
  {
    id: 14,
    codigo: "element_hoodie_001",
    nombre: "Tree Logo Hoodie",
    tipo: "superior",
    marca: "Element",
    color: "Marrón",
    imagenUrl: "https://via.placeholder.com/400x400/8B4513/ffffff?text=Element+Hoodie",
    esFavorita: false
  },
  {
    id: 15,
    codigo: "element_tshirt_001",
    nombre: "Vertical T-Shirt",
    tipo: "superior",
    marca: "Element",
    color: "Blanco",
    imagenUrl: "https://via.placeholder.com/400x400/ffffff/000000?text=Element+Tee",
    esFavorita: true
  },
  {
    id: 16,
    codigo: "element_pants_001",
    nombre: "E-Town Pants",
    tipo: "inferior",
    marca: "Element",
    color: "Azul",
    imagenUrl: "https://via.placeholder.com/400x400/000080/ffffff?text=Element+Pants",
    esFavorita: false
  }
];

// Mock data para combinaciones favoritas del perfil
export const mockCombinacionesFavoritas = [
  {
    id: 1,
    codigo: "combo_001",
    nombre: "Outfit Casual Nike",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop",
    fechaCreacion: "2024-10-15",
    genero: "hombre",
    esFavorita: true,
    prendas: ["nike_shirt_001", "nike_pants_001"]
  },
  {
    id: 2,
    codigo: "combo_002",
    nombre: "Look Deportivo Adidas",
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop",
    fechaCreacion: "2024-10-20",
    genero: "mujer",
    esFavorita: true,
    prendas: ["adidas_jacket_001", "adidas_pants_001"]
  },
  {
    id: 3,
    codigo: "combo_003",
    nombre: "Estilo Urbano Puma",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
    fechaCreacion: "2024-10-25",
    genero: "hombre",
    esFavorita: true,
    prendas: ["puma_hoodie_001", "puma_pants_001"]
  },
  {
    id: 4,
    codigo: "combo_004",
    nombre: "Outfit Skater Element",
    imageUrl: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=600&fit=crop",
    fechaCreacion: "2024-10-28",
    genero: "hombre",
    esFavorita: true,
    prendas: ["element_tshirt_001", "element_pants_001"]
  },
  {
    id: 5,
    codigo: "combo_005",
    nombre: "Look Elegante Nike",
    imageUrl: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=600&fit=crop",
    fechaCreacion: "2024-11-01",
    genero: "mujer",
    esFavorita: true,
    prendas: ["nike_polo_001", "nike_pants_001"]
  }
];

// Simula llamada a API para probador
export const fetchMockProbadorPrendas = async () => {
  await delay(1000); // Simula tiempo de carga de red
  return {
    data: mockProbadorPrendas
  };
};

// Simula llamada a API para combinaciones favoritas
export const fetchMockCombinacionesFavoritas = async () => {
  await delay(800); // Simula tiempo de carga de red
  return {
    data: mockCombinacionesFavoritas
  };
};

// Simula toggle de favorito para prenda
export const mockTogglePrendaFavorita = async (codigoPrenda) => {
  await delay(500);

  // Buscar la prenda y cambiar su estado
  const prenda = mockProbadorPrendas.find(p => p.codigo === codigoPrenda);
  if (prenda) {
    prenda.esFavorita = !prenda.esFavorita;
    return {
      data: {
        codigo: codigoPrenda,
        esFavorita: prenda.esFavorita,
        mensaje: `Prenda ${prenda.esFavorita ? 'marcada como' : 'desmarcada de'} favorita`
      }
    };
  }

  throw new Error(`Prenda con código '${codigoPrenda}' no encontrada`);
};

// Simula toggle de favorito para combinación
export const mockToggleCombinacionFavorita = async (codigoCombinacion) => {
  await delay(500);

  // Buscar la combinación y cambiar su estado
  const combinacion = mockCombinacionesFavoritas.find(c => c.codigo === codigoCombinacion);
  if (combinacion) {
    combinacion.esFavorita = !combinacion.esFavorita;
    return {
      data: {
        codigo: codigoCombinacion,
        esFavorita: combinacion.esFavorita,
        mensaje: `Combinación ${combinacion.esFavorita ? 'marcada como' : 'desmarcada de'} favorita`
      }
    };
  }

  throw new Error(`Combinación con código '${codigoCombinacion}' no encontrada`);
};