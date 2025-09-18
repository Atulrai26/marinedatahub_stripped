import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImageUploadTab = ({ onImageUpload, uploadedImages, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    const imageFiles = files?.filter(file => file?.type?.startsWith('image/'));
    if (imageFiles?.length > 0) {
      onImageUpload(imageFiles);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    if (files?.length > 0) {
      onImageUpload(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5' :'border-border bg-muted/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto">
              <Icon name="Loader2" size={48} className="animate-spin text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">Processing Images...</p>
              <p className="text-sm text-muted-foreground">AI analysis in progress</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto">
              <Icon name="Upload" size={48} color="var(--color-muted-foreground)" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">Upload Otolith Images</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop images here, or click to browse
              </p>
            </div>
            <Button
              variant="outline"
              onClick={openFileDialog}
              iconName="ImagePlus"
              iconPosition="left"
            >
              Select Images
            </Button>
            <div className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, TIFF • Max size: 10MB per image
            </div>
          </div>
        )}
      </div>
      {/* Image Thumbnails */}
      {uploadedImages?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploadedImages?.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={image?.url}
                    alt={`Otolith ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <Icon
                    name="ZoomIn"
                    size={24}
                    color="white"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
                <div className="absolute top-2 right-2 bg-card rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Icon name="Eye" size={16} color="var(--color-muted-foreground)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full bg-card rounded-lg overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={closeImageModal}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="p-4">
              <Image
                src={selectedImage?.url}
                alt="Enlarged otolith"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploadTab;