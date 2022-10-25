const Loader = () => {
  return (
    <div className="spinner position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
      <span
        className="spinner-border spinner-border-sm m-auto p-0"
        role="status"
        aria-hidden="true"
      >

      </span>
    </div>
  );
};
export default Loader;
