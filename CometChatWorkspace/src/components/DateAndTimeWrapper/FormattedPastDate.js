import { string } from 'prop-types';

import { getTimeOrDateInPast } from '~/cometchat-pro-react-ui-kit/CometChatWorkspace/src/util/common';
import { useSelector } from 'react-redux';
import { languageSelector } from '~/redux/selectors';

export function FormattedPastDate({ timestamp }) {
  const language = useSelector(languageSelector);

  const formattedTime = getTimeOrDateInPast(timestamp, language);

  if (!timestamp) return null;

  return (
    <>
      {formattedTime}
    </>
  );
}

FormattedPastDate.propTypes = {
  timestamp: string,
};


