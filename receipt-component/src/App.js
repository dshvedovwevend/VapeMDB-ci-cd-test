import "./App.css";
import ReceiptPage from "./Pages/ReceiptPage";
import Success from "./Pages/Success";
import UserInfoForReceipt from "./Pages/UserInfoForReceipt";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

console.log("environemtal var: ", process.env.REACT_APP_SLAVE_MDB_BACKEND_URL);
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route
              path="/receiptPage/:orderId/:transactionId"
              element={<ReceiptPage />}
            />
            <Route path="/success" element={<Success />} />
            <Route
              path="/userinfo/:orderId/"
              element={<UserInfoForReceipt />}
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
