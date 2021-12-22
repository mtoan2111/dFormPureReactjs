// import { withRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "./formdetail.module.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import EditQuestionModal from "../../components/modal/editquestion";
import ConfirmationModel from "../../components/modal/confirmation";
import EditFormModal from "../../components/modal/editform";
// import Router from 'next/router';
import Notify from "../../components/notify";
import Tooltip from "@mui/material/Tooltip";
import { useLocation, useNavigate } from "react-router-dom";

const FormDetail = () => {
    const qType = ["Yes/No question", "Choose one answer", "Choose multi answer", "Fill to the blank space"];
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"];
    let max_question = 0;
    let raws = [];

    const [formId, setFormId] = useState("");
    const [editingQuestion, setEditingQuestion] = useState({});
    const [removingQuestion, setRemovingQuestion] = useState({});
    const [removingForm, setRemovingForm] = useState({});
    const [questions, setQuestions] = useState([]);
    const [form, setForm] = useState({});
    const [step, setStep] = useState(0);
    const [err, setErr] = useState(false);
    const [err_msg, setErrMsg] = useState("");
    const [title, setTitle] = useState("");
    const [qCounter, setQCounter] = useState(0);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openRemoveQuestionModal, setOpenRemoveQuestionModal] = useState(false);
    const [openRemoveFormModal, setOpenRemoveFormModal] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [openEditFormTitleModal, setOpenEditFormTitleModal] = useState(false);
    const [snackMsg, setSnackMsg] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [openLoading, setOpenLoading] = useState(false);

    useEffect(() => {
        getFormDetail();
    }, []);

    const useQuery = () => {
        const { search } = useLocation();
        return new URLSearchParams(search);
    };

    const query = useQuery();
    const navigate = useNavigate();

    const getFormDetail = () => {
        const { contract, walletConnection } = window;
        const id = query.get("id");
        const userId = walletConnection.getAccountId();
        contract
            .get_form({
                userId,
                id,
            })
            .then((formret) => {
                if (formret) {
                    setForm({ ...formret });
                    const { id, title, q_counter } = formret;
                    setFormId(id);
                    getAllQuestion(id, q_counter);
                    setStep(1);
                    setTitle(title);
                    setQCounter(q_counter);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getAllQuestion = (formId, total) => {
        const { contract, walletConnection } = window;
        const num_page = parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        const userId = walletConnection.getAccountId();
        setQuestions([]);
        raws = [];
        page_arr.map((page, index) => {
            contract
                .get_questions({
                    userId,
                    formId: formId,
                    page: index + 1,
                })
                .then((data) => {
                    if (data) {
                        const pIndex = raws.findIndex((x) => x?.page === data?.page);
                        if (pIndex === -1) {
                            raws.push(data);
                            raws.sort((a, b) => {
                                if (a.page < b.page) return -1;
                                if (a.page > b.page) return 1;
                                return 0;
                            });
                            let questions = [];
                            raws.map((raw) => {
                                questions = [...questions, ...(raw?.data || [])];
                            });
                            setQuestions([...questions]);
                        }
                    }
                });
        });
    };

    const onEditQuestionBtnClicked = (question) => {
        setEditingQuestion(question);
        // editingQuestion = { ...question };
        setOpenEditModal(true);
    };

    const onCloseEditQuestionModal = () => {
        setEditingQuestion({});
        setOpenEditModal(false);
    };

    const onShowResult = ({ type, msg }) => {
        setOpenSnack(true);
        setSnackMsg(msg);
        setOpenEditModal(false);
        setOpenRemoveFormModal(false);
        setOpenRemoveQuestionModal(false);
        setOpenEditFormTitleModal(false);
        setAlertType(type);
        setOpenLoading(false);
    };

    const onUpdatedQuestionAccept = ({ id, title, meta }) => {
        setOpenEditModal(false);
        setOpenLoading(true);
        const { contract } = window;
        contract
            ?.update_question?.(
                {
                    id,
                    title,
                    meta,
                },
                300000000000000,
            )
            .then((question) => {
                if (question) {
                    getAllQuestion(formId, qCounter);
                    onShowResult({
                        type: "success",
                        msg: "Question has been updated",
                    });
                } else {
                    onShowResult({
                        type: "error",
                        msg: "Update question failure",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                onShowResult({
                    type: "error",
                    msg: String(err),
                });
            });
    };

    const onRemoveQuestionBtnClicked = (question) => {
        setRemovingQuestion(question);
        // removingQuestion = { ...question };
        setOpenRemoveQuestionModal(true);
    };

    const onCloseRemoveQuestionModal = () => {
        setRemovingQuestion({});
        // removingQuestion = {};
        setOpenRemoveQuestionModal(false);
    };

    const onRemoveQuestionDeny = () => {
        onCloseRemoveQuestionModal();
    };

    const onRemoveQuestionAccept = () => {
        setOpenRemoveQuestionModal(false);
        setOpenLoading(true);
        const { contract } = window;
        const { id } = removingQuestion;
        contract
            ?.delete_question(
                {
                    id,
                },
                300000000000000,
            )
            .then((ret) => {
                if (ret) {
                    if (ret) {
                        onShowResult({
                            type: "success",
                            msg: "Question has been deleted",
                        });
                        getFormDetail();
                    } else {
                        onShowResult({
                            type: "error",
                            msg: "Delete question failure",
                        });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                onShowResult({
                    type: "error",
                    msg: String(err),
                });
            });
    };

    const onAddNewQuestionBtnClicked = () => {
        navigate(`/form?id=${formId}`);
    };

    const onRemoveFormBtnClicked = () => {
        setOpenRemoveFormModal(true);
    };

    const onCloseRemoveFormModal = () => {
        setOpenRemoveFormModal(false);
    };

    const onCloseEditFormTitleModal = () => {
        setOpenEditFormTitleModal(false);
    };

    const onEditFormTitleBtnClicked = () => {
        setOpenEditFormTitleModal(true);
    };

    const onRemoveFormAccept = () => {
        setOpenRemoveFormModal(false);
        setOpenLoading(true);
        const { contract } = window;
        contract
            ?.delete_form(
                {
                    id: formId,
                },
                300000000000000,
            )
            .then((ret) => {
                if (ret) {
                    Router.push("/form-create");
                } else {
                    onShowResult({
                        type: "error",
                        msg: "Remove form failure",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                onShowResult({
                    type: "err",
                    msg: String(err),
                });
            });
    };

    const onUpdatedFormAccept = ({ title }) => {
        if (title === "") {
            return onShowResult({
                type: "error",
                msg: "Title could not be empty",
            });
        }

        if (title === form.title) {
            return onShowResult({
                type: "error",
                msg: "Title could not be the same",
            });
        }

        setOpenEditFormTitleModal(false);
        setOpenLoading(true);

        const { contract } = window;
        contract
            ?.update_form(
                {
                    id: formId,
                    title,
                },
                300000000000000,
            )
            .then((ret) => {
                if (ret) {
                    onShowResult({
                        type: "success",
                        msg: "Form has been updated",
                    });
                    getFormDetail();
                } else {
                    onShowResult({
                        type: "error",
                        msg: "Update form failure",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                onShowResult({
                    type: "error",
                    msg: String(err),
                });
            });
    };

    const onGetPublicLinkBtnClicked = () => {
        const uri = new URL(window.location.href);
        const { origin } = uri;
        const sharedLinked = `${origin}/form-answer?id=${formId}`;
        navigator.clipboard.writeText(sharedLinked);
        onShowResult({
            type: "success",
            msg: "Copied",
        });
    };

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    const onRenderStep = () => {
        switch (step) {
            case 0:
                return "Loading Form";
            case 1:
                return onRenderForm();
            default:
                break;
        }
    };

    const onRenderForm = () => {
        return (
            <div className={styles.form_area}>
                <div className={styles.form_header_area}>
                    <div className={styles.form_header_heading}>Your Form Information</div>
                    <div className={styles.form_header_action}>
                        <button className={styles.form_header_action_btnL} onClick={onGetPublicLinkBtnClicked}>
                            Get Link
                        </button>
                        <button className={styles.form_header_action_btnR} onClick={onRemoveFormBtnClicked}>
                            Delete Form
                        </button>
                    </div>
                </div>
                <div className={styles.form_title_area}>
                    <div className={styles.form_title_label}>Title:</div>
                    <div className={styles.form_title_value}>{title}</div>
                    <div className={styles.form_title_edit}>
                        <button className={styles.form_header_action_btnL} onClick={onEditFormTitleBtnClicked}>
                            <Tooltip title={"Edit"}>
                                <EditOutlinedIcon />
                            </Tooltip>
                        </button>
                    </div>
                </div>
                <div className={styles.form_question_area}>
                    <div className={styles.form_question_label}>Question(s): </div>
                    <div className={styles.form_question_value}>{qCounter}</div>
                    <div className={styles.form_question_action}>
                        <button className={styles.form_header_action_btn} onClick={onAddNewQuestionBtnClicked}>
                            <AddOutlinedIcon /> Add New Question
                        </button>
                    </div>
                </div>
                <div className={styles.question_area}>
                    {questions?.map?.((question) => {
                        return onRenderQuestion(question);
                    })}
                </div>
            </div>
        );
    };

    const onRenderQuestion = (question) => {
        const { id, type, title, meta } = question;
        return (
            <div key={id} className={styles.question_detail_area}>
                <div className={styles.question_detail_type}>
                    <div className={styles.question_detail_type_value}>{qType?.[type]}</div>
                    <div className={styles.question_detail_type_action}>
                        <Tooltip title={"Edit"}>
                            <button className={styles.form_header_action_btnL} onClick={() => onEditQuestionBtnClicked(question)}>
                                <EditOutlinedIcon />
                            </button>
                        </Tooltip>
                        <Tooltip title={"Delete"}>
                            <button className={styles.form_header_action_btnR} onClick={() => onRemoveQuestionBtnClicked(question)}>
                                <DeleteOutlinedIcon />
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <div className={styles.question_detail_title}>Title: {title}</div>
                <div>{onRenderQuestionTypeDetail({ type, meta })}</div>
            </div>
        );
    };

    const onRenderQuestionTypeDetail = ({ type, meta }) => {
        let picks = meta?.split(";");
        switch (type) {
            case 0:
                picks = ["True", "False"];
            case 1:
            case 2:
                break;
            case 3:
                picks = [];
                break;
            default:
                break;
        }
        return (
            <div>
                {picks?.map((pick, index) => {
                    return (
                        <div key={index} className={styles.question_block_input_item}>
                            <div className={styles.question_block_input_item_icon}>{alphabet[index]}</div>
                            <div className={styles.question_block_input_item_value}>{pick}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const box_style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        minWidth: 600,
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: "24px",
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <Modal open={openEditModal} onClose={onCloseEditQuestionModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={box_style}>
                    <EditQuestionModal {...editingQuestion} onAccept={onUpdatedQuestionAccept} />
                </Box>
            </Modal>
            <Modal
                open={openRemoveQuestionModal}
                onClose={onCloseRemoveQuestionModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={box_style}>
                    <ConfirmationModel onDeny={onRemoveQuestionDeny} onAccept={onRemoveQuestionAccept} />
                </Box>
            </Modal>
            <Modal open={openRemoveFormModal} onClose={onCloseRemoveFormModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={box_style}>
                    <ConfirmationModel onDeny={onCloseRemoveFormModal} onAccept={onRemoveFormAccept} />
                </Box>
            </Modal>
            <Modal
                open={openEditFormTitleModal}
                onClose={onCloseEditFormTitleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={box_style}>
                    <EditFormModal {...editingQuestion} onAccept={onUpdatedFormAccept} />
                </Box>
            </Modal>
            <div className={styles.root}>{onRenderStep()}</div>
        </>
    );
};

export default FormDetail;
