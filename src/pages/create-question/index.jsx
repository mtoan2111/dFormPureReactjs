import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./question.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Notify from "../../components/notify";
import { useLocation, useNavigate } from "react-router-dom";

const Question = () => {
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"];
    const questionType = [
        {
            id: 0,
            title: "Yes/No question",
        },
        {
            id: 1,
            title: "Choose one answer",
        },
        {
            id: 2,
            title: "Choose multi answer",
        },
        {
            id: 3,
            title: "Fill to the blank space",
        },
    ];

    const [onceAnswer, setOnceAnswer] = useState([]);
    const [qTypeId, setQTypeId] = useState(null);
    const [title, setTitle] = useState("");
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMsg, setSnackMsg] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [openLoading, setOpenLoading] = useState(false);

    const useQuery = () => {
        const { search } = useLocation();
        return new URLSearchParams(search);
    };

    const query = useQuery();
    const navigate = useNavigate();

    const onQuestionTypeChange = (e, newValue) => {
        if (newValue) {
            setQTypeId(newValue.id);
        } else {
            setQTypeId(null);
        }
    };

    const onCreateNewQuestion = () => {
        setOpenLoading(true);
        const formId = query.get("form_id");
        const { contract } = window;
        if (qTypeId === null) {
            return onShowResult({
                type: "error",
                msg: "Question type could not be empty",
            });
        }

        if (title === "" || title === null) {
            return onShowResult({
                type: "error",
                msg: "Question title could not be empty",
            });
        }

        let meta = "";
        if (qTypeId !== 0 && qTypeId !== 3 && onceAnswer.length < 2) {
            return onShowResult({
                type: "error",
                msg: "The answer need to be greater than equal two",
            });
        }
        if (onceAnswer.length > 0) {
            let metas = [];
            let err = null;
            onceAnswer?.map((answer) => {
                if (answer.value === "") {
                    err = {
                        type: "error",
                        msg: "The answer could not be empty",
                    };
                }
                metas.push(answer.value?.trim?.());
            });
            if (err !== null) {
                return onShowResult(err);
            }
            if (metas.length !== new Set(metas).size) {
                return onShowResult({
                    type: "error",
                    msg: "The answer could not be dupplicated",
                });
            }
            meta = metas.join(";");
        }

        contract
            .new_question(
                {
                    formId,
                    type: qTypeId,
                    title,
                    meta,
                },
                300000000000000,
            )
            .then((question) => {
                if (question) {
                    setTitle("");
                    setQTypeId(null);
                    setOnceAnswer([]);
                    onShowResult({
                        type: "success",
                        msg: "New question has been added to this form",
                        title: "",
                    });
                } else {
                    onShowResult({
                        type: "error",
                        msg: "Create new question failure",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                onShowResult({
                    type: "error",
                    msg: err,
                });
            });
    };

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    const onShowResult = ({ type, msg, nTitle }) => {
        setOpenLoading(false);
        setOpenSnack(true);
        setAlertType(type);
        setSnackMsg(msg);
        setTitle(nTitle || title);
    };

    const onFinishCreateQuestion = () => {
        const formId = query.get("form_id");
        navigate(`/form-detail?id=${formId}`);
    };

    const onQuestionTitleChanged = (e) => {
        setTitle(e.target.value);
    };

    const onRenderQuestionType = () => {
        if (qTypeId !== null) {
            switch (qTypeId) {
                case 0:
                    return onRenderYesNoQuestion();
                case 1:
                    return onRenderOnceQuestion();
                case 2:
                    return onRenderOnceQuestion();
                case 3:
                    return onRenderFillQuestion();
                default:
                    return;
            }
        }
    };

    const onRenderYesNoQuestion = () => {
        return (
            <div className={styles.question_block_content}>
                <div className={styles.question_block_title}>Your question</div>
                <div className={styles.question_block_input}>
                    <div className={styles.question_block_text_input_area}>
                        <input
                            className={styles.question_block_text_input}
                            placeholder={"Type your question title here"}
                            onChange={onQuestionTitleChanged}
                            value={title}
                        />
                    </div>
                    <div className={styles.question_block_input_item}>
                        <div className={styles.question_block_input_item_icon}>A</div>
                        <div className={styles.question_block_input_item_value}>True</div>
                    </div>
                    <div className={styles.question_block_input_item}>
                        <div className={styles.question_block_input_item_icon}>B</div>
                        <div className={styles.question_block_input_item_value}>False</div>
                    </div>
                </div>
            </div>
        );
    };

    const onRenderFillQuestion = () => {
        return (
            <div className={styles.question_block_content}>
                <div className={styles.question_block_title}>Your question</div>
                <div className={styles.question_block_input}>
                    <div className={styles.question_block_text_input_area}>
                        <input
                            className={styles.question_block_text_input}
                            placeholder={"Type your question title here"}
                            onChange={onQuestionTitleChanged}
                            value={title}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const onAddNewOnceAnswer = () => {
        console.log(123);
        onceAnswer.push({ value: "" });
        setOnceAnswer([...onceAnswer]);
    };

    const onRemoveOnceAnswer = (index) => {
        onceAnswer.splice(index, 1);
        setOnceAnswer([...onceAnswer]);
    };

    const onOnceQuestionChangedValue = (e, answer) => {
        if (answer) {
            answer.value = e.target.value;
            setOnceAnswer([...onceAnswer]);
        }
    };

    const onRenderOnceQuestion = () => {
        return (
            <div className={styles.question_block_content}>
                <div className={styles.question_block_title}>Your question</div>
                <div className={styles.question_block_input}>
                    <div className={styles.question_block_text_input_area}>
                        <input
                            className={styles.question_block_text_input}
                            placeholder={"Type your question title here"}
                            onChange={onQuestionTitleChanged}
                            value={title}
                        />
                    </div>
                    {onceAnswer?.map?.((answer, index) => {
                        return (
                            <div key={index} className={styles.question_block_input_item}>
                                <div className={styles.question_block_input_item_icon}>{alphabet[index]}</div>
                                <div className={styles.question_block_input_item_value}>
                                    <input
                                        value={answer.value}
                                        onChange={(e) => onOnceQuestionChangedValue(e, answer)}
                                        className={styles.question_block_text_input_item}
                                    />
                                </div>
                                <button onClick={() => onRemoveOnceAnswer(index)} className={styles.question_block_remove_button}>
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
                <button onClick={onAddNewOnceAnswer} className={styles.question_block_new_button}>
                    + Add New Answer
                </button>
            </div>
        );
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.question_area}>
                    <h2>Create New Question</h2>
                    <div className={styles.question_block}>
                        <div className={styles.question_block_title}>Question Type</div>
                        <div className={styles.question_block_input}>
                            <Autocomplete
                                className={styles.question_type_cbx}
                                disablePortal
                                id="combo-box-demo"
                                options={questionType}
                                getOptionLabel={(option) => option.title}
                                sx={{ width: 300 }}
                                onChange={onQuestionTypeChange}
                                renderInput={(params) => <TextField {...params} className={styles.question_type_cbx} />}
                            />
                        </div>
                        {onRenderQuestionType()}
                        <div className={styles.question_block_btn_area}>
                            <button className={styles.question_block_btn_finish} onClick={onFinishCreateQuestion}>
                                Finish
                            </button>
                            <button className={styles.question_block_btn_new} onClick={onCreateNewQuestion}>
                                New Question
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(Question);
