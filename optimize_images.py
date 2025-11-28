#!/usr/bin/env python3
"""
DEEPXPERIENCE - OPTIMIZADOR DE IMÁGENES AUTOMÁTICO
Convierte todas las imágenes a WebP y las optimiza

REQUISITOS:
pip install Pillow

USO:
python optimize_images.py
"""

from PIL import Image
import os
import sys

# ============================================
# CONFIGURACIÓN
# ============================================
QUALITY = {
    'hero': 75,           # Imagen de portada
    'carousel': 75,       # Carrusel 3D
    'experiences': 80,    # Experiencias
    'azores': 75,         # Cards Azores
    'hosts': 80,          # Fotos de hosts
    'logos': 100          # Logos e iconos
}

SIZES = {
    'hero': (1920, 1080),
    'carousel': (1400, 800),
    'experiences': (1200, 700),
    'azores': (800, 600),
    'hosts': (800, 1000),
    'logos': None  # Mantener tamaño original
}

# Carpetas a procesar
FOLDERS = {
    'Imagenes': 'hero',
    'Imagenes/Carrucel': 'carousel',
    'Imagenes/Patagonia': 'experiences',
    'Imagenes/Azores': 'azores',
    'Imagenes': 'hosts'  # Host.jpg y Host2.jpg
}

# ============================================
# FUNCIONES
# ============================================

def optimize_image(input_path, output_path, quality, max_size=None):
    """
    Optimiza una imagen y la convierte a WebP
    
    Args:
        input_path: Ruta de la imagen original
        output_path: Ruta de salida (WebP)
        quality: Calidad de compresión (1-100)
        max_size: Tupla (ancho, alto) máximo. None para mantener original
    """
    try:
        # Abrir imagen
        img = Image.open(input_path)
        
        # Convertir a RGB si es necesario (para PNGs con transparencia)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Redimensionar si se especifica tamaño
        if max_size:
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Guardar como WebP
        img.save(output_path, 'WebP', quality=quality, method=6)
        
        # Calcular reducción de tamaño
        original_size = os.path.getsize(input_path) / 1024  # KB
        optimized_size = os.path.getsize(output_path) / 1024  # KB
        reduction = ((original_size - optimized_size) / original_size) * 100
        
        print(f"✅ {os.path.basename(input_path)}")
        print(f"   {original_size:.1f} KB → {optimized_size:.1f} KB ({reduction:.1f}% reducción)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error procesando {input_path}: {str(e)}")
        return False

def process_folder(folder_path, image_type):
    """
    Procesa todas las imágenes en una carpeta
    """
    if not os.path.exists(folder_path):
        print(f"⚠️  Carpeta no encontrada: {folder_path}")
        return 0
    
    print(f"\n📁 Procesando carpeta: {folder_path}")
    print(f"   Tipo: {image_type}")
    print(f"   Calidad: {QUALITY[image_type]}")
    print(f"   Tamaño máximo: {SIZES[image_type] or 'Original'}")
    print("-" * 60)
    
    processed = 0
    extensions = ('.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG')
    
    for filename in os.listdir(folder_path):
        if filename.endswith(extensions):
            input_path = os.path.join(folder_path, filename)
            
            # Crear nombre de salida
            name_without_ext = os.path.splitext(filename)[0]
            output_filename = f"{name_without_ext}-optimized.webp"
            output_path = os.path.join(folder_path, output_filename)
            
            # Optimizar
            if optimize_image(
                input_path, 
                output_path, 
                QUALITY[image_type], 
                SIZES[image_type]
            ):
                processed += 1
    
    return processed

def process_specific_images():
    """
    Procesa imágenes específicas (Portada, Host.jpg, etc.)
    """
    specific_images = [
        ('Imagenes/Portada.jpg', 'hero', 'Imagenes/Portada-optimized.webp'),
        ('Imagenes/Host.jpg', 'hosts', 'Imagenes/Host-optimized.webp'),
        ('Imagenes/Host2.jpg', 'hosts', 'Imagenes/Host2-optimized.webp'),
        ('Imagenes/Foto grupal.jpeg', 'hosts', 'Imagenes/Foto-grupal-optimized.webp'),
    ]
    
    print("\n📸 Procesando imágenes específicas...")
    print("-" * 60)
    
    processed = 0
    for input_path, img_type, output_path in specific_images:
        if os.path.exists(input_path):
            if optimize_image(input_path, output_path, QUALITY[img_type], SIZES[img_type]):
                processed += 1
        else:
            print(f"⚠️  No encontrado: {input_path}")
    
    return processed

def main():
    """
    Función principal
    """
    print("=" * 60)
    print("🖼️  DEEPXPERIENCE - OPTIMIZADOR DE IMÁGENES")
    print("=" * 60)
    
    total_processed = 0
    
    # Procesar carpetas
    folders_to_process = [
        ('Imagenes/Carrucel', 'carousel'),
        ('Imagenes/Patagonia', 'experiences'),
        ('Imagenes/Azores', 'azores'),
    ]
    
    for folder, img_type in folders_to_process:
        total_processed += process_folder(folder, img_type)
    
    # Procesar imágenes específicas
    total_processed += process_specific_images()
    
    # Resumen final
    print("\n" + "=" * 60)
    print(f"✅ COMPLETADO: {total_processed} imágenes optimizadas")
    print("=" * 60)
    print("\n📋 PRÓXIMOS PASOS:")
    print("1. Revisa las imágenes optimizadas (tienen sufijo -optimized.webp)")
    print("2. Si te gustan, reemplaza las referencias en tu HTML")
    print("3. Ejemplo:")
    print("   ANTES: <img src='Imagenes/Portada.jpg'>")
    print("   DESPUÉS: <img src='Imagenes/Portada-optimized.webp'>")
    print("\n💡 TIP: Mantén las imágenes originales como respaldo")

if __name__ == "__main__":
    main()