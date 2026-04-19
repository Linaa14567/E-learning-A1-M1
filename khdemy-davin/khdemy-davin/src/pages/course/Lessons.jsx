import { useState } from 'react';
import axios from 'axios';

const AddLessonForm = ({ courseId, onLessonAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');   // final URL after upload
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('access_token'); // from your login

  // ================== UPLOAD VIDEO ==================
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setUploading(true);
    setMessage('Uploading video...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/files/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const filename = res.data.filename; // ← change if your API returns different key
      const fullVideoUrl = `/api/files/download?file_name=${filename}`;

      setVideoUrl(fullVideoUrl);
      setMessage(`✅ Video uploaded! Ready to save.`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  // ================== SAVE LESSON TO COURSE ==================
  const saveLesson = async () => {
    if (!title || !videoUrl) {
      setMessage('Please fill title and upload video');
      return;
    }

    try {
      await axios.post(`/api/courses/${courseId}/lessons`, [
        {
          title,
          description,
          video_url: videoUrl,          // ← this is the important line
        }
      ], {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Lesson added successfully!');
      onLessonAdded?.(); // refresh parent component
    } catch (err) {
      setMessage('❌ Failed to save lesson');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Lesson</h2>

      <input
        type="text"
        placeholder="Lesson Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border rounded mb-4 h-24"
      />

      <label className="block mb-2 font-medium">Upload Video File (MP4)</label>
      <input
        type="file"
        accept="video/mp4,video/webm"
        onChange={handleVideoUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        disabled={uploading}
      />

      {videoUrl && (
        <p className="mt-3 text-green-600 text-sm">
          Video ready: {videoUrl}
        </p>
      )}

      <button
        onClick={saveLesson}
        disabled={!videoUrl || uploading}
        className="mt-6 w-full bg-green-600 text-white py-4 rounded-xl font-semibold disabled:bg-gray-400"
      >
        {uploading ? 'Uploading...' : 'Save Lesson'}
      </button>

      {message && <p className="mt-4 text-center font-medium">{message}</p>}
    </div>
  );
};

export default AddLessonForm;