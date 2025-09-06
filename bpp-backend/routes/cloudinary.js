const express = require('express');
const multer = require('multer');
const { cloudinary, CLOUDINARY_UPLOAD_PRESET } = require('../cloudinaryConfig');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Debug middleware
const debugLogger = (req, res, next) => {
  console.log('🔄 Request:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    headers: req.headers,
    query: req.query,
    body: req.method === 'POST' ? req.body : undefined
  });
  next();
};

router.use(debugLogger);

// Status route with detailed config check
router.get('/status', (req, res) => {
  try {
    const config = cloudinary.config();
    console.log('📝 Cloudinary Config:', {
      cloud_name: config.cloud_name,
      preset: CLOUDINARY_UPLOAD_PRESET,
      api_key: config.api_key ? 'Present' : 'Missing',
      timestamp: new Date().toISOString()
    });
    res.json({ status: 'ok', config: { cloud_name: config.cloud_name, preset: CLOUDINARY_UPLOAD_PRESET } });
  } catch (error) {
    console.error('❌ Config Error:', error);
    res.status(500).json({ error: 'Config check failed', details: error.message });
  }
});

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { section, category, name } = req.body;
    const file = req.file;
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `${section}/${category}`,
      public_id: name
    });
    const appDataPath = path.join(__dirname, '../../bpp-frontend/src/data/appData.js');
    let content = await fs.readFile(appDataPath, 'utf8');
    if (section === 'learning') {
      content = content.replace(
        new RegExp(`(title: '${name}',[\\s\\S]*?image:)[^,}]*`),
        `$1 '${result.secure_url}'`
      );
    } else {
      content = content.replace(
        new RegExp(`(title: '${category}',[\\s\\S]*?name: '${name}',[\\s\\S]*?image:)[^,}]*`),
        `$1 '${result.secure_url}'`
      );
    }
    await fs.writeFile(appDataPath, content);
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get images route with enhanced error handling
router.get('/images', async (req, res) => {
  try {
    console.log('🔍 Starting image fetch...');
    // Debug Cloudinary config
    const config = cloudinary.config();
    console.log('Cloudinary Config:', {
      cloud_name: config.cloud_name,
      folder: 'upload'
    });
    const result = await cloudinary.search
      .expression('folder:upload/*')
      .with_field('context')
      .max_results(100)
      .execute();
    console.log('Search Result:', {
      total: result.total_count,
      hasResources: !!result.resources,
      resourceCount: result.resources?.length
    });
    if (!result.resources?.length) {
      return res.json({ 
        images: [],
        message: 'No images found'
      });
    }
    const images = result.resources.map(file => ({
      public_id: file.public_id,
      url: file.secure_url,
      created_at: file.created_at,
      format: file.format,
      size: file.bytes
    }));
    console.log(`✅ Found ${images.length} images`);
    res.json({ images });
  } catch (error) {
    console.error('❌ Fetch Failed:', {
      message: error.message,
      stack: error.stack,
      details: error.error || {}
    });
    res.status(500).json({
      error: 'Failed to fetch images',
      details: error.message
    });
  }
});

router.get('/images/:folder', async (req, res) => {
  const { folder } = req.params;
  try {
    // Función auxiliar para traer recursos por tipo
    const getResources = async (resourceType) => {
      let resources = [];
      let nextCursor = undefined;
      do {
        const result = await cloudinary.api.resources({
          type: 'upload',
          prefix: `${folder}/`, // busca en folder y subfolders automáticamente
          max_results: 500,
          resource_type: resourceType,
          next_cursor: nextCursor
        });
        resources = resources.concat(result.resources.map(file => ({
          public_id: file.public_id,
          url: file.secure_url,
          created_at: file.created_at,
          format: file.format,
          size: file.bytes,
          type: resourceType
        })));
        nextCursor = result.next_cursor;
      } while (nextCursor);
      return resources;
    };
    // Traer imágenes y videos recursivamente
    const images = await getResources('image');
    const videos = await getResources('video');
    // Combinar todo
    const allResources = [...images, ...videos];
    allResources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ images: allResources });
  } catch (error) {
    res.status(500).json({ error: `Error al obtener recursos de ${folder}`, details: error.message });
  }
});
 
// Mover de "pendientes" → "upload"
router.post('/move', async (req, res) => {
  try {
    const { public_id } = req.body;
    // obtener extensión del archivo
    const extension = public_id.split('.').pop();
    const fileName = public_id.split('/').pop(); 
    // generar nueva ruta en carpeta upload
    const newPublicId = `upload/${fileName.replace(/\.[^/.]+$/, "")}`;
    // renombrar en cloudinary (mueve de carpeta)
    const result = await cloudinary.uploader.rename(
      public_id,
      newPublicId
    );
    res.json({
      success: true,
      message: "Image moved successfully",
      newPublicId: result.public_id,
      url: result.secure_url
    });
  } catch (error) {
    console.error("Move Error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
  
// Test upload endpoint
router.use((req, res, next) => {
    if (req.params.publicId) {
      req.params.publicId = decodeURIComponent(req.params.publicId);
    }
    next();
});
  
router.delete('/delete/*', async (req, res) => {
    try {
      
      const fullPath = req.params[0];
      
      
      const result = await cloudinary.uploader.destroy(fullPath, {
        invalidate: true
      });
  
      if (result.result !== 'ok') {
        throw new Error('Failed to delete from Cloudinary');
      }
  
      res.json({ 
        success: true,
        message: 'Image deleted successfully'
      });
  
    } catch (error) {
      console.error('Delete Error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
});
  
router.post('/upload-to-category', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const { category, subCategory, name } = req.body;
      if (!category || !subCategory || !name) {
        return res.status(400).json({ error: 'Category, subCategory and name are required' });
      }
  
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
  
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: `${category}/${subCategory}`,
        resource_type: 'auto'
      });
  
      // Update appData
      const appDataPath = path.join(__dirname, '../..', 'frontend/src/data/appData.js');
      const appData = require(appDataPath);
  
      if (category === 'animals') {
        const categoryIndex = appData.animalCategories.findIndex(cat => cat.title === subCategory);
        if (categoryIndex !== -1) {
          appData.animalCategories[categoryIndex].animals.push({
            name,
            image: result.secure_url
          });
        }
      } else if (category === 'plants') {
        const categoryIndex = appData.plantCategories.findIndex(cat => cat.title === subCategory);
        if (categoryIndex !== -1) {
          appData.plantCategories[categoryIndex].plants.push({
            name,
            image: result.secure_url
          });
        }
      }
  
    
      fs.writeFileSync(
        appDataPath,
        `export const appData = ${JSON.stringify(appData, null, 2)};`
      );
  
      res.json({
        url: result.secure_url,
        public_id: result.public_id,
        category,
        subCategory,
        name
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;