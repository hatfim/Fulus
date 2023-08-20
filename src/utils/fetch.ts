import {
  ERROR_MSG_500,
  ERROR_MSG_INVALID_DATA,
  ERROR_MSG_NOT_AUTHORIZED,
  ERROR_MSG_NOT_FOUND,
} from '~/constants/error';

const getFormatedErrorMsg = (type: number, statusText: string): string => {
  const errors: { [key: number]: string } = {
    400: ERROR_MSG_INVALID_DATA,
    401: ERROR_MSG_NOT_AUTHORIZED,
    403: ERROR_MSG_NOT_AUTHORIZED,
    404: ERROR_MSG_NOT_FOUND,
    500: ERROR_MSG_500,
  };

  return errors[type] || statusText;
};

export const executeFetch = async (url: RequestInfo, options: RequestInit) => {
  let response;
  try {
    response = await fetch(url, options);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = null;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      result = await response.json();
    } else {
      result = await response.blob();
    }

    if (response.ok) {
      return result;
    }
    getFormatedErrorMsg(response.status, response.statusText);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }

  return response;
};
