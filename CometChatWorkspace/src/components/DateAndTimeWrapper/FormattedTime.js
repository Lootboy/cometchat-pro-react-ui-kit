import { string } from 'prop-types';

import { getFormattedTime } from '~/cometchat-pro-react-ui-kit/CometChatWorkspace/src/util/common';
import { useSelector } from 'react-redux';
import { languageSelector } from '~/redux/selectors';

export function FormattedTime({ timestamp }) {
  const language = useSelector(languageSelector);

  const formattedTime = getFormattedTime(timestamp, language);

  if (!timestamp) return null;

  return (
    <>
      {formattedTime}
    </>
  );
}

FormattedTime.propTypes = {
  timestamp: string,
};


