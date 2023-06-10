// frontend\src\components\common\Message.jsx

const Message = ({ variant, children }) => {
  let classes = "";

  switch (variant) {
    case 'danger':
      classes = 'bg-red-100 border-red-500 text-red-700';
      break;
    case 'success':
      classes = 'bg-green-100 border-green-500 text-green-700';
      break;
    case 'info':
      classes = 'bg-blue-100 border-blue-500 text-blue-700';
      break;
    default:
      classes = 'bg-blue-100 border-blue-500 text-blue-700';
  }

  return (
    <div
      className={`rounded border-l-4 p-4 mt-4 mb-4 ${classes}`}
      role="alert"
    >
      {children}
    </div>
  );
};


Message.defaultProps = {
  variant: 'info',
};

export default Message;
