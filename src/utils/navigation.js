let navigateFn;

export const setNavigate = (navFunc) => {
    navigateFn = navFunc;
};

export const navigateTo = (path) => {
    if (navigateFn) navigateFn(path);
};
