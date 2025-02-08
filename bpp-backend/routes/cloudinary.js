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

// Upload route with enhanced error handling
router.post('/upload', upload.single('image'), async (req, res) => {
  const startTime = Date.now();

  if (!req.file) {
    console.error('❌ Upload Error: No file received', {
      headers: req.headers,
      timestamp: new Date().toISOString()
    });
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    console.log('📤 Upload Started:', {
      filename: req.file.originalname,
      size: `${(req.file.size / 1024).toFixed(2)}KB`,
      mimetype: req.file.mimetype,
      timestamp: new Date().toISOString()
    });

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const uploadResponse = await cloudinary.uploader.unsigned_upload(dataURI, CLOUDINARY_UPLOAD_PRESET, {
      folder: 'uploads',
      resource_type: 'auto',
      public_id: `image-${Date.now()}`
    }).catch(error => {
      console.error('❌ Cloudinary Error:', {
        message: error.message,
        code: error.http_code,
        type: error.name,
        details: error.error || {},
        timestamp: new Date().toISOString()
      });
      throw error;
    });

    const duration = Date.now() - startTime;
    console.log('✅ Upload Successful:', {
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    res.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      duration: duration
    });
  } catch (error) {
    console.error('❌ Upload Failed:', {
      error: error.message,
      stack: error.stack,
      code: error.http_code,
      type: error.name,
      details: error.error || {},
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      error: 'Upload failed',
      details: error.message,
      code: error.http_code || 500,
      timestamp: new Date().toISOString()
    });
  }
});

// Get images route with enhanced error handling
router.get('/images', async (req, res) => {
  const startTime = Date.now();

  try {
    console.log('🔍 Fetching images...');
    const { resources } = await cloudinary.search
      .expression('folder:uploads')
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute()
      .catch(error => {
        console.error('❌ Search Error:', {
          message: error.message,
          code: error.http_code,
          type: error.name,
          details: error.error || {},
          timestamp: new Date().toISOString()
        });
        throw error;
      });

    const duration = Date.now() - startTime;
    console.log('✅ Images Found:', {
      count: resources.length,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
    
    const images = resources.map(file => ({
      public_id: file.public_id,
      url: file.secure_url,
      created_at: file.created_at,
      format: file.format,
      size: file.bytes,
      width: file.width,
      height: file.height
    }));

    res.json({ images, duration });
  } catch (error) {
    console.error('❌ Fetch Failed:', {
      error: error.message,
      stack: error.stack,
      code: error.http_code,
      type: error.name,
      details: error.error || {},
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      error: 'Failed to fetch images',
      details: error.message,
      code: error.http_code || 500,
      timestamp: new Date().toISOString()
    });
  }
});


// Health check endpoint
router.get('/health', (req, res) => {
  try {
    const config = cloudinary.config();
    res.json({
      status: 'healthy',
      cloudinary: {
        connected: true,
        cloud_name: config.cloud_name,
        api_key: config.api_key ? 'present' : 'missing',
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test upload endpoint
router.post('/test-upload', upload.single('image'), async (req, res) => {
  try {
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    
    const result = await cloudinary.uploader.unsigned_upload(
      testImage,
      CLOUDINARY_UPLOAD_PRESET,
      { folder: 'test' }
    );
    
    res.json({
      status: 'success',
      result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// ...existing code...
module.exports = router;