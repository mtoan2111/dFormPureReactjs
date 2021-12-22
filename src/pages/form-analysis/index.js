import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
// import Router, { withRouter } from 'next/router';
import Form from "../../components/form/form";
import styles from "./formanalysis.module.css";
import { useNavigate } from "react-router-dom";

// class FormAnalysis extends React.Component {
//     raws = [];
//     forms = [];
//     constructor(props) {
//         super(props);
//         state = {
//             total: 0,
//         };
//     }

//     componentDidMount() {
//         onGetFormsCount();
//     }

//     onGetFormsCount = () => {
//         const { contract, walletConnection } = window;
//         const userId = walletConnection.getAccountId();
//         contract
//             ?.get_form_count?.({
//                 userId: userId,
//             })
//             .then((total) => {
//                 onGetForms({ total });
//                 setState({
//                     total,
//                 });
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     };

//     onGetForms = ({ total }) => {
//         try {
//             const { contract, walletConnection } = window;
//             const num_page = parseInt(total / 5) + 1;
//             const page_arr = new Array(num_page).fill(0);
//             forms = [];
//             const userId = walletConnection.getAccountId();
//             page_arr.map((page, index) => {
//                 contract
//                     .get_forms({
//                         userId,
//                         page: index + 1,
//                     })
//                     .then((data) => {
//                         if (data) {
//                             const pIndex = raws.findIndex((x) => x?.page === data?.page);
//                             if (pIndex === -1) {
//                                 raws.push(data);
//                                 raws.sort((a, b) => {
//                                     if (a.page < b.page) return -1;
//                                     if (a.page > b.page) return 1;
//                                     return 0;
//                                 });
//                                 let forms = [];
//                                 raws.map((raw) => {
//                                     forms = [...forms, ...(raw?.data || [])];
//                                 });
//                                 forms = forms;
//                                 setState({
//                                     isViewUpdated: !state.isViewUpdated,
//                                 });
//                             }
//                         }
//                     });
//             });
//         } catch (err) {}
//     };

//     onShowFormDetail = ({ id }) => {
//         Router.push(`form-analysis/${id}`);
//     };

//     render() {
//         return (
//             <div className={styles.root}>
//                 <div className={styles.your_form_title}>Your form(s): {state.total}</div>
//                 <div className={styles.your_form}>
//                     {forms?.map?.((form) => {
//                         const { id, owner, q_counter, title, q_participant } = form;
//                         return (
//                             <Form
//                                 key={id}
//                                 id={id}
//                                 owner={owner}
//                                 qCounter={q_counter}
//                                 qParticipant={q_participant}
//                                 title={title}
//                                 onViewMore={onShowFormDetail}
//                             />
//                         );
//                     })}
//                 </div>
//             </div>
//         );
//     }
// }

// export default connect((state) => {
//     return {
//         wallet: state.wallet,
//     };
// })(withRouter(FormAnalysis));

const FormAnalysis = () => {
    let raws = [];
    // let forms = [];
    const [total, setTotal] = useState(0);
    const [forms, setForm] = useState([]);
    const navigate = useNavigate();
    // constructor(props) {
    //     super(props);
    //     state = {
    //         total: 0,
    //     };
    // }

    useEffect(() => {
        onGetFormsCount();
    }, []);

    const onGetFormsCount = () => {
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
    };

    const onGetForms = ({ total }) => {
        try {
            const { contract, walletConnection } = window;
            const num_page = parseInt(total / 5) + 1;
            const page_arr = new Array(num_page).fill(0);
            // forms = [];
            setForm([]);
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
                                // forms = forms;
                                setForm([...forms]);
                            }
                        }
                    });
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onShowFormDetail = ({ id }) => {
        navigate(`/form-analysis-detail?id=${id}`);
    };

    return (
        <div className={styles.root}>
            <div className={styles.your_form_title}>Your form(s): {total}</div>
            <div className={styles.your_form}>
                {forms?.map?.((form) => {
                    const { id, owner, q_counter, title, q_participant } = form;
                    return (
                        <Form key={id} id={id} owner={owner} qCounter={q_counter} qParticipant={q_participant} title={title} onViewMore={onShowFormDetail} />
                    );
                })}
            </div>
        </div>
    );
};

export default connect((state) => {
    return {
        wallet: state.wallet,
    };
})(FormAnalysis);
