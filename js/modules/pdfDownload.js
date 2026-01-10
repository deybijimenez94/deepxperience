/**
 * PDF Download Handler
 * Fuerza la descarga del PDF en el dispositivo del usuario
 */

export class PDFDownloadManager {
  constructor() {
    this.init();
  }

  init() {
    const downloadLink = document.getElementById('download-pdf-link');

    if (!downloadLink) {
      console.warn('PDF download link not found');
      return;
    }

    // Agregar evento click para forzar descarga
    downloadLink.addEventListener('click', (e) => this.handleDownload(e));
  }

  /**
   * Fuerza la descarga del PDF usando diferentes métodos según el navegador
   */
  handleDownload(event) {
    event.preventDefault();

    // Usar la ruta relativa del href del enlace
    const link = event.currentTarget;
    const pdfUrl = link.getAttribute('href');
    const fileName = link.getAttribute('download') || 'Expedicion-Fiordo-Comau-2025.pdf';

    console.log('Intentando descargar PDF:', pdfUrl);

    // Método 1: Intentar descarga directa con fetch y blob
    this.downloadWithFetch(pdfUrl, fileName)
      .catch(() => {
        // Método 2: Fallback - descarga tradicional
        console.log('Fallback al método tradicional');
        try {
          this.downloadTraditional(pdfUrl, fileName);
        } catch (error) {
          // Método 3: Último recurso - abrir en nueva ventana
          console.log('Fallback final - abrir PDF');
          this.openPDF(pdfUrl);
        }
      });
  }

  /**
   * Método moderno usando Fetch API y Blob
   * Funciona mejor en navegadores modernos y móviles
   */
  async downloadWithFetch(url, fileName) {
    try {
      console.log('Iniciando descarga del PDF con fetch...', url);

      // Fetch del archivo
      const response = await fetch(url);

      if (!response.ok) {
        console.error('Error HTTP:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('PDF descargado, creando blob...');

      // Convertir a blob
      const blob = await response.blob();
      console.log('Blob creado:', blob.size, 'bytes');

      // Crear URL temporal del blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Crear link temporal y hacer clic
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = fileName;
      tempLink.style.display = 'none';

      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      // Liberar memoria
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

      console.log('✅ PDF descargado exitosamente');

      // Mostrar mensaje de éxito al usuario
      this.showDownloadMessage('success');

    } catch (error) {
      console.error('Error en descarga con fetch:', error);
      throw error;
    }
  }

  /**
   * Método tradicional de descarga
   * Fallback para navegadores antiguos o cuando fetch falla
   */
  downloadTraditional(url, fileName) {
    console.log('Usando método tradicional de descarga');

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Pequeño delay antes de remover para asegurar que funcione
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    this.showDownloadMessage('info');
  }

  /**
   * Método de último recurso - abre el PDF en nueva ventana
   * Si todo lo demás falla, al menos el usuario puede ver/descargar el PDF
   */
  openPDF(url) {
    console.log('Abriendo PDF en nueva ventana:', url);
    window.open(url, '_blank', 'noopener,noreferrer');
    this.showDownloadMessage('info');
  }

  /**
   * Muestra mensaje temporal al usuario
   */
  showDownloadMessage(type = 'success') {
    // Buscar si ya existe un mensaje
    let messageDiv = document.querySelector('.pdf-download-message');

    if (messageDiv) {
      messageDiv.remove();
    }

    // Crear nuevo mensaje
    messageDiv = document.createElement('div');
    messageDiv.className = `pdf-download-message pdf-download-message--${type}`;

    const messages = {
      success: '✅ PDF descargado correctamente',
      info: '📥 Descargando PDF...',
      error: '❌ Error al descargar. Intenta de nuevo.'
    };

    messageDiv.textContent = messages[type] || messages.success;

    // Insertar en el modal
    const modalText = document.querySelector('.modal-text');
    if (modalText) {
      modalText.appendChild(messageDiv);

      // Auto-eliminar después de 3 segundos
      setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
      }, 3000);
    }
  }
}
