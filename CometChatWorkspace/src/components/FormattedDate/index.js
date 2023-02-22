import { number, oneOfType, string, bool } from "prop-types";

import { getTimeOrDateInPast } from '~/cometchat-pro-react-ui-kit/CometChatWorkspace/src/util/common';
import { useSelector } from 'react-redux';
import { languageSelector } from '~/redux/selectors';

export default function FormattedDate({ timestamp , time}) {
  const language = useSelector(languageSelector);


  if (!timestamp) return null;

  return getTimeOrDateInPast(timestamp, language, time);
}

FormattedDate.propTypes = {
  timestamp: oneOfType([string,number]),
  time: bool,
};


