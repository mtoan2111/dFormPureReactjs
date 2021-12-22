import React, { useEffect, useState } from "react";
import styles from "./formcreate.module.css";
import TextInput from "../../components/textinput/textinput";
import Form from "../../components/form/form";
import Notify from "../../components/notify";
import { useNavigate } from "react-router-dom";

const FormCreate = () => {
    let raws = [];
    let title = "";

    const [forms, setForms] = useState([]);
    const [total, setTotal] = useState(0);
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMsg, setSnackMsg] = useState("");
    const [alertType, setAlertType] = useState("success");
    const [openLoading, setOpenLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const { contract, walletConnection } = window;
        const userId = walletConnection.getAccountId();
        contract
            ?.get_form_count?.({
                userId: userId,
            })
            .then((total) => {
                onGetForms({ total });
                setTotal(total);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const onCreateNewFormBtnClicked = () => {
        setOpenLoading(true);
        const { contract } = window;
        contract
            ?.init_new_form?.(
                {
                    title: title,
                },
                300000000000000,
            )
            .then((id) => {
                navigate(`/form?id=${id}`);
            })
            .catch((err) => {
                onShowResult({
                    type: "error",
                    msg: String(err),
                });
            });
    };

    const onNewFormTitleChanged = (value) => {
        title = value;
    };

    const onShowResult = ({ type, msg }) => {
        setOpenLoading(false);
        setOpenSnack(true);
        setAlertType(type);
        setSnackMsg(msg);
    };

    const onShowEditForm = ({ id, qCounter }) => {
        navigate(`/form-detail?id=${id}&c=${qCounter}`);
    };

    const onGetForms = ({ total }) => {
        try {
            const { contract, walletConnection } = window;
            const num_page = parseInt(total / 5) + 1;
            const page_arr = new Array(num_page).fill(0);
            setForms([]);
            const userId = walletConnection.getAccountId();
            page_arr.map((page, index) => {
                contract
                    .get_forms({
                        userId,
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
                                let forms = [];
                                raws.map((raw) => {
                                    forms = [...forms, ...(raw?.data || [])];
                                });
                                setForms([...forms]);
                            }
                        }
                    });
            });
        } catch (err) {}
    };

    const onCloseSnack = () => {
        setOpenSnack(false);
    };
    return (
        <>
            <Notify openLoading={openLoading} openSnack={openSnack} alertType={alertType} snackMsg={snackMsg} onClose={onCloseSnack} />
            <div className={styles.root}>
                <div className={styles.new_form_title}>Create new form</div>
                <div className={styles.new_form_area}>
                    <TextInput placeholder={"Type your form name here"} onChange={onNewFormTitleChanged} className={styles.create_form_input} />
                    <div className={styles.create_form_btn_area}>
                        <button className={styles.create_form_btn} onClick={onCreateNewFormBtnClicked}>
                            Create
                        </button>
                    </div>
                </div>
                <div className={styles.your_form_title}>Your form(s): {total}</div>
                <div className={styles.your_form}>
                    {forms?.map?.((form) => {
                        const { id, owner, q_counter, title } = form;
                        return <Form key={id} id={id} owner={owner} qCounter={q_counter} title={title} onViewMore={onShowEditForm} />;
                    })}
                </div>
            </div>
        </>
    );
};

export default FormCreate;
