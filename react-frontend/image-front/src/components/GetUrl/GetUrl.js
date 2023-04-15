import axios from 'axios'

export function getIPv4Address(hostname) {
    let ip = "";
    const pattern = /^\d+\.\d+\.\d+\.\d+$/;
    if (hostname.match(pattern)) {
        ip = hostname;
    } else {
        const regex = /(\d+\.\d+\.\d+\.\d+)/gm;
        const match = regex.exec(hostname);
        if (match && match.length > 1) {
            ip = match[1];
        }
    }
    return ip;
}

export function getReqUrlAddress() {
    return axios.get('http://127.0.0.1:8001/api/get_req_url/')
    .then(response => {
      return response.data.req_url; // change 'ip_address' to 'req_url'
    })
    .catch(error => {
      console.log(error);
    });
}
