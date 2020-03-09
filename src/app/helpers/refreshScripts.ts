export function  refreshScripts(){
    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.src = '../../../assets/component_javascript.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
    console.log('Loaded Script');
}