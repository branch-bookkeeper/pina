import ReactDOM from 'react-dom';
import scroll from 'scroll';
import scrollDoc from 'scroll-doc';

const computeScrollOffset = (scrollElement, element, alignment = 'middle') => {
    const body = document.body;
    const html = document.documentElement;
    const elementRect = element.getBoundingClientRect();
    const clientHeight = html.clientHeight;
    const documentHeight = Math.max(
        body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight
    );

    let scrollPosition;
    switch (alignment) {
        case 'top': scrollPosition = elementRect.top; break;
        case 'bottom': scrollPosition = elementRect.bottom - clientHeight; break;
        default: scrollPosition = elementRect.bottom - clientHeight / 2 - elementRect.height / 2; break;
    }
    const maxScrollPosition = documentHeight - clientHeight;

    return Math.min(
        scrollPosition + window.pageYOffset,
        maxScrollPosition
    );
}

export default (ref, options = {}) => {
    const element = ReactDOM.findDOMNode(ref);
    const scrollElement = scrollDoc();
    const finalScrollTop = computeScrollOffset(scrollElement, element, options.align);
    const offset = finalScrollTop - scrollElement.scrollTop;
    const duration = typeof options.duration === 'function' ? options.duration(offset) : options.duration;

    return new Promise(resolve => {
        const cancel = scroll.top(scrollElement, finalScrollTop, { ...options, duration }, () => {
            scrollElement.removeEventListener('touchstart', cancel);
            scrollElement.removeEventListener('wheel', cancel);

            resolve();
        });
        scrollElement.addEventListener('touchstart', cancel);
        scrollElement.addEventListener('wheel', cancel);
    });
};
