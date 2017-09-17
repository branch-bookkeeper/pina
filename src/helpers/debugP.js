export default message => arg => Promise.resolve(arg).then(res => console.log(message, res) || res);
