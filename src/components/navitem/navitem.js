import React from "react";
import styles from "./navitem.module.css";
import { useNavigate } from "react-router-dom";

const NavItem = ({ icon, content, actived, href }) => {
    const navigation = useNavigate();
    const onNavItemClicked = () => {
        navigation(href);
    };

    return (
        <div className={styles.root} onClick={onNavItemClicked}>
            <div className={actived ? styles.nav_icon_active : styles.nav_icon}>{icon}</div>
            <div className={actived ? styles.nav_content_active : styles.nav_content}>{content}</div>
        </div>
    );
};

export default NavItem;
