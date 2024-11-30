export let globals =
{
    development:
    {
        base_path: '/client/dist',
        back_path: 'http://localhost:8000'
    },
    live:
    {
        base_path: '',
        back_path: window.location.origin
    }
};