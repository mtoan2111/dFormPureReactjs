import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Notify from "../../components/notify";
import styles from "./formanalysis.module.css";

const FormAnalysisDetail = () => {
    const color = [
        "linear-gradient(135deg, #007AFF, #23D2FF)",
        "linear-gradient(135deg, #FFD3A5, #FD6585)",
        "linear-gradient(135deg, #FC3B63, #711DDF)",
        "linear-gradient(135deg, #69F9CC, #F8B0AD, #F6E884)",
        "linear-gradient(135deg, #EE9AB1, #FCFF00)",
        "linear-gradient(135deg, #EE9AE5, #5961F9)",
        "#FFD166",
        "#FA8F54",
    ];
    let participantRaws = [];
    const [form, setForm] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMsg, setSnackMsg] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [openLoading, setOpenLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        onGetForm();
    }, []);

    const useQuery = () => {
        const { search } = useLocation();
        return new URLSearchParams(search);
    };

    const query = useQuery();

    const onGetForm = () => {
        const { contract, walletConnection } = window;
        const userId = walletConnection.getAccountId();
        const id = query.get("id");
        contract
            ?.get_form?.({
                userId,
                id,
            })
            .then((formret) => {
                setForm(formret);
                onGetParticipants(formret);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGetParticipants = (form) => {
        const { contract, walletConnection } = window;
        const { id, q_participant } = form;
        const num_page = parseInt(q_participant / 5) + 1;
        const page_arr = new Array(num_page).fill(0);
        setParticipants([]);
        participantRaws = [];
        page_arr.map((page, index) => {
            contract
                .get_participants({
                    formId: id,
                    page: index + 1,
                })
                .then((data) => {
                    if (data) {
                        const pIndex = participantRaws.findIndex((x) => x?.page === data?.page);
                        if (pIndex === -1) {
                            participantRaws.push(data);
                            participantRaws.sort((a, b) => {
                                if (a.page < b.page) return -1;
                                if (a.page > b.page) return 1;
                                return 0;
                            });
                            let participants = [];
                            participantRaws.map((raw) => {
                                participants = [...participants, ...(raw?.data || [])];
                            });

                            setParticipants([...participants]);
                        }
                    }
                });
        });
    };

    const onParticipantDetailClicked = (participant) => {
        navigate(`/participant-result?u=${participant}&id=${form.id}`);
    };

    const onCloseSnack = () => {
        setOpenSnack(false);
    };

    const onRenderParticipant = (participant, index) => {
        const shortName = `${participant?.[0]}${participant?.[1]}`;
        return (
            <div className={styles.participant_area} key={index} onClick={() => onParticipantDetailClicked(participant)}>
                <div
                    className={styles.participant_area_avata}
                    style={{
                        background: onRandomColorBg(),
                    }}
                >
                    {shortName}
                </div>
                <div className={styles.participant_area_name}>{participant}</div>
            </div>
        );
    };

    const onRandomColorBg = () => {
        return color[Math.floor(Math.random() * 5)];
    };

    const onRenderFormDetail = () => {
        if (form) {
            const { title, q_counter, q_participant } = form;
            return (
                <div className={styles.root}>
                    <div className={styles.your_form_title}>{title}</div>
                    <div className={styles.your_form_text}>Total Question(s): {q_counter}</div>
                    <div className={styles.your_form_text}>Total Participant(s): {q_participant}</div>
                    {participants?.length > 0 ? (
                        <div className={styles.participant_root}>
                            {participants?.map((part, index) => {
                                return onRenderParticipant(part, index);
                            })}
                        </div>
                    ) : (
                        <div className={styles.participant_root}>
                            <div className={styles.nothing_text}>Nothing to display</div>
                        </div>
                    )}
                </div>
            );
        } else {
            return <div>The form is not existed or You do not have permission to see this form analysis</div>;
        }
    };

    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            {onRenderFormDetail()}
        </>
    );
};

export default FormAnalysisDetail;
