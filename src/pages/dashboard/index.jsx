import React, { useState } from "react";
import styles from "./dashboard.module.css";
import SearchInput from "../../components/search/search";
import Notify from "../../components/notify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMsg, setSnackMsg] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [openLoading, setOpenLoading] = useState(false);

    const navigate = useNavigate();

    const onJoinForm = ({ id }) => {
        if (id === "") {
            return this.onShowResult({
                type: "error",
                msg: "Form id could not be empty",
            });
        }
        navigate(`/form-answer?id=${id}`);
    };

    const onShowResult = ({ type, msg }) => {
        setOpenLoading(false);
        setOpenSnack(true);
        setAlertType(type);
        setSnackMsg(msg);
    };

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.dashboard_join}>Join a form now</div>
                <div className={styles.search_area}>
                    <SearchInput onSearch={onJoinForm} />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
