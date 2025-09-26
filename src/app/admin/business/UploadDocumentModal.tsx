import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Loader2, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
// import businessService from "../../api/services/businessService";
import businessService from "../../../api/services/businessService";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  businessId: string;
}

const documentTypes = [
  { value: "business_registration", label: "Business Registration" },
  { value: "tax_certificate", label: "Tax Certificate" },
  { value: "owner_id", label: "Owner ID" },
  { value: "utility_bill", label: "Utility Bill" },
  { value: "bank_statement", label: "Bank Statement" },
  { value: "other", label: "Other" },
];

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ isOpen, onClose, onSuccess, businessId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("business_registration");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (!documentType) {
      toast.error("Please select a document type.");
      return;
    }

    setIsUploading(true);
    try {
      await businessService.uploadBusinessDocument(businessId, file, documentType);
      toast.success("Document uploaded successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast.error((error as Error).message || "Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <UploadCloud size={22} className="text-primary-600" />
                Upload Document
              </h3>
              <button className="text-gray-400 hover:text-gray-500" onClick={onClose}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'}`}
              >
                <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">PDF, PNG, JPG up to 10MB</p>
                </label>
              </div>
              {file && (
                <div className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{Math.round(file.size / 1024)} KB</span>
                  <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-6 mt-4 border-t dark:border-gray-700">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg" onClick={onClose}>Cancel</button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isUploading || !file}
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud size={16} />}
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadDocumentModal;