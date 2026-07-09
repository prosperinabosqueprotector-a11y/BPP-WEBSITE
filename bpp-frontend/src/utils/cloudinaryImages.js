const CLOUDINARY_UPLOAD_SEGMENT = '/image/upload/';

const buildCloudinaryVariant = (imageUrl, transformation) => {
  if (!imageUrl || !imageUrl.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return imageUrl;
  }

  return imageUrl.replace(
    CLOUDINARY_UPLOAD_SEGMENT,
    `${CLOUDINARY_UPLOAD_SEGMENT}${transformation}/`
  );
};

export const getThumbnailImageUrl = (imageUrl) =>
  buildCloudinaryVariant(imageUrl, 'f_auto,q_auto:eco,c_fill,w_320,h_220,dpr_auto');

export const getDetailImageUrl = (imageUrl) =>
  buildCloudinaryVariant(imageUrl, 'f_auto,q_auto:good,c_limit,w_1200,dpr_auto');
