import os
import io
import uuid
import tempfile
from typing import Tuple
from PIL import Image, ImageOps, UnidentifiedImageError
from fastapi import UploadFile, HTTPException, status


class ImageService:
    ALLOWED_EXT = {'.jpg', '.jpeg', '.png', '.webp'}
    MAX_WIDTH = 1200
    MAX_HEIGHT = 1200
    QUALITY = 85  # between 80 and 85 as requested

    def __init__(self, upload_dir: str = 'uploads'):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def _validate(self, filename: str, content_type: str) -> None:
        if not filename:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided")
        ext = os.path.splitext(filename)[1].lower()
        if ext not in self.ALLOWED_EXT:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Tipo de archivo no soportado: {ext}")
        if not content_type.startswith('image/'):
            # allow some leniency but keep check
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Content-Type no es imagen: {content_type}")

    def _open_image(self, content: bytes) -> Image.Image:
        try:
            img = Image.open(io.BytesIO(content))
        except UnidentifiedImageError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo identificar la imagen subida")

        # Fix orientation using EXIF and return image
        try:
            img = ImageOps.exif_transpose(img)
        except Exception:
            # If exif_transpose fails for any reason, continue with original image
            pass

        return img

    def _resize_if_needed(self, img: Image.Image) -> Image.Image:
        # Don't upscale: only shrink if larger than limits
        width, height = img.size
        if width <= self.MAX_WIDTH and height <= self.MAX_HEIGHT:
            return img

        img_copy = img.copy()
        img_copy.thumbnail((self.MAX_WIDTH, self.MAX_HEIGHT), Image.LANCZOS)
        return img_copy

    def _strip_exif(self, img: Image.Image) -> Image.Image:
        # Create a new image to avoid copying EXIF and extra info
        data = img.tobytes()
        mode = img.mode
        size = img.size
        new_img = Image.frombytes(mode, size, data)
        return new_img

    def optimize_upload(self, upload_file: UploadFile) -> str:
        """
        Process the uploaded file and save an optimized WebP copy in uploads.
        Returns the public path to the saved file (e.g., /uploads/uuid.webp).
        """
        filename = upload_file.filename
        content_type = upload_file.content_type or ''
        # Validate file
        self._validate(filename, content_type)

        # Read content
        try:
            content = upload_file.file.read()
        finally:
            try:
                upload_file.file.close()
            except Exception:
                pass

        img = self._open_image(content)

        # Convert to RGB(A) compatible for WebP; keep alpha if present
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGB")

        # Resize if needed
        img = self._resize_if_needed(img)

        # Strip metadata by creating a fresh image (this drops EXIF)
        try:
            cleaned = Image.new(img.mode, img.size)
            cleaned.paste(img)
            img = cleaned
        except Exception:
            # fallback to img itself
            pass

        # Save to temporary file first
        unique_name = f"{uuid.uuid4().hex}.webp"
        tmp_fd, tmp_path = tempfile.mkstemp(suffix=".webp")
        os.close(tmp_fd)
        try:
            # Use a BytesIO to let Pillow optimize before writing to disk
            bio = io.BytesIO()
            save_kwargs = {
                'format': 'WEBP',
                'quality': self.QUALITY,
                'method': 6,
                'optimize': True,
            }
            # Pillow supports lossless option; keep lossy for smaller sizes
            img.save(bio, **save_kwargs)
            bio.seek(0)

            final_path = os.path.join(self.upload_dir, unique_name)
            # atomic write
            with open(final_path, "wb") as f:
                f.write(bio.read())

            # Elimina el temporal
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

            # Return the public URL path
            return f"/uploads/{unique_name}"
        except Exception as e:
            # Clean up temp file
            try:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
            except Exception:
                pass
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error procesando la imagen: {str(e)}")