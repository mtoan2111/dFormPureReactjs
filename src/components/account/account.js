import React, { useState } from "react";
import styles from "./account.module.css";
import { connect } from "react-redux";
import { Popover } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ArrowDropDownCircleSharpIcon from "@mui/icons-material/ArrowDropDownCircleSharp";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import { useNavigate } from "react-router-dom";

const UserAccount = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverId, setPopoverId] = useState(undefined);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const navigate = useNavigate();

    const onRequestConnectWallet = () => {
        const { nearConfig, walletConnection } = window;
        walletConnection?.requestSignIn?.(nearConfig?.contractName);
    };

    const onRequestSignOut = () => {
        const { walletConnection } = window;
        walletConnection?.signOut?.();
        navigate("/");
    };

    const onRenderSignInButton = () => {
        return (
            <div className={styles.signIn_area}>
                <button className={styles.signIn_button} onClick={onRequestConnectWallet}>
                    SignIn
                </button>
            </div>
        );
    };

    const onOpenAccountPopover = (e) => {
        setAnchorEl(e.target);
        setPopoverId("simple-popover");
        setPopoverOpen(true);
    };

    const onCloseAccountPopover = () => {
        setAnchorEl(null);
        setPopoverId(undefined);
        setPopoverOpen(false);
    };

    const onRenderAccountDetail = () => {
        const { walletConnection } = window;
        const accountId = walletConnection?.getAccountId?.();
        let popoverRight = 1000;
        if (typeof window !== "undefined") {
            popoverRight = window?.screen?.width - 15;
        }
        return (
            <div className={styles.signIn_area}>
                <button className={styles.account_button} onClick={onOpenAccountPopover}>
                    <div className={styles.account_button_icon_area}>
                        <AccountCircleOutlinedIcon className={styles.account_button_icon} />
                    </div>
                    <div className={styles.account_button_accountId_area}>{accountId}</div>
                    <div>
                        <ArrowDropDownCircleSharpIcon className={styles.account_button_drop_icon} />
                    </div>
                </button>
                <Popover
                    id={popoverId}
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    onClose={onCloseAccountPopover}
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: 70, left: popoverRight }}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    className={styles.popover_container}
                >
                    <div className={styles.signOut_area}>
                        <button className={styles.signOut_button} onClick={onRequestSignOut}>
                            <LogoutSharpIcon className={styles.signOut_button_icon} />
                            <div className={styles.signOut_button_content}>Logout</div>
                        </button>
                    </div>
                </Popover>
            </div>
        );
    };

    const onRenderScene = () => {
        const { walletConnection } = window;
        const isSigned = walletConnection?.isSignedIn?.();
        if (isSigned) {
            return onRenderAccountDetail();
        }
        return onRenderSignInButton();
    };

    return <div className={styles.root}>{onRenderScene()}</div>;
};

export default UserAccount;
