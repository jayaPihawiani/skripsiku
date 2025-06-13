import { useSelector } from "react-redux";

const Dashboard = () => {
  const state = useSelector((state) => state.auth);
  return (
    <p>
      Selamat datang <span className="fw-bold">{state.data.username}</span>
    </p>
  );
};

export default Dashboard;
