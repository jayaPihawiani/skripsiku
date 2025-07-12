import Alert from "react-bootstrap/Alert";

function AlertNotify({ showAlert, variantAlert, alertMsg }) {
  if (showAlert) {
    return (
      <Alert variant={variantAlert} className="me-4">
        {alertMsg}
      </Alert>
    );
  }
  return null;
}

export default AlertNotify;
