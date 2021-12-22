// import { withRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "./participantresult.module.css";
import Skeleton from "@mui/material/Skeleton";
import { useLocation } from "react-router-dom";

const ParticipantResult = () => {
    const qType = ["Yes/No question", "Choose one answer", "Choose multi answer", "Fill to the blank space"];
    let raws = [];
    let qCounter = 0;

    const [userId, setUserId] = useState("");
    const [form, setForm] = useState({});
    const [skeletons, setSkeletons] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        getForm();
    }, []);

    const useQuery = () => {
        const { search } = useLocation();
        return new URLSearchParams(search);
    };

    const query = useQuery();

    const getForm = () => {
        const { contract, walletConnection } = window;
        const id = query.get("id");
        const userId = query.get("u");
        setUserId(userId);
        contract
            .get_form({
                id,
            })
            .then((formret) => {
                if (formret) {
                    if (formret.q_counter > 0) {
                        setSkeletons(new Array(formret.q_counter).fill(0));
                    }
                    getAnswers(formret.q_counter);
                    setForm({ ...formret });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getAnswers = (total) => {
        const { contract, walletConnection } = window;
        const id = query.get("id");
        const userId = query.get("u");
        const num_page = total % 5 === 0 ? parseInt(total / 5) : parseInt(total / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        setAnswers([]);
        raws = [];
        page_arr.map((page, index) => {
            contract
                .get_answer_statistical(
                    {
                        userId,
                        formId: id,
                        page: index + 1,
                    },
                    300000000000000,
                )
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
                            let answers = [];
                            raws.map((raw) => {
                                answers = [...answers, ...(raw?.data || [])];
                            });
                            setAnswers([...answers]);
                        }
                    }
                });
        });
    };

    const onRenderAnswer = (ans, index) => {
        const { type, title, answer } = ans;
        let anw_tranform = answer;
        if (answer === "" || answer === null) {
            anw_tranform = "Does not have any answers";
        }
        let meta = anw_tranform.split("*");
        return (
            <div className={styles.answer_area} key={`ans_${index}`}>
                <div className={styles.answer_type}>Question Type: {qType[type]}</div>
                <div>
                    <span className={styles.answer_title}>Quesion:</span> {title}
                </div>
                <div className={styles.answer_title}>
                    Answer:{" "}
                    {meta?.map((me, index) => {
                        return (
                            <span className={styles.answer} key={index}>
                                {me};
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    };

    const onRenderSkeletons = () => {
        return skeletons?.map?.((skl, index) => {
            return (
                <div className={styles.answer_skeleton} key={index}>
                    <Skeleton height={140} variant="rectangular" key={index} className={styles.answer_skeleton_item} animation="wave" />
                </div>
            );
        });
    };

    const onRenderAnswers = () => {
        return (
            <>
                {answers?.map?.((answer, index) => {
                    return onRenderAnswer(answer, index);
                })}
            </>
        );
    };

    const { title } = form;
    return (
        <div className={styles.root}>
            <div className={styles.form_title}>{title}</div>
            <div className={styles.form_answer}>
                The answer of <span className={styles.answer_userId}>{userId}</span> as follow:
            </div>
            {answers?.length === 0 ? onRenderSkeletons() : onRenderAnswers()}
            {/* {onRenderSkeletons()}
                {answers?.map?.((answer, index) => {
                    return onRenderAnswer(answer, index);
                })} */}
        </div>
    );
};

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(ParticipantResult);
