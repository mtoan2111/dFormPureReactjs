import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./global.css";
import { Provider } from "react-redux";
import Store from "./redux/store";
import Layout from "./components/layout";
import { onUpdateWallet } from "./redux/action/wallet";
import Dashboard from "./pages/dashboard";
import FormCreate from "./pages/form-create";
import FormAnalysis from "./pages/form-analysis";
import Analysis from "./pages/analysis";
import ParticipantResult from "./pages/participant-result";
import FormDetail from "./pages/form-detail";
import Form from "./pages/form";
import CreateQuestion from "./pages/create-question";
import FormAnswer from "./pages/form-answer";

const App = ({ contract, currentUser, nearConfig, walletConnection }) => {
    Store.dispatch(
        onUpdateWallet({
            contract,
            currentUser,
            nearConfig,
            walletConnection,
        }),
    );
    return (
        <Router>
            <Provider store={Store}>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/form-create" element={<FormCreate />} />
                        <Route path="/form-analysis" element={<FormAnalysis />} />
                        <Route path="/form-detail" element={<FormDetail />} />
                        <Route path="/form-answer" element={<FormAnswer />} />
                        <Route path="/form-analysis-detail" element={<Analysis />} />
                        <Route path="/participant-result" element={<ParticipantResult />} />
                        <Route path="/form" element={<Form />} />
                        <Route path="/create-question" element={<CreateQuestion />} />
                    </Routes>
                </Layout>
            </Provider>
        </Router>
    );
};

export default App;
