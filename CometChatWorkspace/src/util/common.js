/* eslint-disable no-useless-concat */
/* eslint-disable no-extend-native */
import I18n from 'i18n-js';
import moment from 'moment';
import { getDateFormat, getTimeFormat } from '@lootboy/lib/utils/dateAndTime'

const milliseconds = 1000;
const seconds = 1 * milliseconds;
const minute = 60 * seconds;
const hour = 60 * minute;
const day = 24 * hour;

const wordBoundary = {
    start: `(?:^|:|;|'|"|,|{|}|\\.|\\s|\\!|\\?|\\(|\\)|\\[|\\]|\\*)`,
    end: `(?=$|:|;|'|"|,|{|}|\\.|\\s|\\!|\\?|\\(|\\)|\\[|\\]|\\*)`,
};

const emailPattern = new RegExp(
    wordBoundary.start +
    `[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}` +
    wordBoundary.end,
    'gi'
);
const urlPattern = new RegExp(
    wordBoundary.start +
    `((https?://|www\\.|pic\\.)[-\\w;/?:@&=+$\\|\\_.!~*\\|'()\\[\\]%#,☺]+[\\w/#](\\(\\))?)` +
    wordBoundary.end,
    'gi'
);
const phoneNumPattern = new RegExp(
    wordBoundary.start +
    `(?:\\+?(\\d{1,3}))?([-. (]*(\\d{3})[-. )]*)?((\\d{3})[-. ]*(\\d{2,4})(?:[-.x ]*(\\d+))?)` +
    wordBoundary.end,
    'gi'
);

export const linkify = (message) => {

    let outputStr = message.replace(phoneNumPattern, "<a target='blank' rel='noopener noreferrer' href='tel:$&'>$&</a>");
    outputStr = outputStr.replace(emailPattern, "<a target='blank' rel='noopener noreferrer' href='mailto:$&'>$&</a>");

    const results = outputStr.match(urlPattern);

    results &&
        results.forEach((url) => {

            url = url.trim();
            let normalizedURL = url;
            if (!url.startsWith('http')) {
                normalizedURL = `//${url}`;
            }
            outputStr = outputStr.replace(
                url,
                `<a target='blank' rel='noopener noreferrer' href="${normalizedURL}">${url}</a>`
            );
        });

    return outputStr;
}

export const checkMessageForExtensionsData = (message, extensionKey) => {

    let output = null;

    if (message.hasOwnProperty("metadata")) {

        const metadata = message.metadata;
        const injectedObject = metadata["@injected"];
        if (injectedObject && injectedObject.hasOwnProperty("extensions")) {

            const extensionsObject = injectedObject["extensions"];
            if (extensionsObject && extensionsObject.hasOwnProperty(extensionKey)) {

                output = extensionsObject[extensionKey];
            }
        }
    }

    return output;
}

export const getMessageFileMetadata = (message, metadataKey) => {

    let fileMetadata = null;
    if(message.hasOwnProperty("metadata")) {

        const metadata = message["metadata"];
        if (metadata.hasOwnProperty(metadataKey)) {
            fileMetadata = metadata[metadataKey];
        }
    }

    return fileMetadata;
}

export const ID = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

export const getUnixTimestamp = () => {

    return Math.round(+new Date() / 1000);
}

const dateDiffInDays = (a, b) => {

    const milliSecondsPerDay = day;

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / milliSecondsPerDay);
}


export const getTimeOrDateInPast = (timestamp, lang) => {

    const timeStampInMilliSeconds = timestamp * 1000;

    const messageTimestamp = new Date(timeStampInMilliSeconds);
    const currentTimestamp = new Date(Date.now());

    const dateToDisplay = moment(messageTimestamp).local();

    const dateDifferenceInDays = dateDiffInDays(messageTimestamp, currentTimestamp);

    if (dateDifferenceInDays < 1) {
        timestamp = dateToDisplay.format(getTimeFormat(lang));
    } else if (dateDifferenceInDays < 2) {
        timestamp = I18n.t('cmtcht_common_yesterday');
    } else  {
        timestamp = dateToDisplay.format(getDateFormat(lang));
    }

    return timestamp;
}

export const getFormattedTime = (timestamp, lang) => {
    const timeStampInMilliSeconds = timestamp * 1000;
    const messageTimestamp = moment(new Date(timeStampInMilliSeconds)).local();

    return messageTimestamp.format(getTimeFormat(lang));
}

export const getFormattedDate = (timestamp, lang) => {
    const timeStampInMilliSeconds = timestamp * 1000;
    const messageTimestamp = moment(new Date(timeStampInMilliSeconds)).local();

    return messageTimestamp.format(getDateFormat(lang));
}

export const countEmojiOccurences = (string, word) =>  {
    if(string.split(word).length - 1 >= 3){
        return 3
    }else{
        let content = string;
        content = string.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g,"");

        if(content.length>0){
            return 3;

        }else{
            return string.split(word).length - 1;
        }

        }
 }
