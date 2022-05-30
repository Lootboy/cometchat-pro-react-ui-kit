import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { CometChatAvatar, CometChatToastNotification } from "../../Shared";

import { theme } from "../../../resources/theme";
import Translator from "../../../resources/localization/translator";

import {
	userInfoScreenStyle,
	headerStyle,
	headerTitleStyle,
	detailStyle,
	thumbnailStyle,
	userDetailStyle,
	userNameStyle,
	userStatusStyle,
	optionsStyle,
	optionTitleStyle,
	optionListStyle,
	optionStyle,
	optionNameStyle
} from "./style";

import notificationIcon from "./resources/notify.svg";
import privacyIcon from "./resources/privacy.svg";
import chatIcon from "./resources/chats.svg";
import helpIcon from "./resources/help.svg";
import reportIcon from "./resources/warning.svg";
import I18n from 'i18n-js';

class CometChatUserProfile extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			loggedInUser: null
		}

		this.toastRef = React.createRef();
	}

	componentDidMount() {

		CometChat.getLoggedinUser().then(user => {
			this.setState({ loggedInUser: user });
		}).catch(error => this.toastRef.setError("SOMETHING_WRONG"));
	}

	render() {

		let userProfile = null;
		if(this.state.loggedInUser) {

			let avatar = <CometChatAvatar user={this.state.loggedInUser} />;
			userProfile = (
				<React.Fragment>
					<div css={headerStyle(this.props)} className="userinfo__header">
						<h4 css={headerTitleStyle()} className="header__title">
							{I18n.t('cmtcht_common_more')}
						</h4>
					</div>
					<div css={detailStyle()} className="userinfo__detail">
						<div css={thumbnailStyle()} className="detail__thumbnail">
							{avatar}
						</div>
						<div css={userDetailStyle()} className="detail__user" dir={Translator.getDirection(this.props.lang)}>
							<div css={userNameStyle()} className="user__name">
								{this.state.loggedInUser.name}
							</div>
							<p css={userStatusStyle(this.props)} className="user__status">
								{I18n.t('cmtcht_chats_status_online')}
							</p>
						</div>
					</div>
					<div css={optionsStyle()} className="userinfo__options">
						<div css={optionTitleStyle(this.props)} className="options__title">
							{I18n.t('cmtcht_common_preferences')}
						</div>
						<div css={optionListStyle()} className="options_list">
							<div css={optionStyle(notificationIcon)} className="option option-notification">
								<div css={optionNameStyle()} className="option_name">
									{I18n.t('cmtcht_common_notifications')}
								</div>
							</div>
							<div css={optionStyle(privacyIcon)} className="option option-privacy">
								<div css={optionNameStyle()} className="option_name">
									{I18n.t('cmtcht_common_privacy')}
								</div>
							</div>
							<div css={optionStyle(chatIcon)} className="option option-chats">
								<div css={optionNameStyle()} className="option_name">
									{I18n.t('cmtcht_common_chats')}
								</div>
							</div>
						</div>
						<div css={optionTitleStyle(this.props)} className="options__title">
							{I18n.t('cmtcht_common_other')}
						</div>
						<div css={optionListStyle()} className="options_list">
							<div css={optionStyle(helpIcon)} className="option option-help">
								<div css={optionNameStyle()} className="option_name">
									{I18n.t('cmtcht_common_help')}
								</div>
							</div>
							<div css={optionStyle(reportIcon)} className="option option-report">
								<div css={optionNameStyle()} className="option_name">
									{I18n.t('cmtcht_common_report')}
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>
			);
		}

		return (
			<div css={userInfoScreenStyle(this.props)} className="userinfo">
				{userProfile}
				<CometChatToastNotification ref={el => (this.toastRef = el)} lang={this.props.lang} />
			</div>
		);
	}
}

// Specifies the default values for props:
CometChatUserProfile.defaultProps = {
	lang: Translator.getDefaultLanguage(),
	theme: theme
};

CometChatUserProfile.propTypes = {
	lang: PropTypes.string,
	theme: PropTypes.object
}

export { CometChatUserProfile };
