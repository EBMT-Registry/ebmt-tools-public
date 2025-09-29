<template>
  <div class="hla-document-processor">
    <div class="upload-section">
      <h2>HLA Document Processor</h2>
      <div class="upload-area" @click="triggerFileInput" :class="{ 'drag-over': isDragOver }" 
           @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" 
           @drop.prevent="handleDrop">
        <input ref="fileInput" type="file" accept="image/png,.pdf" @change="handleFileSelect" style="display: none;">
        <div v-if="!selectedFile" class="upload-placeholder flex flex-col items-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7,10 12,15 17,10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <p>Click to select or drag & drop a PNG image or a PDF file</p>
        </div>
        <div v-else class="file-selected">
          <!-- Show image if PNG -->
          <img 
            v-if="imagePreview" 
            :src="imagePreview" 
            alt="Selected image" 
            class="image-preview"
          >
          <!-- Show PDF if uploaded -->
          <embed 
            v-else-if="pdfPreview" 
            :src="pdfPreview" 
            type="application/pdf" 
            width="100%" 
            height="400px"
          />
          <p>{{ selectedFile.name }}</p>
          <button @click.stop="clearFile" class="clear-btn">✕</button>
        </div>
      </div>
      <div class="flex items-center justify-around">
        <button @click="processImage('openai')" :disabled="!selectedFile || isProcessing" class="process-btn">
          {{ isProcessing ? 'Processing...' : 'Process with OpenAI' }}
        </button>
        <button @click="processImage('python')" :disabled="!selectedFile || isProcessing" class="process-btn">
          {{ isProcessing ? 'Processing...' : 'Process with Python' }}
        </button>
        
        <!-- Download Button with Dropdown -->
        <div class="download-container" v-if="hasProcessedFiles">
          <div class="dropdown" :class="{ active: isDropdownOpen }">
            <button 
              @click="toggleDropdown" 
              class="download-btn"
              type="button"
            >
              <span>Download Files</span>
              <svg 
                class="arrow" 
                :class="{ rotated: isDropdownOpen }"
                width="12" 
                height="12" 
                viewBox="0 0 12 12"
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </button>
            
            <div v-if="isDropdownOpen" class="dropdown-menu">
              <div class="file-section" v-if="lastProcessingType === 'python'">
                <h4>Python Processed Files</h4>
                <button 
                  @click="downloadFile('hla_data_ner', 'csv')" 
                  class="file-option"
                >
                  📄 hla_data_ner.csv
                </button>
                <button 
                  @click="downloadFile('hla_data_ner', 'txt')" 
                  class="file-option"
                >
                  📄 hla_data_ner.txt
                </button>
              </div>
              
              <div class="file-section" v-if="lastProcessingType === 'openai'">
                <h4>OpenAI Processed Files</h4>
                <button 
                  @click="downloadFile('hla_data_openai', 'csv')" 
                  class="file-option"
                >
                  📄 hla_data_openai.csv
                </button>
                <button 
                  @click="downloadFile('hla_data_openai', 'txt')" 
                  class="file-option"
                >
                  📄 hla_data_openai.txt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 

    <div v-if="isProcessing" class="processing-section">
      <div class="spinner"></div>
      <p>Processing image to extract HLA data...</p>
    </div>

    <div v-if="result" class="result-section">
      <h3>Processing Result</h3>
      <div class="result-content">
        <pre v-if="result.output">{{ result.output }}</pre>
        <div v-if="result.error" class="error">
          <strong>Error:</strong> {{ result.error }}
        </div>
        <div v-if="result.plots && result.plots.length > 0" class="plots-section">
          <h4>Generated Plots</h4>
          <div v-for="(plot, index) in result.plots" :key="index" class="plot-item">
            <img :src="plot" :alt="`Plot ${index + 1}`" class="result-plot">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HLADocumentProcessor',
  data() {
    return {
      selectedFile: null,
      imagePreview: null,
      pdfPreview: null,
      isDragOver: false,
      isProcessing: false,
      result: null,
      isDropdownOpen: false,
      hasProcessedFiles: false,
      lastProcessingType: null
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // Debug method to check available files
    async checkAvailableFiles() {
      try {
        const response = await fetch('http://localhost:3000/api/list-files');
        const data = await response.json();
        console.log('Available files:', data.files);
        alert(`Available files in output directory:\n${data.files.join('\n')}`);
      } catch (error) {
        console.error('Error checking files:', error);
        alert('Error checking files: ' + error.message);
      }
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0];
      this.processFileSelection(file);
    },
    
    handleDragOver(event) {
      this.isDragOver = true;
    },
    
    handleDragLeave(event) {
      this.isDragOver = false;
    },
    
    handleDrop(event) {
      this.isDragOver = false;
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.processFileSelection(files[0]);
      }
    },
    
    processFileSelection(file) {
      if (!file || (!file.type.includes('png') && !file.type.includes('pdf'))) {
        alert('Please select a PNG image or PDF file.');
        return;
      }

      this.selectedFile = file;
      this.result = null;
      this.imagePreview = null;
      this.pdfPreview = null;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (file.type.includes('png')) {
          this.imagePreview = e.target.result;
        } else if (file.type.includes('pdf')) {
          this.pdfPreview = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    },
    
    clearFile() {
      this.selectedFile = null;
      this.imagePreview = null;
      this.pdfPreview = null;
      this.result = null;
      this.hasProcessedFiles = false;
      this.lastProcessingType = null;
      this.$refs.fileInput.value = '';
    },
    
    async processImage(processingType = 'python') {
      if (!this.selectedFile) return;

      this.isProcessing = true;
      this.result = null;
      this.lastProcessingType = processingType;

      try {
        const formData = new FormData();
        formData.append('image', this.selectedFile);

        const endpoint = processingType === 'openai' 
          ? 'http://localhost:3000/api/process-hla-document-openai'
          : 'http://localhost:3000/api/process-hla-light';

        console.log('Sending request to:', endpoint);
        console.log('File being sent:', this.selectedFile.name);

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Full processing result:', result);
        console.log('result.output:', result.output);
        console.log('result.error:', result.error);
        console.log('Type of result.output:', typeof result.output);
        
        this.result = result;
        
        // Check what we're actually testing for
        console.log('Condition test - result.output:', !!result.output);
        console.log('Condition test - !result.error:', !result.error);
        console.log('Combined condition:', !!(result.output && !result.error));
        
        // More permissive condition - enable download if we got any successful response
        if (result && !result.error) {
          this.hasProcessedFiles = true;
          console.log('✅ hasProcessedFiles set to true');
        } else {
          console.log('❌ hasProcessedFiles NOT set - conditions not met');
        }

      } catch (error) {
        console.error('Processing error:', error);
        this.result = {
          error: `Processing failed: ${error.message}. Please check if the service is running.`
        };
      } finally {
        this.isProcessing = false;
      }
    },

    toggleDropdown() {
      console.log('Toggle dropdown clicked, current state:', this.isDropdownOpen);
      this.isDropdownOpen = !this.isDropdownOpen;
      console.log('New dropdown state:', this.isDropdownOpen);
    },

    async downloadFile(filename, extension) {
      try {
        const response = await fetch(`http://localhost:3000/api/download/${filename}.${extension}`, {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error(`Download failed: ${response.statusText}`);
        }

        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.isDropdownOpen = false;
        console.log(`Downloaded: ${filename}.${extension}`);

      } catch (error) {
        console.error('Download error:', error);
        alert(`Download failed: ${error.message}`);
      }
    },

    // Close dropdown when clicking outside
    handleClickOutside(event) {
      const downloadContainer = this.$el?.querySelector('.download-container');
      if (downloadContainer && !downloadContainer.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style scoped>
.hla-document-processor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.upload-section h2 {
  color: #333;
  margin-bottom: 20px;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.upload-area:hover, .upload-area.drag-over {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.upload-placeholder svg {
  color: #666;
  margin-bottom: 15px;
}

.upload-placeholder p {
  color: #666;
  margin: 0;
  font-size: 16px;
}

.file-selected {
  position: relative;
}

.image-preview {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.clear-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.process-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.process-btn:hover:not(:disabled) {
  background: #0056b3;
}

.process-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* Download Button Styles */
.download-container {
  position: relative;
  display: inline-block;
}

.dropdown {
  position: relative;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.download-btn:hover {
  background: #218838;
}

.arrow {
  transition: transform 0.2s ease;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 220px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
  padding: 8px 0;
}

.file-section {
  padding: 8px 0;
}

.file-section:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.file-section h4 {
  margin: 0 0 8px 0;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.file-option {
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-option:hover {
  background: #f8f9fa;
}

.file-option:active {
  background: #e9ecef;
}

.processing-section {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.result-section {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.result-section h3 {
  color: #333;
  margin-top: 0;
}

.result-content pre {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

.plots-section {
  margin-top: 20px;
}

.plots-section h4 {
  color: #333;
  margin-bottom: 15px;
}

.plot-item {
  margin-bottom: 15px;
}

.result-plot {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>