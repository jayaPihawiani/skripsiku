import Spinner from "react-bootstrap/Spinner";

function SpinnerLoading() {
  return (
    <div className="container w-100 d-flex align-items-center justify-content-center min-vh-100">
      <Spinner animation="border" />
    </div>
  );
}

export default SpinnerLoading;
