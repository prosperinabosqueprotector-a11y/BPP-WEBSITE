const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');

router.post('/update', async (req, res) => {
  try {
    const { category, subCategory, name, imageUrl } = req.body;

    const appDataPath = path.join(__dirname, '../../bpp-frontend/src/data/appData.js');

    // 1. Convertir la ruta a URL file:// (especialmente importante en Windows):
    const appDataURL = new URL(`file://${appDataPath.replace(/\\/g, '/')}`); // Important for windows paths
    const appData = await import(appDataURL);

    // 2. Acceder a los datos directamente (sin cambios):
    if (category === 'animals') {
      const categoryIndex = appData.animalCategories.findIndex(
        (cat) => cat.title === subCategory
      );
      if (categoryIndex!== -1) {
        appData.animalCategories[categoryIndex].animals.push({ name, image: imageUrl });
      } else {
        return res.status(400).json({ error: "Subcategoría no encontrada" });
      }
    } else if (category === 'plants') {
      const categoryIndex = appData.plantCategories.findIndex(
        (cat) => cat.title === subCategory
      );
      if (categoryIndex!== -1) {
        appData.plantCategories[categoryIndex].plants.push({ name, image: imageUrl });
      } else {
        return res.status(400).json({ error: "Subcategoría no encontrada" });
      }
    } else {
        return res.status(400).json({ error: "Categoría no encontrada" });
    }

    // 3. Escribir los datos actualizados de vuelta al archivo (sin cambios):
    const newContent = `export const colorSchemes = ${JSON.stringify(appData.colorSchemes, null, 2)};
export const navItems = ${JSON.stringify(appData.navItems, null, 2)};
export const learningOptions = ${JSON.stringify(appData.learningOptions, null, 2)};
export const animalCategories = ${JSON.stringify(appData.animalCategories, null, 2)};
export const plantCategories = ${JSON.stringify(appData.plantCategories, null, 2)};`;

    await fs.writeFile(appDataPath, newContent, 'utf-8');

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;