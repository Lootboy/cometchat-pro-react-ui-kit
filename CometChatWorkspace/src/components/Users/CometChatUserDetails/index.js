import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";

import { CometChat } from "@cometchat-pro/chat";

import { CometChatAvatar, CometChatToastNotification } from "../../Shared/";
import { CometChatSharedMediaView } from "../../Shared/CometChatSharedMediaView/index.js";

import { UserDetailManager } from "./controller";

import { CometChatContext } from "../../../util/CometChatContext";
import * as enums from "../../../util/enums.js";

import { theme } from "../../../resources/theme";

import {
	userDetailStyle,
	headerStyle,
	headerCloseStyle,
	headerTitleStyle,
	sectionStyle,
	actionSectionStyle,
	mediaSectionStyle,
	privacySectionStyle,
	sectionHeaderStyle,
	sectionContentStyle,
	contentItemStyle,
	itemLinkStyle,
	userInfoSectionStyle,
	userThumbnailStyle,
	userNameStyle,
	userStatusStyle,
	userPresenceStyle,
} from "./style";

import navigateIcon from "./resources/back.svg";
import { FormattedPastDate } from '~/cometchat-pro-react-ui-kit/CometChatWorkspace/src/components/DateAndTimeWrapper';
import I18n from 'i18n-js';

class CometChatUserDetails extends React.Component {
	static contextType = CometChatContext;

	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			loggedInUser: null,
			status: null,
			enableSharedMedia: false,
			enableBlockUser: false,
			enableViewProfile: false,
			enableUserPresence: false,
		};

		this.toastRef = React.createRef();
	}

	componentDidMount() {
		CometChat.getLoggedinUser()
			.then(user => {
				if (this._isMounted) {
					this.setState({ loggedInUser: user });
				}
			})
			.catch(error => this.toastRef.setError("SOMETHING_WRONG"));

		this._isMounted = true;
		this.toastRef = React.createRef();

		this.UserDetailManager = new UserDetailManager();
		this.UserDetailManager.attachListeners(this.updateUser);

		this.setStatusForUser();
		this.enableSharedMedia();
		this.enableBlockUser();
		this.enableViewProfile();
		this.enableUserPresence();
	}

	componentDidUpdate(prevProps) {
		this.enableSharedMedia();
		this.enableBlockUser();
		this.enableViewProfile();
		this.enableUserPresence();

		if (prevProps.lang !== this.props.lang) {
			this.setStatusForUser();
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		this.UserDetailManager.removeListeners();
		this.UserDetailManager = null;
	}

	enableUserPresence = () => {
		this.context.FeatureRestriction.isUserPresenceEnabled()
			.then(response => {
				if (response !== this.state.enableUserPresence && this._isMounted) {
					this.setState({ enableUserPresence: response });
				}
			})
			.catch(error => {
				if (this.state.enableUserPresence !== false) {
					this.setState({ enableUserPresence: false });
				}
			});
	};

	updateUser = (key, user) => {
		switch (key) {
			case enums.USER_ONLINE:
			case enums.USER_OFFLINE: {
				if (this.context.type === CometChat.ACTION_TYPE.TYPE_USER && this.context.item.uid === user.uid) {
					//if user presence feature is disabled
					if (this.state.enableUserPresence === false) {
						return false;
					}

					let status = "";
					if (user.status === CometChat.USER_STATUS.OFFLINE) {
						status = I18n.t('cmtcht_chats_status_offline');
					} else if (user.status === CometChat.USER_STATUS.ONLINE) {
						status = I18n.t('cmtcht_chats_status_online');
					}
					this.setState({ status: status });
				}
				break;
			}
			default:
				break;
		}
	};

	setStatusForUser = () => {
		let status = null;
		if (this.context.item.status === CometChat.USER_STATUS.OFFLINE && this.context.item.lastActiveAt) {

      // status is set here as number to be later converted to correct date format with FormattedPastDate
			status = this.context.item.lastActiveAt;
		} else if (this.context.item.status === CometChat.USER_STATUS.OFFLINE) {
			status = I18n.t('cmtcht_chats_status_offline');
		} else if (this.context.item.status === CometChat.USER_STATUS.ONLINE) {
			status = I18n.t('cmtcht_chats_status_online');
		}

		this.setState({ status: status });
	};

	enableSharedMedia = () => {
		this.context.FeatureRestriction.isSharedMediaEnabled()
			.then(response => {
				/**
				 * Don't update state if the response has the same value
				 */
				if (response !== this.state.enableSharedMedia && this._isMounted) {
					this.setState({ enableSharedMedia: response });
				}
			})
			.catch(error => {
				if (this.state.enableSharedMedia !== false && this._isMounted) {
					this.setState({ enableSharedMedia: false });
				}
			});
	};

	enableBlockUser = () => {
		this.context.FeatureRestriction.isBlockUserEnabled()
			.then(response => {
				/**
				 * Don't update state if the response has the same value
				 */
				if (response !== this.state.enableBlockUser && this._isMounted) {
					this.setState({ enableBlockUser: response });
				}
			})
			.catch(error => {
				if (this.state.enableBlockUser !== false && this._isMounted) {
					this.setState({ enableBlockUser: false });
				}
			});
	};

	enableViewProfile = () => {
		this.context.FeatureRestriction.isViewProfileEnabled()
			.then(response => {
				if (response !== this.state.enableViewProfile && this._isMounted) {
					this.setState({ enableViewProfile: response });
				}
			})
			.catch(error => {
				if (this.state.enableViewProfile !== false && this._isMounted) {
					this.setState({ enableViewProfile: false });
				}
			});
	};

	blockUser = () => {
		let uid = this.context.item.uid;
		let usersList = [uid];
		CometChat.blockUsers(usersList)
			.then(response => {
				if (response && response.hasOwnProperty(uid) && response[uid].hasOwnProperty("success") && response[uid]["success"] === true) {

					const newType = CometChat.ACTION_TYPE.TYPE_USER;
					const newItem = Object.assign({}, this.context.item, { blockedByMe: true });
					this.context.setTypeAndItem(newType, newItem);

				} else {
					this.toastRef.setError("SOMETHING_WRONG");
				}
			})
			.catch(error => this.toastRef.setError("SOMETHING_WRONG"));
	};

	unblockUser = () => {
		let uid = this.context.item.uid;
		let usersList = [uid];
		CometChat.unblockUsers(usersList)
			.then(response => {
				if (response && response.hasOwnProperty(uid) && response[uid].hasOwnProperty("success") && response[uid]["success"] === true) {

					const newType = CometChat.ACTION_TYPE.TYPE_USER;
					const newItem = Object.assign({}, this.context.item, { blockedByMe: false });
					this.context.setTypeAndItem(newType, newItem);

				} else {
					this.toastRef.setError("SOMETHING_WRONG");
				}
			})
			.catch(error => this.toastRef.setError("SOMETHING_WRONG"));
	};

	viewProfile = () => {
		const profileLink = this.context.item.link;
		window.open(profileLink, "", "fullscreen=yes, scrollbars=auto");
	};

	closeDetailView = () => {
		this.props.actionGenerated(enums.ACTIONS["CLOSE_USER_DETAIL"]);
	};

	render() {
		if (this.state.loggedInUser === null) {
			return null;
		}

		let viewProfile = null;
		if (this.state.enableViewProfile === true && this.context.item.hasOwnProperty("link") && this.context.item.link && this.context.item.link.trim().length) {
			viewProfile = (
				<div css={sectionStyle()} className="detailpane__section">
					<div css={actionSectionStyle(this.context)} className="section section__viewprofile">
						<h6 css={sectionHeaderStyle(this.props)} className="section__header">
              {I18n.t('cmtcht_chats_actions')}
						</h6>
						<div css={sectionContentStyle()} className="section__content">
							<div css={contentItemStyle()} className="content__item">
								<div css={itemLinkStyle(this.context)} className="item__link" onClick={this.viewProfile}>
                  {I18n.t('cmtcht_users_profile_view')}
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		let blockUserText;
		if (this.context.item.blockedByMe) {
			blockUserText = (
				<div css={itemLinkStyle(this.context)} className="item__link" onClick={this.unblockUser}>
          {I18n.t('cmtcht_chats_unblock')}
				</div>
			);
		} else {
			blockUserText = (
				<div css={itemLinkStyle(this.context)} className="item__link" onClick={this.blockUser}>
          {I18n.t('cmtcht_chats_block')}
				</div>
			);
		}

		let blockUserView = (
			<div css={sectionStyle()} className="detailpane__section">
				<div css={privacySectionStyle(this.context)} className="section section__privacy">
					<h6 css={sectionHeaderStyle(this.context)} className="section__header">
            {I18n.t('cmtcht_common_options')}
					</h6>
					<div css={sectionContentStyle()} className="section__content">
						<div css={contentItemStyle()} className="content__item">
							{blockUserText}
						</div>
					</div>
				</div>
			</div>
		);

		//if block/unblock user feature is disabled
		if (this.state.enableBlockUser === false) {
			blockUserView = null;
		}

		let sharedmediaView = (
			<div css={mediaSectionStyle()} className="detailpane__section">
				<CometChatSharedMediaView theme={this.props.theme} lang={this.context.language} />
			</div>
		);

		//if shared media feature is disabled
		if (this.state.enableSharedMedia === false) {
			sharedmediaView = null;
		}

		return (
			<div css={userDetailStyle(this.context)} className="detailpane detailpane--user">
				<div css={headerStyle(this.context)} className="detailpane__header">
					<div css={headerCloseStyle(navigateIcon, this.context)} className="header__close" onClick={this.closeDetailView}></div>
					<h4 css={headerTitleStyle()} className="header__title">
            {I18n.t('cmtcht_common_details')}
					</h4>
				</div>
				<div css={sectionStyle()} className="detailpane__section">
					<div css={userInfoSectionStyle()} className="section section__userinfo">
						<div css={userThumbnailStyle()} className="user__thumbnail">
							<CometChatAvatar user={this.context.item} />
						</div>
						<div css={userStatusStyle()} className="user__status">
							<h6 css={userNameStyle()}>{this.context.item.name}</h6>
							<span css={userPresenceStyle(this.context, this.state)}>
                { typeof this.state.status === 'number'
                  ? <FormattedPastDate timestamp={this.state.status} />
                  : this.state.status}
							</span>
						</div>
					</div>
				</div>
				<CometChatToastNotification ref={el => (this.toastRef = el)} lang={this.props.lang} />
				{viewProfile}
				{blockUserView}
				{sharedmediaView}
			</div>
		);
	}
}

// Specifies the default values for props:
CometChatUserDetails.defaultProps = {
	theme: theme,
};

CometChatUserDetails.propTypes = {
	theme: PropTypes.object,
};

export { CometChatUserDetails };
