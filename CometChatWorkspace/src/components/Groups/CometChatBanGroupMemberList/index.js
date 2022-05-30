import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { CometChatBanGroupMemberListItem } from "../";
import { CometChatBackdrop } from "../../Shared";

import { CometChatContext } from "../../../util/CometChatContext";
import * as enums from "../../../util/enums.js";

import Translator from "../../../resources/localization/translator";
import { theme } from "../../../resources/theme";

import {
    modalWrapperStyle,
    modalCloseStyle,
    modalBodyStyle,
    contactMsgStyle,
    contactMsgTxtStyle,
    modalErrorStyle,
    modalCaptionStyle,
    modalListStyle,
    listHeaderStyle,
    nameColumnStyle,
    roleColumnStyle,
    actionColumnStyle,
    listStyle,
} from "./style";

import clearIcon from "./resources/close.svg";
import I18n from 'i18n-js';

class CometChatBanGroupMemberList extends React.Component {

    static contextType = CometChatContext;

    constructor(props) {

        super(props);

        this.state = {
            membersToBan: [],
            membersToUnBan: [],
            decoratorMessage:  I18n.t('cmtcht_common_loading'),
            errorMessage: ""
        }
    }

    componentDidMount() {

        if (this.context.bannedGroupMembers.length === 0) {
            this.setState({ decoratorMessage: I18n.t('cmtcht_groups_nobanned') });
        } else {
            this.setState({ decoratorMessage: "" });
        }
    }

    componentDidUpdate() {

        if (this.context.bannedGroupMembers.length === 0 && this.state.decoratorMessage === "") {
            this.setState({ decoratorMessage: I18n.t('cmtcht_groups_nobanned') });
        } else if (this.context.bannedGroupMembers.length && this.state.decoratorMessage.length) {
            this.setState({ decoratorMessage: "" });
        }
    }

    unbanMember = (memberToUnBan) => {

        const guid = this.context.item.guid;
        CometChat.unbanGroupMember(guid, memberToUnBan.uid).then(response => {

            if(response) {
                this.props.actionGenerated(enums.ACTIONS["UNBAN_GROUP_MEMBER_SUCCESS"], [memberToUnBan]);
            } else {
                this.setState({ errorMessage: I18n.t('cmtcht_common_unknown') });
            }

        }).catch(error => this.setState({ errorMessage: I18n.t('cmtcht_common_unknown') }));
    }

    updateMembers = (action, member) => {

        switch(action) {
            case enums.ACTIONS["UNBAN_GROUP_MEMBER"]:
                this.unbanMember(member);
                break;
            default:
                break;
        }
    }

    handleScroll = (e) => {

        const bottom = Math.round(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) === Math.round(e.currentTarget.clientHeight);
        if (bottom) {
            this.props.actionGenerated(enums.ACTIONS["FETCH_BANNED_GROUP_MEMBERS"]);
        }
    }

    render() {

        const membersList = [...this.context.bannedGroupMembers];
        const bannedMembers = membersList.map((member, key) => {

            return (
                <CometChatBanGroupMemberListItem
                key={member.uid}
                member={member}
                loggedinuser={this.props.loggedinuser}
                actionGenerated={this.updateMembers} />);

        });

        let messageContainer = null;
        if (this.state.decoratorMessage.length !== 0) {

            messageContainer = (
                <div css={contactMsgStyle()} className="bannedmembers__decorator-message">
                    <p css={contactMsgTxtStyle(this.context)} className="decorator-message">{this.state.decoratorMessage}</p>
                </div>
            );
        }

        return (
            <React.Fragment>
                <CometChatBackdrop show={true} clicked={this.props.close} />
                <div css={modalWrapperStyle(this.context)} className="modal__bannedmembers">
                    <span css={modalCloseStyle(clearIcon, this.context)} className="modal__close" onClick={this.props.close} title={I18n.t('cmtcht_common_close')}></span>

                    <div css={modalBodyStyle()} className="modal__body">
                        <div css={modalCaptionStyle(Translator.getDirection(this.context.language))} className="modal__title">
                            {I18n.t('cmtcht_groups_bannedmembers')}
                        </div>
                        <div css={modalErrorStyle(this.context)} className="modal__error">
                            {this.state.errorMessage}
                        </div>

                        <div css={modalListStyle()} className="modal__content">
                            <div css={listHeaderStyle(this.context)} className="content__header">
                                <div css={nameColumnStyle(this.props)} className="name">
                                    {Translator.translate("NAME", this.context.language)}
                                </div>
                                <div css={roleColumnStyle(this.context)} className="role">
                                    {Translator.translate("SCOPE", this.context.language)}
                                </div>
                                <div css={actionColumnStyle(this.context)} className="unban">
                                    {I18n.t('cmtcht_groups_unban')}
                                </div>
                            </div>
                            {messageContainer}
                            <div css={listStyle(this.props)} className="content__list" onScroll={this.handleScroll}>
                                {bannedMembers}
                            </div>
                        </div>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

// Specifies the default values for props:
CometChatBanGroupMemberList.defaultProps = {
    theme: theme
};

CometChatBanGroupMemberList.propTypes = {
    theme: PropTypes.object
}

export { CometChatBanGroupMemberList };
