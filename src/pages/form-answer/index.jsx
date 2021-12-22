import React, { useEffect, useState } from "react";
import YesNoQuestion from "../../components/question/yesno";
import OnceQuestion from "../../components/question/once";
import MultiQuestion from "../../components/question/multi";
import FillQuestion from "../../components/question/fill";
import styles from "./form.module.css";
import Notify from "../../components/notify";
import { useLocation, useNavigate } from "react-router-dom";

const FormAnswer = () => {
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMsg, setSnackMsg] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [openLoading, setOpenLoading] = useState(false);
    const [formId, setFormId] = useState("");
    const [question, setQuestion] = useState({});

    const useQuery = () => {
        const { search } = useLocation();
        return new URLSearchParams(search);
    };

    const query = useQuery();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const { contract, walletConnection, nearConfig } = window;
            if (!walletConnection.isSignedIn()) {
                return walletConnection?.requestSignIn?.(nearConfig?.contractName);
            }

            const id = query.get("id");
            setFormId(id);
            const userId = walletConnection.getAccountId();
            onLoadingQuestion({ formId: id, userId });
        } catch (err) {
            console.log(err);
            onLoadingCompleted();
        }
    }, []);

    const onLoadingQuestion = ({ formId, userId }) => {
        setOpenLoading(true);
        setQuestion(null);
        const { contract } = window;
        contract
            .get_question({
                formId,
                userId,
            })
            .then((questionret) => {
                if (questionret) {
                    setQuestion({ ...questionret });
                    onLoadingCompleted();
                } else {
                    setQuestion({});
                    onLoadingCompleted();
                }
            })
            .catch((err) => {
                console.log(err);
                setQuestion({});
                onLoadingCompleted();
            });
    };

    const onGetNextQuestion = () => {
        const { walletConnection } = window;
        const id = query.get("id");
        const userId = walletConnection.getAccountId();
        onLoadingQuestion({ formId: id, userId });
    };

    const onLoadingCompleted = () => {
        setOpenLoading(false);
    };

    const onSubmitAnswer = ({ formId, questionId, answer }) => {
        const { contract } = window;
        if (typeof answer === "undefined" || answer === null || answer === "") {
            return onShowResult({
                type: "error",
                msg: "Please choose or type your answer before submit",
            });
        }

        setOpenLoading(true);

        contract
            .submit_answer(
                {
                    formId,
                    questionId,
                    answer,
                },
                300000000000000,
            )
            .then((ret) => {
                if (ret) {
                    onShowResult({
                        type: "success",
                        msg: "Answer has been submited",
                    });
                } else {
                    onShowResult({
                        type: "error",
                        msg: "Submit question failure Or The question has been deleted on time",
                    });
                }
                onGetNextQuestion();
            })
            .catch((err) => {
                onShowResult({
                    type: "error",
                    msg: String(err),
                });
            });
    };

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    const onShowResult = ({ type, msg }) => {
        setOpenLoading(false);
        setOpenSnack(true);
        setAlertType(type);
        setSnackMsg(msg);
    };

    const onRenderQuestion = () => {
        if (question !== null) {
            const { id, type, title, meta } = question;
            switch (type) {
                case 0:
                    return <YesNoQuestion formId={formId} id={id} title={title} meta={meta} onSubmitAnswer={onSubmitAnswer} />;
                case 1:
                    return <OnceQuestion formId={formId} id={id} title={title} meta={meta} onSubmitAnswer={onSubmitAnswer} />;
                case 2:
                    return <MultiQuestion formId={formId} id={id} title={title} meta={meta} onSubmitAnswer={onSubmitAnswer} />;
                case 3:
                    return <FillQuestion formId={formId} id={id} title={title} meta={meta} onSubmitAnswer={onSubmitAnswer} />;
                default:
                    return onRenderNoQuestion();
            }
        }
        return onRenderNoQuestion();
    };

    const onRenderLoadingQuestion = () => {};

    const onViewResultClicked = () => {
        const { walletConnection } = window;
        const userId = walletConnection.getAccountId();
        navigate(`/participant-result?u=${userId}&id=${formId}`);
    };

    const onRenderNoQuestion = () => {
        return (
            <div className={styles.no_question_area}>
                Your exam has already done. View your result{" "}
                <span className={styles.result_link} onClick={onViewResultClicked}>
                    now
                </span>
            </div>
        );
    };
    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>{onRenderQuestion()}</div>
        </>
    );
};

export default FormAnswer;
