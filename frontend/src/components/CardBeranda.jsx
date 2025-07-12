import Card from "react-bootstrap/Card";

import "../css/style.css";

function CardBeranda({ icon, qty, action, title, classCard, toolTip }) {
  return (
    <Card
      onClick={action}
      className={`${classCard} card-hover`}
      title={toolTip}
    >
      <Card.Body>
        <div className="row d-flex align-items-center">
          <div className="col d-flex justify-content-between">
            <div className="text-light m-0  ">
              <h3 className="m-0">{qty}</h3>
              <p className="m-0">{title}</p>
            </div>
          </div>
          <div className="col">
            <h2 className="text-center m-0">{icon}</h2>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardBeranda;
