import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrag = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === 'dragenter' || event.type === 'dragover');
  }, []);

  const applyFiles = useCallback((incomingFiles: File[]) => {
    const files = incomingFiles.filter((file) => file.name.endsWith('.java'));

    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    applyFiles(Array.from(event.dataTransfer.files));
  }, [applyFiles]);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    applyFiles(Array.from(event.target.files || []));
  }, [applyFiles]);

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className="space-y-4">
      <motion.div
        className={`relative overflow-hidden rounded-3xl border p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-cyan-300 bg-cyan-400/10 shadow-cyan-500/20'
            : 'border-white/10 bg-white/[0.06] hover:border-cyan-300/50'
        } ${isAnalyzing ? 'opacity-60 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.16),transparent_30%)]" />
        <div className="relative">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/30">
            {isAnalyzing ? <Sparkles className="h-8 w-8 animate-pulse" /> : <Upload className="h-8 w-8" />}
          </div>
          <p className="mb-2 text-xl font-semibold text-white">
            Upload Java source files
          </p>
          <p className="mx-auto mb-6 max-w-xl text-sm text-slate-300">
            The dashboard calculates WMC, RFC, CBO, LCOM, and DIT, then converts the evidence into a design grade and refactoring backlog.
          </p>
          <input
            type="file"
            multiple
            accept=".java"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isAnalyzing}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex cursor-pointer items-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-200"
          >
            Choose .java files
          </label>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="font-medium text-slate-200">Selected files</h3>
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] p-4"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-cyan-300" />
                  <span className="text-sm font-medium text-white">{file.name}</span>
                  <span className="text-xs text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="rounded-full p-1 transition hover:bg-white/10"
                  disabled={isAnalyzing}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4 text-slate-300" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
