/** User fingerprint generation */
const STORAGE_FINGERPRINT_KEY = "codiga-user";

const generateNewUUID = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

//// background.js ////

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
    );
    }
});

const generateFingerprint = () => {
    return new Promise((resolve) => {
        chrome.storage.sync.get([STORAGE_FINGERPRINT_KEY], (result) => {
            if(result && Object.keys(result).length === 0 && result.constructor === Object){
                const fingerprint = generateNewUUID();
                chrome.storage.sync.set({[STORAGE_FINGERPRINT_KEY]: fingerprint}, () => {
                    resolve(fingerprint);
                });
            } else {
                resolve(result[STORAGE_FINGERPRINT_KEY]);
            }
        });
    });
}

const createFileAnalysisMutation = (code, fingerprint, language) =>
`mutation {
    createFileAnalysis(language: ${language}, filename: "file.py", code: ${JSON.stringify(code)}, fingerprint: "${fingerprint}")
}`

const getFileAnalysisQuery = (fingerprint, analysisId) =>
`{
    getFileAnalysis(id: ${analysisId}, fingerprint: "${fingerprint}"){
        violations {
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
    }
}`

const createQueryBody = (query) => JSON.stringify({
    query,
    variables: {}
})

const validateCode = (request) => new Promise(async (resolve) => {
    const fingerprint = await generateFingerprint();
    const code = request.data.code;
    const language = request.data.language;

    var url = 'https://www.code-inspector.com/graphql';

    const createAnalysisResult = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: createQueryBody(createFileAnalysisMutation(code, fingerprint, language)),
    })
    const createAnalysisResultJSON = await createAnalysisResult.json();
    const analysisId = createAnalysisResultJSON.data.createFileAnalysis;

    const interval = setInterval(async function(){
        const getAnalysisResult = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: createQueryBody(getFileAnalysisQuery(fingerprint, analysisId))
        });
        const getAnalysisResultJSON = await getAnalysisResult.json();

        if(getAnalysisResultJSON.data.getFileAnalysis.status === "Done"){
            clearInterval(interval);
            resolve(getAnalysisResultJSON.data.getFileAnalysis.violations);
        }
    }, 3000);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { 
    
    if (request.contentScriptQuery == "validateCode") {
        validateCode(request).then(result =>{
            sendResponse(result);
        })
    };

    return true;
});