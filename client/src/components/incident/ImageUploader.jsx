import { Upload } from 'lucide-react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';

export const ImageUploader = ({ images, setImages }) => {
  const { upload, uploading, progress, error } = useCloudinaryUpload();
  const onChange = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 3 - images.length);
    if (!files.length) return;
    const urls = await upload(files);
    setImages([...images, ...urls]);
  };
  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500 hover:bg-gray-50">
        <Upload className="mb-2 h-5 w-5" />
        Upload up to 3 images
        <input className="hidden" type="file" accept="image/*" multiple onChange={onChange} />
      </label>
      {uploading && <div className="mt-3 h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-green-600" style={{ width: `${progress}%` }} /></div>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {images.map((src) => <img key={src} src={src} alt="Incident upload" className="h-24 w-full rounded-lg object-cover" />)}
      </div>
    </div>
  );
};
