const createFileAnalysisMutation = (code) =>
`mutation {
    createFileAnalysis(language: Javascript, filename: "file.js", code: ${JSON.stringify(code)}, fingerprint: "thisisatest")
}`

const getFileAnalysisMutation = (code) =>
`{
    getFileAnalysis(id:3, fingerprint: "josewantstodoanalysis"){
    violations{
      line
      description
      tool
      category
      rule
      severity
    }
    code
    status
    timestamp
    runningTimeSeconds
}`

const createQueryBody = (query) => JSON.stringify({
    query,
    variables: {}
})


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { 
    if (request.contentScriptQuery == "validateCode") {
        const code = request.data.code;

        var url = 'http://localhost:9000/graphql';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: createQueryBody(createFileAnalysisMutation(code)),
        })
        .then(res => res.json())
        .then(res => {
            const interval = setInterval(function(){

                fetch()
            }, 3000);
        })
        .catch(error => {
            console.log(error);
            sendResponse({});
        })
    };

    return true;
});