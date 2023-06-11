// frontend\src\components\common\Loader.jsx

const Loader = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500"></div>
    </div>
  );
};

export default Loader;
