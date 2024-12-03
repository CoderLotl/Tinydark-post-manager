export let globals =
{
    development:
    {
        base_path: '/client/dist',
        back_path: 'http://localhost:80'
    },
    live:
    {
        base_path: '',
        back_path: window.location.origin
    }
};