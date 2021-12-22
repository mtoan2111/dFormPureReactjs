import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FormDetail = () => {
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);

    const useQuery = () => {
        const { search } = useLocation();
        return new URLSearchParams(search);
    };

    const query = useQuery();
    const navigate = useNavigate();

    useEffect(() => {
        const { contract, walletConnection } = window;
        const userId = walletConnection.getAccountId();
        const id = query.get("id");
        contract
            ?.get_form?.({
                userId,
                id,
            })
            .then((form) => {
                if (form) {
                    navigate(`/create-question?form_id=${form?.id}`);
                    onLoadingCompleted(true);
                } else {
                    onLoadingCompleted(false);
                }
            })
            .catch((err) => {
                onLoadingCompleted(false);
            });
    }, []);

    const onLoadingCompleted = (result) => {
        setLoading(false);
        setValid(result);
    };

    return <div style={{ marginTop: 40 }}>{loading ? "Validating..." : `${valid}`}</div>;
};

export default FormDetail;
