const addScript = (src) => {
    var script = document.createElement( 'script' );
    script.src = src;
    script.async = true;

    document.body.appendChild(script);
};

export default () => {
    addScript(`https://www.google-analytics.com/analytics.js`);

    const ga = function () { ga.q.push(arguments); };
    ga.q = ga.q || [];
    ga.l = 1*new Date();

    window.ga = ga;
};
