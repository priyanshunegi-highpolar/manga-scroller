export const scrollToPosition = (element: HTMLElement | Window, position: number, smooth = true) => {
  if (element instanceof Window) {
    window.scrollTo({
      top: position,
      behavior: smooth ? "smooth" : "auto",
    });
  } else {
    element.scrollTo({
      top: position,
      behavior: smooth ? "smooth" : "auto",
    });
  }
};

export const scrollBy = (element: HTMLElement | Window, amount: number, smooth = true) => {
  if (element instanceof Window) {
    window.scrollBy({
      top: amount,
      behavior: smooth ? "smooth" : "auto",
    });
  } else {
    element.scrollBy({
      top: amount,
      behavior: smooth ? "smooth" : "auto",
    });
  }
};

export const getScrollPosition = (element: HTMLElement | Window): number => {
  if (element instanceof Window) {
    return window.scrollY || window.pageYOffset;
  }
  return element.scrollTop;
};

export const getScrollHeight = (element: HTMLElement | Window): number => {
  if (element instanceof Window) {
    return document.documentElement.scrollHeight;
  }
  return element.scrollHeight;
};

export const getClientHeight = (element: HTMLElement | Window): number => {
  if (element instanceof Window) {
    return window.innerHeight;
  }
  return element.clientHeight;
};

export const isAtBottom = (element: HTMLElement | Window, threshold = 10): boolean => {
  const scrollPos = getScrollPosition(element);
  const scrollHeight = getScrollHeight(element);
  const clientHeight = getClientHeight(element);
  return scrollPos + clientHeight >= scrollHeight - threshold;
};
