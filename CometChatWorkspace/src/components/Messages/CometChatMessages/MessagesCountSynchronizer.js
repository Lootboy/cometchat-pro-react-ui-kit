import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unreadMessagesSelector } from "@lootboy/lib/slices/cometChat";
import { syncUnreadMessagesCount } from "~/middlewares/comet-chat";

export default function MessagesCountSynchronizer(){
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      if (useSelector(unreadMessagesSelector)) {
        syncUnreadMessagesCount(dispatch);
      }
    };
  }, );
  return null;
};

