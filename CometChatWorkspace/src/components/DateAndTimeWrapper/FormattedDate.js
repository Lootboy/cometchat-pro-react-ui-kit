import { string } from 'prop-types';

import { getFormattedDate } from '~/cometchat-pro-react-ui-kit/CometChatWorkspace/src/util/common';
import { useSelector } from 'react-redux';
import { languageSelector } from '~/redux/selectors';

export function FormattedDate({ timestamp }) {
  const language = useSelector(languageSelector);

  const formattedTime = getFormattedDate(timestamp, language);

  if (!timestamp) return null;

  return (
    <>
      {formattedTime}
    </>
  );
}

FormattedDate.propTypes = {
  timestamp: string,
};


