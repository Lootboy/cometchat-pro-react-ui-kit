import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { CometChatContext } from "../../../util/CometChatContext";

import { theme } from "../../../resources/theme";
import Translator from "../../../resources/localization/translator";

import { actionMessageStyle, actionMessageTxtStyle } from "./style"
import I18n from 'i18n-js';

class CometChatActionMessageBubble extends React.Component {
	static contextType = CometChatContext;
	loggedInUser;

	constructor(props, context) {
		super(props, context);

		this.context.getLoggedinUser().then(user => {
			this.loggedInUser = { ...user };
		});
	}

	getCallActionMessage = message => {
		const call = message;
		let actionMessage = null;

		switch (call.status) {
			case CometChat.CALL_STATUS.INITIATED: {
				actionMessage = I18n.t('cmtcht_call_initiated');
				if (call.type === CometChat.CALL_TYPE.AUDIO) {
					if (call.receiverType === CometChat.RECEIVER_TYPE.USER) {
						actionMessage = call.callInitiator.uid === this.loggedInUser?.uid ? I18n.t('cmtcht_call_outgoing_audio') : I18n.t('cmtcht_call_incoming_audio');
					} else if (call.receiverType === CometChat.RECEIVER_TYPE.GROUP) {
						if (call.action === CometChat.CALL_STATUS.INITIATED) {
							actionMessage = call.callInitiator.uid === this.loggedInUser?.uid ? I18n.t('cmtcht_call_outgoing_audio') : I18n.t('cmtcht_call_incoming_audio');
						} else if (call.action === CometChat.CALL_STATUS.REJECTED) {
							actionMessage = call.sender.uid === this.loggedInUser?.uid ? I18n.t('cmtcht_call_rejected') : `${call.sender.name} ${I18n.t('cmtcht_call_group_rejected')}`;
						}
					}
				} else if (call.type === CometChat.CALL_TYPE.VIDEO) {
					if (call.receiverType === CometChat.RECEIVER_TYPE.USER) {
						actionMessage = call.callInitiator.uid === this.loggedInUser?.uid ? I18n.t('cmtcht_call_outgoing_video') : I18n.t('cmtcht_call_incoming_video');
					} else if (call.receiverType === CometChat.RECEIVER_TYPE.GROUP) {
						if (call.action === CometChat.CALL_STATUS.INITIATED) {
							actionMessage = call.callInitiator.uid === this.loggedInUser?.uid ? I18n.t('cmtcht_call_outgoing_video') : I18n.t('cmtcht_call_incoming_video');
						} else if (call.action === CometChat.CALL_STATUS.REJECTED) {
							actionMessage = call.sender.uid === this.loggedInUser?.uid ? I18n.t('cmtcht_call_rejected') : `${call.sender.name} ${I18n.t('cmtcht_call_group_rejected')}`;
						}
					}
				}
				break;
			}
			case CometChat.CALL_STATUS.ONGOING: {
				if (call.receiverType === CometChat.RECEIVER_TYPE.USER) {
					actionMessage = I18n.t('cmtcht_call_accepted');
				} else if (call.receiverType === CometChat.RECEIVER_TYPE.GROUP) {
					if (call.action === CometChat.CALL_STATUS.ONGOING) {
						actionMessage = call.sender.uid === this.loggedInUser?.uid ? I18n.t('cmtcht_call_accepted') : I18n.t('cmtcht_member_joined', { user: call.sender.name});
					} else if (call.action === CometChat.CALL_STATUS.REJECTED) {
						actionMessage = call.sender.uid === this.loggedInUser?.uid ? I18n.t('cmtcht_call_rejected') : `${call.sender.name} ${I18n.t('cmtcht_call_group_rejected')}`;
					} else if (call.action === "left") {
						if (call.sender.uid === this.loggedInUser?.uid) {
							actionMessage = I18n.t('cmtcht_call_group_youleft');
						} else {
							actionMessage = `${call.sender.name} ${I18n.t('cmtcht_call_group_left')}`;
						}
					}
				}
				break;
			}
			case CometChat.CALL_STATUS.UNANSWERED: {
				actionMessage = cmtcht_call_group_youleft;

				if (call.type === CometChat.CALL_TYPE.AUDIO && (call.receiverType === CometChat.RECEIVER_TYPE.USER || call.receiverType === CometChat.RECEIVER_TYPE.GROUP)) {
					actionMessage = call.callInitiator.uid === this.loggedInUser?.uid ? I18n.t('cmtcht_call_unanswered_audio') : I18n.t('cmtcht_call_missed_audio');
				} else if (call.type === CometChat.CALL_TYPE.VIDEO && (call.receiverType === CometChat.RECEIVER_TYPE.USER || call.receiverType === CometChat.RECEIVER_TYPE.GROUP)) {
					actionMessage = call.callInitiator.uid === this.loggedInUser?.uid ? I18n.t('cmtcht_call_unanswered_video') : I18n.t('cmtcht_call_missed_video');
				}
				break;
			}
			case CometChat.CALL_STATUS.REJECTED:
				actionMessage = I18n.t('cmtcht_call_rejected');
				break;
			case CometChat.CALL_STATUS.ENDED:
				actionMessage = I18n.t('cmtcht_call_ended');
				break;
			case CometChat.CALL_STATUS.CANCELLED:
				actionMessage = I18n.t('cmtcht_call_cancelled');
				break;
			case CometChat.CALL_STATUS.BUSY:
				actionMessage = I18n.t('cmtcht_call_busy');
				break;
			default:
				break;
		}

		return actionMessage;
	};

	getActionMessage = message => {
		let actionMessage = null;

		const byUser = message?.actionBy?.name;
		const onUser = message?.actionOn?.name;

		switch (message.action) {
			case CometChat.ACTION_TYPE.MEMBER_JOINED:
				actionMessage = I18n.t('cmtcht_member_joined', { user: byUser});
				break;
			case CometChat.ACTION_TYPE.MEMBER_LEFT:
				actionMessage = I18n.t('cmtcht_member_left', { user: byUser });
				break;
			case CometChat.ACTION_TYPE.MEMBER_ADDED:
				actionMessage =  I18n.t('cmtcht_member_added', { user: byUser, user2: onUser});
				break;
			case CometChat.ACTION_TYPE.MEMBER_KICKED:
				actionMessage = I18n.t('cmtcht_member_kicked', { user: byUser, user2: onUser });
				break;
			case CometChat.ACTION_TYPE.MEMBER_BANNED:
				actionMessage = I18n.t('cmtcht_member_banned', { user: byUser, user2: onUser });
				break;
			case CometChat.ACTION_TYPE.MEMBER_UNBANNED:
				actionMessage = I18n.t('cmtcht_member_unbanned', { user: byUser, user2: onUser });
				break;
			case CometChat.ACTION_TYPE.MEMBER_SCOPE_CHANGED: {
				const newScope = message?.newScope;
				actionMessage = I18n.t('cmtcht_member_scope_changed', { user: byUser, user2: onUser, scope: newScope });
				break;
			}
			default:
				break;
		}

		return actionMessage;
	};

	getMessage = message => {
		let actionMessage = null;

		if (message.category === CometChat.CATEGORY_CALL) {
			actionMessage = this.getCallActionMessage(message);
		} else if (message.category === CometChat.CATEGORY_ACTION) {
			actionMessage = this.getActionMessage(message);
		}

		return actionMessage;
	};

	render() {

		return (
			<div css={actionMessageStyle()} className="action__message">
				<p css={actionMessageTxtStyle()}>{this.getMessage(this.props.message)}</p>
			</div>
		);
	}
}

// Specifies the default values for props:
CometChatActionMessageBubble.defaultProps = {
    theme: theme,
};

CometChatActionMessageBubble.propTypes = {
	theme: PropTypes.object,
	message: PropTypes.object.isRequired,
};

export { CometChatActionMessageBubble };
