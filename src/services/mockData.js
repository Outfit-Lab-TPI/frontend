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