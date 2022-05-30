import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { CometChatContext } from "../../../util/CometChatContext";
import { CometChatEvent } from "../../../util/CometChatEvent";
import * as enums from "../../../util/enums.js";

import Translator from "../../../resources/localization/translator";

import {
    blockedMessageWrapperStyle,
    blockedMessageContainerStyle,
    unblockButtonStyle,
    blockedTitleStyle,
    bockedSubTitleStyle
} from "./style";
import I18n from 'i18n-js';

const CometChatBlockedUser = props => {

	const context = React.useContext(CometChatContext);
	const chatWith = { ...context.item };

	const unblockUser = () => {

		let uid = chatWith.uid;
		CometChat.unblockUsers([uid])
			.then(response => {
				if (response && response.hasOwnProperty(uid) && response[uid].hasOwnProperty("success") && response[uid]["success"] === true) {

					const newType = CometChat.ACTION_TYPE.TYPE_USER;
					const newItem = Object.assign({}, chatWith, { blockedByMe: false });
					context.setTypeAndItem(newType, newItem);
				} else {
					CometChatEvent.triggerHandler(enums.ACTIONS["ERROR"], "SOMETHING_WRONG");
				}
			})
			.catch(error => CometChatEvent.triggerHandler(enums.ACTIONS["ERROR"], "SOMETHING_WRONG"));
	}

	return (
		<div css={blockedMessageWrapperStyle()} className="">
			<div css={blockedMessageContainerStyle()}>
				<div css={blockedTitleStyle()}>{I18n.t('cmtcht_chats_message_blocked')}</div>
				<div css={bockedSubTitleStyle(context)}>{Translator.translate("NOT_POSSIBLE_TO_SEND_MESSAGES", props.lang)}</div>
			</div>
			<button type="button" css={unblockButtonStyle(context)} onClick={unblockUser}>
				{I18n.t('cmtcht_chats_unblock')}
			</button>
		</div>
	);
};

// Specifies the default values for props:
CometChatBlockedUser.defaultProps = {
	lang: Translator.getDefaultLanguage(),
};

CometChatBlockedUser.propTypes = {
	lang: PropTypes.string,
};

export { CometChatBlockedUser };
