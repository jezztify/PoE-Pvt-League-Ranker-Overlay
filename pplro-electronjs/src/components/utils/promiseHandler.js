let setPromiseTimeout= async (ms, promise) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('TIMEOUT'))
        }, ms);

        promise()
        .then(value => {
            clearTimeout(timer);
            resolve(value);
        })
        .catch(reason => {
            clearTimeout(timer);
            reject(reason);
        })
    })
}

module.exports = {
    setPromiseTimeout: setPromiseTimeout
}