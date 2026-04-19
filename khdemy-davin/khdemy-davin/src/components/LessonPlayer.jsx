const LessonPlayer = ({ videoUrl, title }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <video
        controls
        className="w-full rounded-2xl shadow-2xl"
        src={videoUrl}           // ← this comes from your database
      >
        Your browser does not support video.
      </video>
    </div>
  );
};

export default LessonPlayer;