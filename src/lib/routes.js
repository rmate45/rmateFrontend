export const ROUTES = {
    HOME: '/',
    AUTH: {
        ROOT: '',
        LOGIN: '/login',
        FORGOT_PASSWORD: '/forgot-password',
        CREATE_NEW_PASSWORD: '/create-new-password',
        SET_NEW_PASSWORD: '/set-new-password',
    },

    PROTECTED: {
        ROOT: '/(protected)',
        DASHBOARD: '/dashboard',
        ADMIN: '/admin',
    },
};