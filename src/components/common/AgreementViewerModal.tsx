import React, { useEffect, useState } from 'react';
import { Download, ExternalLink, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { masterApi } from '../../api/master.api';

export interface AgreementViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  outletId?: string;
  outletName?: string;
  fileName?: string;
}

export const AgreementViewerModal: React.FC<AgreementViewerModalProps> = ({
  isOpen,
  onClose,
  outletId,
  outletName,
  fileName,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>('');
  const [resolvedFileName, setResolvedFileName] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !outletId) {
      if (fileUrl) {
        window.URL.revokeObjectURL(fileUrl);
        setFileUrl(null);
      }
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    masterApi
      .getOutletAgreementBlob(outletId, fileName)
      .then((data) => {
        if (!isMounted) return;
        setFileUrl(data.url);
        setContentType(data.contentType);
        setResolvedFileName(data.filename || fileName || 'Agreement Document');
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.response?.data?.message || 'Failed to load agreement document preview.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
      if (fileUrl) {
        window.URL.revokeObjectURL(fileUrl);
      }
    };
  }, [isOpen, outletId, fileName]);

  const handleDownload = () => {
    if (!outletId) return;
    masterApi.downloadOutletAgreement(outletId, resolvedFileName || fileName);
  };

  const handleOpenExternal = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const isPdf =
    contentType.includes('pdf') ||
    (fileName || resolvedFileName).toLowerCase().endsWith('.pdf');

  const isImage =
    contentType.startsWith('image/') ||
    /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(fileName || resolvedFileName);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={resolvedFileName || fileName || 'Agreement Document'}
      description={outletName ? `Franchise agreement for outlet: ${outletName}` : 'Uploaded franchise agreement document'}
      size="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500 truncate max-w-sm">
            {contentType ? `Type: ${contentType}` : ''}
          </div>
          <div className="flex items-center gap-2">
            {fileUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenExternal}
                leftIcon={<ExternalLink className="w-4 h-4" />}
              >
                Open in Full Window
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="min-h-[400px] flex flex-col justify-center items-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            <p className="text-sm font-medium">Loading document preview...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center max-w-md">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-sm font-semibold text-slate-800">Could Not Preview Document</p>
            <p className="text-xs text-slate-500">{error}</p>
            <Button variant="outline" size="sm" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
              Try Direct Download Instead
            </Button>
          </div>
        ) : fileUrl && isPdf ? (
          <iframe
            src={fileUrl}
            title="Agreement PDF Viewer"
            className="w-full h-[65vh] rounded-lg border border-slate-200 shadow-inner bg-slate-100"
          />
        ) : fileUrl && isImage ? (
          <div className="w-full flex items-center justify-center p-4 bg-slate-900/5 rounded-lg overflow-auto max-h-[65vh]">
            <img
              src={fileUrl}
              alt="Agreement document"
              className="max-h-[60vh] object-contain shadow-md rounded border border-white"
            />
          </div>
        ) : fileUrl ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center max-w-lg bg-slate-50 rounded-xl border border-slate-200 p-8 w-full">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shadow-sm">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">{resolvedFileName || fileName}</p>
              <p className="text-xs text-slate-500 mt-1">
                This document format cannot be rendered directly inline. You can download or open it in your local desktop viewer (e.g. Microsoft Word).
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="primary" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
                Download Document
              </Button>
              <Button variant="outline" onClick={handleOpenExternal} leftIcon={<ExternalLink className="w-4 h-4" />}>
                Open File
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default AgreementViewerModal;
